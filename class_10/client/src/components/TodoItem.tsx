import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Trash2,
  Edit2,
  Tag,
  Calendar,
  AlertCircle,
  Flag,
} from "lucide-react";
import type { Todo, UpdatedTodoSchema } from "../types/todo";
import { formatDate } from "../utils/helpers";
import { useUser } from "@clerk/clerk-react";
import { UpdateTodo } from "../Apis/todoApi";
import { useState } from "react";
import EditTodo from "./EditTodo";

export default function TodoItem({
  todo,
  onDelete,
  loadData,
  setLoadData,
  setLoading,
}: {
  todo: Todo;
  onDelete: (id: string) => void;
  setLoadData: (loading: boolean) => void;
  loadData: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const { user } = useUser();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const updateTodoStatus = async (todo: Todo) => {
    setLoading(true);
    try {
      if (!user) return;

      todo.status = "completed";

      const payload: UpdatedTodoSchema = {
        email: user.emailAddresses[0].emailAddress,
        todo_id: todo.id,
        updated_data: todo,
      };

      const res = await UpdateTodo(payload);

      if (res.status === "success") {
        setLoadData(!loadData);
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const getPriorityIcon = () => {
    switch (todo.priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <Flag className="w-4 h-4" />;
      case "low":
        return <Flag className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = () => {
    switch (todo.status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        layout
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <button
                onClick={() => updateTodoStatus(todo)}
                disabled={todo.status === "completed"}
                className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                  todo.status === "completed"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
                }`}
              >
                {todo.status === "completed" && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3
                    className={`text-lg font-semibold truncate ${
                      todo.status === "completed"
                        ? "line-through text-gray-500 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                        todo.priority === "high"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          : todo.priority === "medium"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      }`}
                    >
                      {getPriorityIcon()}
                      {todo.priority}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        todo.status === "completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : todo.status === "in-progress"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      }`}
                    >
                      {todo.status}
                    </span>
                  </div>
                </div>

                {todo.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {todo.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {todo.dueDate && (
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(todo.dueDate)}
                        </span>
                      </div>
                    )}

                    {todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {todo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center"
                          >
                            <Tag className="w-3 h-3 mr-1.5 flex-shrink-0" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors cursor-pointer"
                      aria-label="Edit todo"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(todo.id)}
                      className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors cursor-pointer"
                      aria-label="Delete todo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>Created {formatDate(todo.createdAt)}</span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}
              />
              <span className="text-gray-600 dark:text-gray-300 capitalize">
                {todo.status}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar based on priority */}
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width:
                todo.priority === "high"
                  ? "100%"
                  : todo.priority === "medium"
                  ? "70%"
                  : "40%",
            }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full ${getPriorityColor()}`}
          />
        </div>
      </motion.div>
      {editingTodo && (
        <EditTodo
          editingTodo={editingTodo}
          loadData={loadData}
          setLoadData={setLoadData}
          setEditingTodo={setEditingTodo}
        />
      )}
    </>
  );
}
