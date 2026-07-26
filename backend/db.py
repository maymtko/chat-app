import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

from settings import settings

raw_creds = settings.FIREBASE_CREDENTIALS

# 1. Handle string inputs (file path vs raw JSON string)
if isinstance(raw_creds, str):
    # Check if string is a path to an existing file (e.g., serviceAccount.json)
    if os.path.exists(raw_creds):
        with open(raw_creds, "r") as f:
            cred_dict = json.load(f)
    else:
        # Otherwise, parse as a raw JSON string
        cred_dict = json.loads(raw_creds)
else:
    cred_dict = raw_creds

if isinstance(cred_dict, dict) and "private_key" in cred_dict:
    cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")

cred = credentials.Certificate(cred_dict)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Connect Firestore
db = firestore.client()