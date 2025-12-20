from jose import jwt
from fastapi import HTTPException,APIRouter, Depends,Request,Response
from settings import settings
from models.auth import AuthRequest, LogInResponse, UserResponse, SignUpResponse, LogOutResponse
from firebase_admin import auth
from db import db
import requests
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup",response_model=SignUpResponse)
async def create_account(payload: AuthRequest):
    user = auth.create_user(
        email=payload.email,
        password=payload.password
    )
    return SignUpResponse(
            success=True,
            data={"id": user.uid, "email":user.email }
        )

@router.post("/login",response_model=LogInResponse)
async def login(payload: AuthRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_API_KEY}"

    res = requests.post(url, json={
        "email": payload.email,
        "password": payload.password,
        "returnSecureToken": True
    })

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    firebase_uid = res.json()["localId"]
    firebase_data = res.json()
    print(firebase_uid,firebase_data)
    token = jwt.encode({
        "sub": firebase_uid,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }, settings.APP_SECRET, algorithm="HS256")

    data = {
        "access_token": token, 
        "user":{
            "id":firebase_uid,
            "email":firebase_data["email"],
        }
    }
    return LogInResponse(
        success=True,
        data=data
    )
    

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.APP_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user(request:Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user_id

@router.get("/user")
def user(user_id=Depends(get_current_user)):
    return {
        "user_id": user_id
    }


@router.post("/logout",response_model=LogOutResponse)
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=False,     
        samesite="lax"
    )

    return LogOutResponse(
            success=True,
            data={"message": "Logged out successfully"}
        )
