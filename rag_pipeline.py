import os
import json
import logging
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pinecone import Pinecone, ServerlessSpec

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("rag_pipeline")

# Load environment variables
load_dotenv(Path(__file__).parent / "backend" / ".env")

# 1. Initialize Clients
api_key = os.getenv("PINECONE_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

pc = Pinecone(api_key=api_key) if api_key else None
client = genai.Client(api_key=gemini_key) if gemini_key else None
index_name = os.getenv("PINECONE_INDEX_NAME", "sih-rag-index")

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIMENSION = 768  # matches the existing live Pinecone index

# 2. Create Pinecone Index (if it does not exist)
index = None
if pc:
    try:
        indexes_list = pc.list_indexes()
        existing_indexes = (
            indexes_list.names()
            if hasattr(indexes_list, "names")
            else [idx.name if hasattr(idx, "name") else idx["name"] for idx in indexes_list]
        )

        if index_name not in existing_indexes:
            logger.info(f"Creating index: {index_name}...")
            pc.create_index(
                name=index_name,
                dimension=EMBEDDING_DIMENSION,  # matches existing live Pinecone index
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            logger.info("Index created successfully!")

        index = pc.Index(index_name)
    except Exception as e:
        logger.warning(f"Pinecone initialization skipped or failed: {e}")

# 3. Load & Process Real BIS Standards JSON Files
standards_dir = Path(__file__).parent / "data" / "standards"
chunks = []

if standards_dir.exists() and list(standards_dir.glob("*.json")):
    logger.info(f"Found real BIS standards JSON files in {standards_dir}")
    for json_file in standards_dir.glob("*.json"):
        with open(json_file, "r", encoding="utf-8") as f:
            std = json.load(f)

        std_id = std.get("standard_id", json_file.stem)
        std_num = std.get("standard_number", std_id)
        title = std.get("title", "")

        # Scope & Description chunk
        overview_text = f"Standard: {std_num} - {title}. Scope: {std.get('scope', '')}. Description: {std.get('description', '')}"
        chunks.append({
            "id": f"{std_id}-overview",
            "text": overview_text,
            "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "overview", "text": overview_text}
        })

        # Key requirements chunk
        reqs = std.get("key_requirements", [])
        if reqs:
            req_text_list = []
            for req in reqs:
                param = req.get("parameter", "")
                acc = req.get("acceptable_limit", "")
                perm = req.get("permissible_limit", "")
                unit = req.get("unit", "")
                req_text_list.append(f"{param}: Acceptable={acc} {unit}, Permissible={perm} {unit}. Requirement: {req.get('requirement', '')}")
            req_chunk_text = f"Standard: {std_num} Key Requirements:\n" + "\n".join(req_text_list)
            chunks.append({
                "id": f"{std_id}-requirements",
                "text": req_chunk_text,
                "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "key_requirements", "text": req_chunk_text}
            })

        # Sections chunks
        for i, sec in enumerate(std.get("sections", [])):
            sec_num = sec.get("section_number", str(i + 1))
            sec_title = sec.get("title", "")
            sec_content = sec.get("content", "")
            sec_text = f"Standard: {std_num} Section {sec_num} ({sec_title}): {sec_content}"
            chunks.append({
                "id": f"{std_id}-sec-{sec_num}",
                "text": sec_text,
                "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "section", "section_number": sec_num, "text": sec_text}
            })
else:
    logger.info("No JSON standards found in data/standards, using fallback sample standard.")
    sample_standard = {
        "id": "bis-standard-001",
        "text": "BIS IS 732: Code of practice for electrical wiring installations. All internal electrical wiring must follow earthing and conductor protection protocols.",
    }
    chunks.append({
        "id": sample_standard["id"],
        "text": sample_standard["text"],
        "metadata": {"text": sample_standard["text"]}
    })

# 4. Embed and Upsert Chunks to Pinecone
def index_standards():
    if not client or not index:
        logger.warning("Pinecone or Gemini client not configured. Skipping indexing.")
        return

    logger.info(f"Generating embeddings for {len(chunks)} chunks...")
    vectors_to_upsert = []
    for chunk in chunks:
        try:
            response = client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=chunk["text"],
                config=types.EmbedContentConfig(
                    task_type="RETRIEVAL_DOCUMENT",
                    output_dimensionality=EMBEDDING_DIMENSION,
                ),
            )
            embedding = response.embeddings[0].values
            vectors_to_upsert.append({
                "id": chunk["id"],
                "values": embedding,
                "metadata": chunk["metadata"]
            })
        except Exception as e:
            logger.error(f"Error embedding chunk {chunk['id']}: {e}")

    # Batch upsert
    batch_size = 100
    for i in range(0, len(vectors_to_upsert), batch_size):
        batch = vectors_to_upsert[i:i + batch_size]
        index.upsert(vectors=batch)

    logger.info(f"Successfully uploaded {len(vectors_to_upsert)} chunks to Pinecone!")

# 5. Reusable Retrieval Function
def query_standards(query_text: str, top_k: int = 2):
    if not client or not index:
        logger.warning("Client or index not initialized. Cannot perform query.")
        return []

    try:
        response = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=query_text,
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_QUERY",
                output_dimensionality=EMBEDDING_DIMENSION,
            ),
        )
        query_vector = response.embeddings[0].values
        results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)
        return results.get("matches", [])
    except Exception as e:
        logger.error(f"Error during query '{query_text}': {e}")
        return []

# Run test queries if executed directly
if __name__ == "__main__":
    # Index standards chunks into Pinecone vector database
    index_standards()

    test_queries = [

        "What are the acceptable limits for pH and TDS in drinking water according to IS 10500?",
        "What is the bend test procedure for metallic materials under IS 1599?",
        "What are the chemical composition requirements for carbon steel billets under IS 1875?"
    ]

    for q in test_queries:
        print(f"\nRunning test query: '{q}'")
        matches = query_standards(q, top_k=2)
        print("--- Retrieved Matches ---")
        for match in matches:
            score = match.get('score', 0.0)
            text = match.get('metadata', {}).get('text', '')
            print(f"Score: {score:.4f}")
            print(f"Content: {text}\n")