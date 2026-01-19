from rag_engine import TransactionRAG
import sys

def test_rag():
    print("Initializing RAG system...")
    try:
        rag = TransactionRAG()
    except Exception as e:
        print(f"FAILED to initialize RAG: {e}")
        return

    queries = [
        "How much did I spend on food?",
        "What are my flight expenses?",
        "Did I pay rent in June?"
    ]

    for q in queries:
        print(f"\n--------------------------------------------------")
        print(f"Query: {q}")
        print(f"--------------------------------------------------")
        try:
            context = rag.retrieve_context(q, k=3)
            print("Retrieved Context:")
            print(context)
            
            # Simple assertions to verify relevance
            if "food" in q.lower() and ("Groceries" in context or "Dining" in context):
                print(">> SUCCESS: Relevant food transactions found.")
            elif "flight" in q.lower() and "Travel" in context:
                print(">> SUCCESS: Relevant travel transactions found.")
            elif "rent" in q.lower() and "Rent" in context:
                print(">> SUCCESS: Relevant rent transactions found.")
            else:
                print(">> WARNING: Check if context is truly relevant.")
                
        except Exception as e:
            print(f"FAILED during retrieval: {e}")

if __name__ == "__main__":
    test_rag()
