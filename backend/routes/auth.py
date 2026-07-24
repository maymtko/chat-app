from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from firebase_admin import auth
from jose import JWTError, jwt

from models.auth import (
    AuthSigninRequest,
    AuthSignupRequest,
    LogInData,
    LogInResponse,
    LogOutData,
    LogOutResponse,
    SignUpResponse,
    UpdateProfileRequest,
    UserResponse,
)
from settings import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup",response_model=SignUpResponse)
async def create_account(payload: AuthSignupRequest):
    user = auth.create_user(
        email=payload.email,
        password=payload.password,
        display_name=payload.display_name,
        photo_url=payload.photo_url
    )
    return SignUpResponse(
            success=True,
            data=UserResponse(
                id=user.uid,
                email=user.email,
                display_name=user.display_name,
                photo_url=user.photo_url
            )
        )

@router.post("/login",response_model=LogInResponse)
async def login(payload: AuthSigninRequest):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_API_KEY}"

    async with httpx.AsyncClient() as client:
        res = await client.post(
            url,
            json={
                "email": payload.email,
                "password": payload.password,
                "returnSecureToken": True,
            },
        )

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    firebase_uid = res.json()["localId"]
    firebase_data = res.json()
    print(firebase_uid,firebase_data)
    token = jwt.encode({
        "sub": firebase_uid,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }, settings.APP_SECRET, algorithm="HS256")

    return LogInResponse(
        success=True,
        data=LogInData(
            access_token=token,
            user=UserResponse(id=firebase_uid, email=firebase_data["email"],display_name=firebase_data.get("displayName", ""),photo_url=firebase_data.get("profilePicture",""))
        )
    )


def verify_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.APP_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except JWTError:
        return None

def get_current_user(request:Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user_id

# @router.get("/user")
# def user(user_id=Depends(get_current_user)):
#     return {
#         "id": user_id,
#     }

@router.get("/me", response_model=SignUpResponse)
def get_user(user_id: str = Depends(get_current_user)):
    try:
        user = auth.get_user(user_id)
        return SignUpResponse(
            success=True,
            data=UserResponse(
                id=user.uid,
                email=user.email,
                display_name=user.display_name or "",
                photo_url=user.photo_url or ""
            ),
        )

    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")

@router.patch("/me", response_model=SignUpResponse)
def update_me(
    payload: UpdateProfileRequest,
    user_id: str = Depends(get_current_user),   
):
    updates = {}

    if payload.display_name is not None:
        updates["display_name"] = payload.display_name

    if payload.photo_url is not None:
        updates["photo_url"] = payload.photo_url

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No fields to update."
        )

    user = auth.update_user(user_id, **updates)

    return SignUpResponse(
        success=True,
        data=UserResponse(
            id=user.uid,
            email=user.email,
            display_name=user.display_name or "",
            photo_url=user.photo_url or "",
        ),
    )

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
            data=LogOutData(message="Logged out successfully")
        )
