import type { DeleteTodoSchema, Todo, UpdatedTodoSchema } from "../types/todo";
import axios from "axios";

export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

export const AddTodos = async (data: Todo, email: string) => {
  try {
    const payload = {
      email: email,
      todos: data,
    };

    const response = await axios.post(`${BASE_URL}/add-todo`, payload);
    return response.data;
  } catch (error) {
    return { status: "error", message: "Failed to add todo" };
  }
};

// ----------------------------------------------

export const GetTodos = async (email: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-todos`, {
      params: { email: email },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

// ----------------------------------------------

export const UpdateTodo = async (payload: UpdatedTodoSchema) => {
  try {
    const response = await axios.put(`${BASE_URL}/update-todo`, payload);
    return response.data;
  } catch (error) {
    return { status: "error", message: "Failed to update todo" };
  }
};

// ----------------------------------------------

export const DeleteTodo = async (payload: DeleteTodoSchema) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete-todo`, {
      data: payload,
    });
    return response.data;
  } catch (error) {
    return { status: "error", message: "Failed to delete todo" };
  }
};
