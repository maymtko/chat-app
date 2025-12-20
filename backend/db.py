import firebase_admin
from firebase_admin import credentials, firestore
from settings import settings

cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

#connect firestore
db = firestore.client()

