import json

import firebase_admin
from firebase_admin import credentials, firestore

from settings import settings

if isinstance(settings.FIREBASE_CREDENTIALS, str):
    # Load JSON string to dict
    cred_dict = json.loads(settings.FIREBASE_CREDENTIALS)
else:
    cred_dict = settings.FIREBASE_CREDENTIALS

if isinstance(cred_dict, dict) and "private_key" in cred_dict:
    cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")

cred = credentials.Certificate(cred_dict)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Connect Firestore
db = firestore.client()