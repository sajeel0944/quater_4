import { motion } from "framer-motion";
import type {
  Todo,
  TodoPriority,
  TodoStatus,
  UpdatedTodoSchema,
} from "../types/todo";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { AlertCircle, Calendar, Clock, Tag, X } from "lucide-react";
import { UpdateTodo } from "../Apis/todoApi";
import toast from "react-hot-toast";

const statusOptions: { value: TodoStatus; label: string }[] = [
  { value: "pending", label: "🟡 Pending" },
  { value: "in-progress", label: "🔵 In Progress" },
  { value: "completed", label: "🟢 Completed" },
];

const priorityOptions: {
  value: TodoPriority;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "🟢 Low", color: "text-green-600" },
  { value: "medium", label: "🟡 Medium", color: "text-yellow-600" },
  { value: "high", label: "🔴 High", color: "text-red-600" },
];
const EditTodo = ({
  editingTodo,
  setLoadData,
  loadData,
  setEditingTodo,
}: {
  editingTodo: Todo;
  setLoadData: (loading: boolean) => void;
  loadData: boolean;
  setEditingTodo: (value: Todo | null) => void;
}) => {
  const [title, setTitle] = useState(editingTodo?.title || "");
  const [description, setDescription] = useState(
    editingTodo?.description || ""
  );
  const [status, setStatus] = useState<TodoStatus>(
    editingTodo?.status || "pending"
  );
  const [priority, setPriority] = useState<TodoPriority>(
    editingTodo?.priority || "medium"
  );
  const [tags, setTags] = useState<string[]>(editingTodo?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [dueDate, setDueDate] = useState<string>(
    editingTodo?.dueDate
      ? new Date(editingTodo.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;
    setLoading(true);
    try {
      if (!user) return;

      const todoData: Todo = {
        id: editingTodo.id,
        title: title.trim(),
        description: description.trim() || "",
        status,
        priority,
        tags,
        createdAt: editingTodo.createdAt,
        updatedAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };

      const payload: UpdatedTodoSchema = {
        email: user.emailAddresses[0].emailAddress,
        todo_id: todoData.id,
        updated_data: todoData,
      };

      const res = await UpdateTodo(payload);

      if (res.status === "success") {
        toast.success("Task updated successfully!");
        setLoadData(!loadData);
      } else {
        toast.error("Failed to update task. Please try again.");
      }
    } catch {
      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("medium");
    setTags([]);
    setDueDate("");
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCancel = () => {
    resetForm();
    setEditingTodo(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 bg-opacity-50 p-4 h-full"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 fixed top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2 z-50 h-[560px] overflow-auto"
        style={{
          scrollbarWidth: "none",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              ✨ New Task
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Add details about the task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TodoStatus)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className={option.color}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add tags (press Enter to add)"
                />
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl ${
                loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading}
            >
              {loading ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};
export default EditTodo;
