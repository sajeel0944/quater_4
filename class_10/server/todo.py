from dataclasses import dataclass
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from schema import AddTodoListSchema, DeleteTodoSchema, UpdateTodoSchema

# ------------------------------------------------

load_dotenv()

# ------------------------------------------------

MONGO_URI = os.getenv("mongodp")

# ------------------------------------------------

@dataclass
class AddTodo:
    data: AddTodoListSchema

    def add_todo(self):
        try:
            client = MongoClient(MONGO_URI)
            db = client['ClassProject']
            collection = db['todos']

            todo_data = {
                "id": self.data.todos.id,
                "title": self.data.todos.title,
                "description": self.data.todos.description,
                "status": self.data.todos.status,
                "priority": self.data.todos.priority,
                "createdAt": self.data.todos.createdAt,
                "updatedAt": self.data.todos.updatedAt,
                "dueDate": self.data.todos.dueDate,
                "tags": self.data.todos.tags
            }

            find_user = collection.find_one({"email": self.data.email})

            if find_user:
                result = collection.update_one(
                    {"email": self.data.email},
                    {"$push": {"todos": todo_data}}
                )

                if result:
                    return {"status": "success", "message": "Todo added successfully"}
                else:
                    return {"status": "error", "message": "Failed to add todo"}
            else:
                result = collection.insert_one({"email": self.data.email, "todos": [todo_data]})

                if result:
                    return {"status": "success", "message": "Todo added successfully"}
                else:
                    return {"status": "error", "message": "Failed to add todo"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

# ------------------------------------------------

@dataclass
class GetTodo:
    email: str

    def get_todo(self):
        try:
            client = MongoClient(MONGO_URI)
            db = client['ClassProject']
            collection = db['todos']

            find_user = collection.find_one({"email": self.email})

            if find_user:
                data = find_user.get("todos", [])
                return data[::-1]  # Return todos in reverse order (most recent first)
            else:
                return []
        except Exception as e:
            return []
        
# ------------------------------------------------

@dataclass
class UpdatateTodo:
    data: UpdateTodoSchema

    def update_todo(self):
        try:
            client = MongoClient(MONGO_URI)
            db = client['ClassProject']
            collection = db['todos']

            update_fields = {
                f"todos.$.{key}": value
                for key, value in self.data.updated_data.dict(exclude_unset=True).items()
            }

            result = collection.update_one(
                {"email": self.data.email, "todos.id": self.data.todo_id},
                {"$set": update_fields}
            )

            if result.modified_count > 0:
                return {"status": "success", "message": "Todo updated successfully"}
            else:
                return {"status": "error", "message": "Failed to update todo"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        
# ------------------------------------------------

@dataclass
class DeleteTodo:
    data: DeleteTodoSchema

    def delete_todo(self):
        try:
            client = MongoClient(MONGO_URI)
            db = client['ClassProject']
            collection = db['todos']

            result = collection.update_one(
                {"email": self.data.email},
                {"$pull": {"todos": {"id": self.data.todo_id}}}
            )

            if result.modified_count > 0:
                return {"status": "success", "message": "Todo deleted successfully"}
            else:
                return {"status": "error", "message": "Failed to delete todo"}
        except Exception as e:
            return {"status": "error", "message": str(e)}