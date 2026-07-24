from typing import Optional
from pydantic import BaseModel, EmailStr

class AuthSignupRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str
    photo_url: str

class AuthSigninRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    display_name: Optional[str] = ""
    photo_url: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    display_name: str | None = None
    photo_url: str | None = None

class SignUpResponse(BaseModel):
    success: bool
    data : UserResponse

class LogInData(BaseModel):
    access_token: str
    user: UserResponse

class LogInResponse(BaseModel):
    success: bool
    data : LogInData

class LogOutData(BaseModel):
    message: str

class LogOutResponse(BaseModel):
    success: bool
    data: LogOutData