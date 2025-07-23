from pydantic import BaseModel

class SetRoleRequest(BaseModel):
    role: str 