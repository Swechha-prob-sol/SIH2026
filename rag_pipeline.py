import os
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
existing_indexes = indexes_list.names() if hasattr(indexes_list, "names") else [idx.name if hasattr(idx, "name") else idx["name"] for idx in indexes_list]

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

# 3. Embed and Upload 1 Sample BIS Standard
sample_standard = {
    "id": "bis-standard-001",
    "text": "BIS IS 732: Code of practice for electrical wiring installations. All internal electrical wiring must follow earthing and conductor protection protocols.",
}

print("Generating embedding for sample standard...")
response = client.embeddings.create(
    input=sample_standard["text"], model="text-embedding-3-small"
)
vector_embedding = response.data[0].embedding

index.upsert(
    vectors=[
        {
            "id": sample_standard["id"],
            "values": vector_embedding,
            "metadata": {"text": sample_standard["text"]},
        }
    ]
)
print("Sample standard uploaded to Pinecone!")

# 4. Test Retrieval
test_query = "What are the rules for electrical wiring and earthing?"
print(f"\nRunning test query: '{test_query}'")

query_vector = (
    client.embeddings.create(input=test_query, model="text-embedding-3-small")
    .data[0]
    .embedding
)

results = index.query(vector=query_vector, top_k=1, include_metadata=True)

print("\n--- Retrieved Matches ---")
for match in results.get("matches", []):
    print(f"Score: {match['score']:.4f}")
    print(f"Content: {match['metadata']['text']}")
