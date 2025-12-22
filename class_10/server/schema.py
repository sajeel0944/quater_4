from typing import List, Optional
from pydantic import BaseModel

class AddTodoSchema(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str 
    createdAt:str 
    updatedAt: str
    dueDate: Optional[str] = None
    tags: List[str]

class AddTodoListSchema(BaseModel):
    email: str
    todos: AddTodoSchema

class UpdateTodoSchema(BaseModel):
    email: str
    todo_id: str
    updated_data: AddTodoSchema

class DeleteTodoSchema(BaseModel):
    email: str
    todo_id: str