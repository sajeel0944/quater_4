export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | TodoStatus;

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
}

export interface UpdatedTodoSchema {
  email: string;
  todo_id: string;
  updated_data: Todo
}

export interface DeleteTodoSchema {
  email: string;
  todo_id: string;
}