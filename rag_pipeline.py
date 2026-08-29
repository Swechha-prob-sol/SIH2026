import os
import json
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

# Load environment variables
load_dotenv()

# 1. Initialize Clients
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
index_name = os.getenv("PINECONE_INDEX_NAME", "sih-rag-index")

# 2. Create Pinecone Index (if it does not exist)
indexes_list = pc.list_indexes()
existing_indexes = (
    indexes_list.names()
    if hasattr(indexes_list, "names")
    else [idx.name if hasattr(idx, "name") else idx["name"] for idx in indexes_list]
)

if index_name not in existing_indexes:
    print(f"Creating index: {index_name}...")
    pc.create_index(
        name=index_name,
        dimension=1536,  # Vector size for text-embedding-3-small
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    print("Index created successfully!")

index = pc.Index(index_name)

# 3. Load & Process Real BIS Standards JSON Files
standards_dir = Path(__file__).parent / "data" / "standards"
chunks = []

if standards_dir.exists() and list(standards_dir.glob("*.json")):
    print(f"Found real BIS standards JSON files in {standards_dir}")
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
    print("No JSON standards found in data/standards, using fallback sample standard.")
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
print(f"Generating embeddings for {len(chunks)} chunks...")

vectors_to_upsert = []
for chunk in chunks:
    response = client.embeddings.create(
        input=chunk["text"], model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    vectors_to_upsert.append({
        "id": chunk["id"],
        "values": embedding,
        "metadata": chunk["metadata"]
    })

# Batch upsert
batch_size = 100
for i in range(0, len(vectors_to_upsert), batch_size):
    batch = vectors_to_upsert[i:i + batch_size]
    index.upsert(vectors=batch)

print(f"Successfully uploaded {len(vectors_to_upsert)} chunks to Pinecone!")

# 5. Test Retrieval
test_query = "What are the acceptable limits for pH and TDS in drinking water according to IS 10500?"
print(f"\nRunning test query: '{test_query}'")

query_vector = (
    client.embeddings.create(input=test_query, model="text-embedding-3-small")
    .data[0]
    .embedding
)

results = index.query(vector=query_vector, top_k=2, include_metadata=True)

print("\n--- Retrieved Matches ---")
for match in results.get("matches", []):
    print(f"Score: {match['score']:.4f}")
    print(f"Content: {match['metadata']['text']}\n")
