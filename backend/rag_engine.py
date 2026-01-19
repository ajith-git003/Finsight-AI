import os
import pandas as pd
import asyncio
from concurrent.futures import ThreadPoolExecutor
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

class TransactionRAG:
    def __init__(self, csv_path: str = "sample_transactions.csv"):
        self.csv_path = csv_path
        self.vector_store = None
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self._initialize_vector_store()

    def _initialize_vector_store(self):
        """Load CSV, create documents, and initialize FAISS vector store."""
        if not os.path.exists(self.csv_path):
            # If path is relative, try to find it relative to this file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            self.csv_path = os.path.join(current_dir, self.csv_path)

        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Transaction CSV not found at {self.csv_path}")

        df = pd.read_csv(self.csv_path)
        
        documents = []
        for _, row in df.iterrows():
            # Create a semantic representation of the transaction
            content = (
                f"Date: {row['date']}, "
                f"Category: {row['category']}, "
                f"Amount: {row['amount']}, "
                f"Description: {row['description']}, "
                f"Type: {row.get('type', 'debit')}"
            )
            
            # Add metadata for potential filtering later (optional but good practice)
            metadata = {
                "date": row['date'],
                "category": row['category'],
                "amount": row['amount'],
                "description": row['description']
            }
            
            documents.append(Document(page_content=content, metadata=metadata))

        # Create FAISS index
        print("Creating embeddings and initializing FAISS vector store...")
        self.vector_store = FAISS.from_documents(documents, self.embeddings)
        print("Vector store initialized.")

    async def retrieve_context(self, query: str, k: int = 5) -> str:
        """
        Retrieve the top k most relevant transactions for a given query asynchronously.
        Returns a formatted string of the retrieved transactions.
        """
        if not self.vector_store:
            raise ValueError("Vector store not initialized.")

        # FAISS search is CPU-bound, so run it in a separate thread to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            docs = await loop.run_in_executor(pool, lambda: self.vector_store.similarity_search(query, k=k))
        
        # Format the retrieved docs for the LLM
        context_parts = []
        for i, doc in enumerate(docs, 1):
            context_parts.append(f"{i}. {doc.page_content}")
            
        return "\n".join(context_parts)

if __name__ == "__main__":
    # Simple test if run directly
    rag = TransactionRAG()
    test_query = "How much did I spend on food?"
    print(f"\nQuery: {test_query}")
    print("Retrieved Context:")
    print(rag.retrieve_context(test_query))
