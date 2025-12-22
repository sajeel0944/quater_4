import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Filter, ChevronDown } from "lucide-react";
import TodoItem from "./TodoItem";
import type { Todo, FilterType } from "../types/todo";
import { useState } from "react";

const filters: { value: FilterType; label: string; icon?: string }[] = [
  { value: "all", label: "All Tasks" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TodoList({
  todos,
  filter,
  onDelete,
  onFilterChange,
  loadData,
  setLoadData,
  setLoading,
}: {
  todos: Todo[];
  filter: FilterType;
  onDelete: (id: string) => void;
  onFilterChange: (filter: FilterType) => void;
  setLoadData: (loading: boolean) => void;
  loadData: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filteredTodos =
    filter === "all" ? todos : todos.filter((todo) => todo.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <ListTodo className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Tasks
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {filteredTodos.length} of {todos.length} tasks
            </p>
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300"
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {filters.find((f) => f.value === filter)?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFilterOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
              {filters.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    onFilterChange(value);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    filter === value
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  } ${value === "all" ? "rounded-t-xl" : ""} ${
                    value === "completed" ? "rounded-b-xl" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Filter Buttons */}
        <div className="hidden sm:flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                filter === value
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredTodos.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <Filter className="w-10 h-10 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
              {filter === "all"
                ? "Start by adding your first task using the form on the right!"
                : `No ${filter} tasks. Try changing the filter above.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4"
          >
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={onDelete}
                  loadData={loadData}
                  setLoadData={setLoadData}
                  setLoading={setLoading}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
