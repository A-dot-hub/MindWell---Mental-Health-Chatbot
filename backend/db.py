from pymongo import MongoClient

MONGO_URI = "mongodb+srv://jayeshdhamal03:jayeshdhamal003@cluster01.k7got.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01"

client = MongoClient(MONGO_URI)

db = client["health_app"]

# Collections
users_collection = db["users"]
chat_collection = db["chat_history"]  # ✅ THIS WAS MISSING
