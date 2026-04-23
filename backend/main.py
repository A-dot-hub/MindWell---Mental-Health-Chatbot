from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from db import users_collection
from passlib.context import CryptContext
from utils import send_otp_email
import secrets
import time
import threading
import os

from deep_translator import GoogleTranslator

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
otp_store = {}

# ---------------- MIDDLEWARE ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SYSTEM_PROMPT = (
    "You are a calm, kind, and emotionally supportive mental health assistant. "
    "Respond with warmth, empathy, and gentle encouragement. "
    "Keep replies short and caring (2–4 sentences). "
    "Use simple, human language and light emojis (1–2 max) like 💙 or 😊. "
    "Match the user’s emotional tone and language when possible. "
    "Do not give medical, technical, or political advice."
)



# MODEL_NAME = "phi"
# OLLAMA_URL = "http://127.0.0.1:11434/v1/chat/completions"
MODEL_NAME = "llama-3.1-8b-instant"


OLLAMA_URL = "https://api.groq.com/openai/v1/chat/completions"



LANG_CODE_MAP = {
    "en-US": "en",
    "hi-IN": "hi",
    "mr-IN": "mr"
}



@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()

    user_message = data.get("text", "").strip()
    language = data.get("language", "en")
    source_lang = LANG_CODE_MAP.get(language, "en")

    if not user_message:
        return {"reply": "I’m here whenever you want to talk 💙"}

    # 1️⃣ Translate → English
    try:
        user_message_en = (
            GoogleTranslator(source=source_lang, target="en")
            .translate(user_message)
            if source_lang != "en"
            else user_message
        )
    except:
        user_message_en = user_message

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message_en}
        ],
        "temperature": 0.4,
        "max_tokens": 200
    }

    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()

        bot_reply_en = response.json()["choices"][0]["message"]["content"]

        # 2️⃣ Translate back → user language
        try:
            final_reply = (
                GoogleTranslator(source="en", target=source_lang)
                .translate(bot_reply_en)
                if source_lang != "en"
                else bot_reply_en
            )
        except:
            final_reply = bot_reply_en

        return {"reply": final_reply}

    except Exception as e:
        print("Chat error:", e)
        return {"reply": "I’m here with you. Please try again in a moment 💙"}


# ---------------- AUTH & OTP ----------------

@app.post("/signup")
async def signup(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {"success": False, "message": "Username and password required"}

    if users_collection.find_one({"username": username}):
        return {"success": False, "message": "Username already taken"}

    hashed_password = pwd_context.hash(password)
    users_collection.insert_one({"username": username, "password": hashed_password})
    return {"success": True, "message": "Signup successful"}

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username})
    if not user or not pwd_context.verify(password, user["password"]):
        return {"success": False, "message": "Invalid username or password"}

    return {"success": True, "message": "Login successful"}

@app.post("/send-otp")
async def send_otp(request: Request):
    data = await request.json()
    email = data.get("email")

    otp = str(secrets.randbelow(1000000)).zfill(6)
    otp_store[email] = {"otp": otp, "timestamp": time.time()}

    try:
        await send_otp_email(email, otp)
        return {"success": True, "message": "OTP sent successfully"}
    except:
        return {"success": False, "message": "Failed to send OTP"}

@app.post("/verify-otp")
async def verify_otp(request: Request):
    data = await request.json()
    email = data.get("email")
    otp = data.get("otp")
    password = data.get("password")

    record = otp_store.get(email)
    if not record or record["otp"] != otp:
        return {"success": False, "message": "Invalid or expired OTP"}

    if time.time() - record["timestamp"] > 300:
        del otp_store[email]
        return {"success": False, "message": "OTP expired"}

    hashed_password = pwd_context.hash(password)
    users_collection.insert_one({"username": email, "password": hashed_password})
    del otp_store[email]

    return {"success": True, "message": "OTP verified and account created"}
