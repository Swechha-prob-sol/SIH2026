import os
import json
import logging
from pathlib import Path
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
except Exception:
    genai = None
    types = None

try:
    from pinecone import Pinecone, ServerlessSpec
except Exception:
    Pinecone = None
    ServerlessSpec = None


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

# 3. Load & Process Real BIS Standards and Schemes JSON Files
data_dirs = [
    Path(__file__).parent / "data" / "standards",
    Path(__file__).parent / "data" / "schemes"
]
chunks = []

json_files = []
for d in data_dirs:
    if d.exists():
        json_files.extend(d.glob("*.json"))

if json_files:
    logger.info(f"Found {len(json_files)} BIS standards & schemes JSON files in data directory.")
    for json_file in json_files:
        with open(json_file, "r", encoding="utf-8") as f:
            std = json.load(f)

        std_id = std.get("standard_id", json_file.stem)
        std_num = std.get("standard_number", std_id)
        title = std.get("title", "")

        # Scope & Description chunk
        overview_text = f"Document: {std_num} - {title}. Scope: {std.get('scope', '')}. Description: {std.get('description', '')}"
        chunks.append({
            "id": f"{std_id}-overview",
            "text": overview_text,
            "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "overview", "text": overview_text}
        })

        # Key requirements — one chunk PER PARAMETER for precise retrieval
        reqs = std.get("key_requirements", [])
        for req_idx, req in enumerate(reqs):
            param = req.get("parameter", "")
            acc = req.get("acceptable_limit", "")
            perm = req.get("permissible_limit", "")
            unit = req.get("unit", "")
            req_text = (
                f"Document: {std_num} - {title}. "
                f"Parameter: {param}. "
                f"Acceptable Limit: {acc} {unit}. "
                f"Permissible Limit (in absence of alternate source): {perm} {unit}. "
                f"Requirement: {req.get('requirement', '')}. "
                f"Test Method: {req.get('test_method', '')}. "
                f"Clause: {req.get('clause_reference', '')}."
            )
            param_slug = param.lower().replace(" ", "_").replace("(", "").replace(")", "")
            param_slug = "".join(c for c in param_slug if ord(c) < 128)[:40]
            chunks.append({
                "id": f"{std_id}-req-{param_slug}-{req_idx}",
                "text": req_text,
                "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "key_requirement", "parameter": param, "text": req_text}
            })

        # Laboratories chunk (if present)
        labs = std.get("laboratories", [])
        if labs:
            for lab in labs:
                lab_id = lab.get("lab_id", "")
                lab_name = lab.get("name", "")
                region = lab.get("region", "")
                city = lab.get("city", "")
                state = lab.get("state", "")
                cat = lab.get("category", "")
                stds = ", ".join(lab.get("primary_standards_tested", []))
                lab_text = f"BIS Recognized Testing Laboratory: {lab_name} ({lab_id}). Region: {region}. Location: {city}, {state}. Category: {cat}. Primary Standards Tested: {stds}. Status: {lab.get('recognition_status', '')}."
                chunks.append({
                    "id": f"{std_id}-lab-{lab_id}",
                    "text": lab_text,
                    "metadata": {"standard_id": std_id, "standard_number": std_num, "title": lab_name, "type": "laboratory", "text": lab_text}
                })

        # Sections chunks
        for i, sec in enumerate(std.get("sections", [])):
            sec_num = sec.get("section_number", str(i + 1))
            sec_title = sec.get("title", "")
            sec_content = sec.get("content", "")
            sec_text = f"Document: {std_num} Section {sec_num} ({sec_title}): {sec_content}"
            chunks.append({
                "id": f"{std_id}-sec-{sec_num}",
                "text": sec_text,
                "metadata": {"standard_id": std_id, "standard_number": std_num, "title": title, "type": "section", "section_number": sec_num, "text": sec_text}
            })
else:
    logger.info("No JSON files found, using fallback sample standard.")
    sample_standard = {
        "id": "bis-standard-001",
        "text": "BIS IS 732: Code of practice for electrical wiring installations. All internal electrical wiring must follow earthing and conductor protection protocols.",
    }
    chunks.append({
        "id": sample_standard["id"],
        "text": sample_standard["text"],
        "metadata": {"text": sample_standard["text"]}
    })

def index_standards():
    if not client or not index:
        logger.warning("Pinecone or Gemini client not configured. Skipping indexing.")
        return

    import time
    logger.info(f"Generating embeddings for {len(chunks)} chunks in batches...")
    vectors_to_upsert = []
    batch_size = 20

    for i in range(0, len(chunks), batch_size):
        chunk_batch = chunks[i:i + batch_size]
        texts = [c["text"] for c in chunk_batch]
        max_retries = 4

        for attempt in range(max_retries):
            try:
                response = client.models.embed_content(
                    model=EMBEDDING_MODEL,
                    contents=texts,
                    config=types.EmbedContentConfig(
                        task_type="RETRIEVAL_DOCUMENT",
                        output_dimensionality=EMBEDDING_DIMENSION,
                    ),
                )
                for chunk, emb in zip(chunk_batch, response.embeddings):
                    vectors_to_upsert.append({
                        "id": chunk["id"],
                        "values": emb.values,
                        "metadata": chunk["metadata"]
                    })
                logger.info(f"Embedded batch {i // batch_size + 1}/{(len(chunks) + batch_size - 1) // batch_size} ({len(vectors_to_upsert)}/{len(chunks)} chunks)")
                time.sleep(1.0)
                break
            except Exception as e:
                logger.warning(f"Error embedding batch starting at index {i} (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    sleep_time = (attempt + 1) * 10
                    logger.info(f"Sleeping {sleep_time}s before retrying...")
                    time.sleep(sleep_time)
                else:
                    logger.error(f"Failed to embed batch starting at index {i} after {max_retries} attempts.")

    # Upsert to Pinecone
    logger.info(f"Upserting {len(vectors_to_upsert)} vectors to Pinecone...")
    upsert_batch_size = 50
    for i in range(0, len(vectors_to_upsert), upsert_batch_size):
        batch = vectors_to_upsert[i:i + upsert_batch_size]
        index.upsert(vectors=batch)

    logger.info(f"Successfully uploaded {len(vectors_to_upsert)} chunks to Pinecone!")

# 5. Reusable Retrieval Function
def query_standards(query_text: str, top_k: int = 2):
    matches = []
    
    # Try Pinecone vector search first
    if client and index:
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
            MIN_SCORE = 0.5
            matches = [m for m in results.get("matches", []) if m.get("score", 0) >= MIN_SCORE]
        except Exception as e:
            logger.error(f"Error during Pinecone query '{query_text}': {e}")

    # Robust local fallback search across loaded standard chunks if vector search returns no results
    if not matches and chunks:
        logger.info(f"Vector search returned no results. Performing local fallback search across {len(chunks)} chunks...")
        query_words = [w.lower() for w in query_text.split() if len(w) > 2]
        scored_chunks = []
        for chunk in chunks:
            text_lower = chunk["text"].lower()
            match_count = sum(1 for word in query_words if word in text_lower)
            if match_count > 0:
                rel_score = min(0.98, round(0.60 + (match_count * 0.08), 2))
                scored_chunks.append({
                    "score": rel_score,
                    "metadata": chunk["metadata"]
                })
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        matches = scored_chunks[:top_k]

    return matches

# Automatically run indexing when module is initialized if index is empty
try:
    if index_standards and client and index:
        index_stats = index.describe_index_stats()
        total_vectors = index_stats.get("total_vector_count", 0)
        if total_vectors == 0:
            logger.info("Pinecone index is empty. Automatically indexing BIS standards and schemes...")
            index_standards()
except Exception as idx_err:
    logger.warning(f"Auto-indexing check skipped: {idx_err}")

# 6. "Recommend Standards" Helper Function (For Member 4 - Compliance Checker)
def recommend_standards_for_product(product_description: str, top_k: int = 3):
    """
    Given a product description (e.g. 'packaged drinking water', 'gold jewellery', 'lithium ion battery'),
    retrieves matching BIS standards, certification schemes, and accredited testing laboratories using Gemini.
    """
    query = f"Applicable BIS Indian Standards, certification scheme rules, and testing requirements for {product_description}"
    matches = query_standards(query, top_k=top_k)

    recommended_standards = []
    applicable_schemes = []
    recommended_labs = []

    for match in matches:
        metadata = match.get("metadata", {})
        score = round(match.get("score", 0.0), 4)
        chunk_type = metadata.get("type", "")

        item_info = {
            "title": metadata.get("title") or metadata.get("standard_number"),
            "standard_number": metadata.get("standard_number"),
            "relevance_score": score,
            "matched_excerpt": metadata.get("text", "")
        }

        if chunk_type == "laboratory":
            recommended_labs.append(item_info)
        elif "scheme" in str(metadata.get("standard_id", "")).lower() or "scheme" in str(metadata.get("title", "")).lower():
            applicable_schemes.append(item_info)
        else:
            recommended_standards.append(item_info)

    return {
        "product_description": product_description,
        "total_matches_found": len(matches),
        "recommended_standards": recommended_standards,
        "applicable_schemes": applicable_schemes,
        "accredited_testing_labs": recommended_labs
    }

# 6. Generate a formatted answer using Gemini from retrieved chunks
def generate_answer(query_text: str, matches: list) -> str:
    if not client:
        logger.warning("Gemini client not configured. Cannot generate answer.")
        return "Answer generation is not available right now."

    context_text = "\n\n".join(
        match.get("metadata", {}).get("text", "") for match in matches
    )

    prompt = f"""You are an expert assistant on BIS (Bureau of Indian Standards) standards and certification schemes.

Your job is to answer questions using ONLY the context provided below. Always give specific numeric values, limits, and clause references when available in the context.

Context:
{context_text}

Question: {query_text}

Answer in this exact structure:
1. Start with the standard name/number and a direct answer to the question.
2. List all specific numeric limits clearly using bullet points, like:
   - **Acceptable Limit:** [value] [unit]
   - **Permissible Limit (in absence of alternate source):** [value] [unit]
3. Add a short "Context:" paragraph (2-3 sentences) explaining what the parameter means and when the permissible limit applies.
4. End with a "Source:" line citing the exact standard number, table, and clause reference from the context.

Rules:
- NEVER make up numbers. Only use values explicitly present in the context.
- If the context does not contain the specific value asked for, say: "The provided context does not contain this specific value."
- Always use **bold** for numeric limits and key terms.
- Do not add any preamble or closing remarks outside the structure above.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        logger.error(f"Error generating answer for '{query_text}': {e}")
        return "Sorry, I couldn't generate an answer right now."

# Run test queries if executed directly
if __name__ == "__main__":
    # Index standards chunks into Pinecone vector database
    index_standards()

    test_queries = [
        "What are the acceptable limits for pH and TDS in drinking water according to IS 10500?",
        "What are the mandatory hallmarking purity grades and HUID rules for gold jewellery?",
        "Which electronics require self-declaration of conformity under the BIS Compulsory Registration Scheme (CRS)?",
        "Which BIS testing laboratories in Northern Region test drinking water and steel?"
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

    print("\n--- Testing Product Recommendation for Member 4 ---")
    rec = recommend_standards_for_product("22K Gold Jewellery Ring")
    print(json.dumps(rec, indent=2))