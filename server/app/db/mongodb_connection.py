from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app.core.settings import MONGODB_URI

def connect_to_mongodb():
    try:
        print(f"Connecting to {MONGODB_URI}")
        # Replace the following with your MongoDB connection details
        client = MongoClient(MONGODB_URI)
        
        # Test the connection
        client.admin.command('ismaster')
        
        print("Connected to MongoDB successfully!")
        return client
    except ConnectionFailure as e:
        print("Failed to connect to MongoDB:", e)
        return None

# Connecting to MongoDB
mongo_client = connect_to_mongodb()