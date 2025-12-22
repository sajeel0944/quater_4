import type { Todo, TodoStats } from "../types/todo";

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date?: Date | string | number): string => {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);
  // If date is invalid, return empty string to avoid runtime errors
  if (Number.isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export const calculateStats = (todos: Todo[]): TodoStats => {
  return {
    total: todos.length,
    completed: todos.filter(todo => todo.status === 'completed').length,
    pending: todos.filter(todo => todo.status === 'pending').length,
    inProgress: todos.filter(todo => todo.status === 'in-progress').length,
    highPriority: todos.filter(todo => todo.priority === 'high').length,
  };
};