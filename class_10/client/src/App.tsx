import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, Calendar, Menu, X } from "lucide-react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import StatsCard from "./components/StatsCard";
import ThemeToggle from "./components/ThemeToggle";
import type { Todo, FilterType, DeleteTodoSchema } from "./types/todo";
import { calculateStats } from "./utils/helpers";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import { DeleteTodo, GetTodos } from "./Apis/todoApi";
import { useUser } from "@clerk/clerk-react";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [loadData, setLoadData] = useState(true);

  const stats = calculateStats(todos);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const read = async () => {
      try {
        setLoading(true);
        const res = await GetTodos(user.emailAddresses[0].emailAddress);
        setTodos(res);
      } catch {
        console.error("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    read();
  }, [isLoaded, isSignedIn, user, loadData]);

  const handleDeleteTodo = async (id: string) => {
    try {
      if (!user) return;
      const payload: DeleteTodoSchema = {
        email: user.emailAddresses[0].emailAddress,
        todo_id: id,
      };

      const res = await DeleteTodo(payload);
      if (res.status === "success") {
        setLoadData(!loadData);
        toast.success("Task deleted successfully! 🗑️");
      } else {
        toast.error("Failed to delete task. Please try again.");
      }
    } catch {
      toast.error("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return <Loading type="page" />;
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ProtectedRoute>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
          }}
        />

        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                >
                  {isSidebarOpen ? (
                    <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300 cursor-pointer" />
                  )}
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    TaskFlow
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Manage your tasks
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 ">
            {/* Main Content */}
            <div
              className={`flex-1 transition-all duration-300 ${
                isSidebarOpen ? "hidden lg:block" : "block"
              }`}
            >
              {/* Desktop Header */}
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 hidden lg:block"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        TaskFlow Manager
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300">
                        Organize your tasks efficiently
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>

                <StatsCard stats={stats} />
              </motion.header>

              {/* Mobile Stats (collapsed) */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {stats.completed}/{stats.total} done
                    </div>
                  </div>
                </div>
              </div>

              {/* Todo List */}
              <TodoList
                todos={todos}
                filter={filter}
                onDelete={handleDeleteTodo}
                onFilterChange={setFilter}
                loadData={loadData}
                setLoadData={setLoadData}
                setLoading={setLoading}
              />
            </div>

            {/* Sidebar - AddTodo & Tips */}
            <div
              className={`
            ${isSidebarOpen ? "block" : "hidden lg:block"} 
            lg:w-96 transition-all duration-300
          `}
            >
              <div className="sticky top-6 space-y-6">
                <AddTodo setLoadData={setLoadData} loadData={loadData} />

                {/* Productivity Tips */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <span className="text-white text-sm font-bold">💡</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Productivity Tips
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Break large tasks into smaller steps",
                      "Prioritize by importance and urgency",
                      "Review tasks daily",
                      "Set realistic deadlines",
                      "Take regular breaks",
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 text-gray-700 dark:text-gray-300"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                    📈 Quick Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.completed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.pending}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Pending
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Made with ❤️ using React, TypeScript, Tailwind CSS & Framer Motion
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              API ready for Python backend integration
            </p>
          </motion.footer>
        </div>
      </ProtectedRoute>
    </div>
  );
}
