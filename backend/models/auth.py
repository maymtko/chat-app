from pydantic import BaseModel, EmailStr

class AuthRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr

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