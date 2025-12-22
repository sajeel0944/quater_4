from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from schema import AddTodoListSchema, DeleteTodoSchema, UpdateTodoSchema
from todo import AddTodo, DeleteTodo, GetTodo, UpdatateTodo

# --------------------------------------------------------------------

app = FastAPI()

# --------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://health-nex-ai-1ca4.vercel.app", "https://health-nex-8o690wdao-sajeel0944s-projects.vercel.app"],
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allow_headers=["*"],
    allow_credentials=True,
)

# --------------------------------------------------------------------

@app.post("/add-todo")
def add_todo_endpoint(payload: AddTodoListSchema):
    try:
        add = AddTodo(data=payload)
        result = add.add_todo()
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
# --------------------------------------------------------------------

@app.get("/get-todos")
def get_todo_endpoint(email: str):
    try:
        get = GetTodo(email=email)
        result = get.get_todo()
        return result
    except Exception as e:
        return []
    
# --------------------------------------------------------------------

@app.put("/update-todo")
def update_todo_endpoint(playload: UpdateTodoSchema):
    try:
        updated = UpdatateTodo(data=playload)
        result = updated.update_todo()
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
# --------------------------------------------------------------------

@app.delete("/delete-todo")
def delete_todo_endpoint(payload: DeleteTodoSchema):
    try:
        delete = DeleteTodo(data=payload)
        result = delete.delete_todo()
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}