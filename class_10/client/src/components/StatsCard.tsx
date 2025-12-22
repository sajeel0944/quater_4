import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Target,
  ChevronRight,
} from "lucide-react";
import type { TodoStats } from "../types/todo";
import { useState } from "react";

const statsConfig = [
  {
    key: "total" as const,
    label: "Total Tasks",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgColor: "bg-blue-100",
    darkBgColor: "bg-blue-900/20",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-600",
    textColor: "text-green-600",
    bgColor: "bg-green-100",
    darkBgColor: "bg-green-900/20",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock,
    color: "from-yellow-500 to-amber-600",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    darkBgColor: "bg-yellow-900/20",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: TrendingUp,
    color: "from-purple-500 to-indigo-600",
    textColor: "text-purple-600",
    bgColor: "bg-purple-100",
    darkBgColor: "bg-purple-900/20",
  },
  {
    key: "highPriority" as const,
    label: "High Priority",
    icon: AlertCircle,
    color: "from-red-500 to-pink-600",
    textColor: "text-red-600",
    bgColor: "bg-red-100",
    darkBgColor: "bg-red-900/20",
  },
];

export default function StatsCard({ stats }: { stats: TodoStats }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleStats = isExpanded ? statsConfig : statsConfig.slice(0, 2);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          📊 Statistics
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden flex items-center text-sm text-blue-600 dark:text-blue-400"
        >
          {isExpanded ? "Show Less" : "Show More"}
          <ChevronRight
            className={`w-4 h-4 ml-1 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {visibleStats.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p
                  className={`text-2xl font-bold ${stat.textColor} dark:text-white`}
                >
                  {stats[stat.key]}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      (stats[stat.key] / Math.max(stats.total, 1)) * 100
                    }%`,
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.key === "total"
                  ? "Total tasks"
                  : `${Math.round(
                      (stats[stat.key] / Math.max(stats.total, 1)) * 100
                    )}% of total`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
