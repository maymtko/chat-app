import base64
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

from settings import settings

raw_creds = settings.FIREBASE_CREDENTIALS

cred_dict = None

# 1. Handle string inputs
if isinstance(raw_creds, str):
    # Case A: Path to local file
    if os.path.exists(raw_creds):
        with open(raw_creds, "r") as f:
            cred_dict = json.load(f)
    else:
        # Case B: Try Base64 Decoding first
        try:
            decoded_bytes = base64.b64decode(raw_creds)
            cred_dict = json.loads(decoded_bytes.decode("utf-8"))
        except Exception:
            # Case C: Fallback to raw JSON string
            cred_dict = json.loads(raw_creds)
elif isinstance(raw_creds, dict):
    cred_dict = raw_creds

# 2. Fix escaped newlines in private key if needed
if isinstance(cred_dict, dict) and "private_key" in cred_dict:
    cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")

# 3. Initialize Firebase SDK
cred = credentials.Certificate(cred_dict)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()