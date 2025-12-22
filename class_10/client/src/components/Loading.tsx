// src/components/Loading.tsx
import { useEffect, useState } from "react";

const Loading = ({
  type = "inline",
  size = "md",
  text = "Loading...",
  subtext = "Please wait",
  showProgress = false,
  progress = 0,
  theme = "gradient",
  showNeuralNetwork = true,
  showParticles = true,
  onCancel,
  cancelText = "Cancel",
  autoHide = false,
  autoHideDuration = 3000,
}: {
  type?: "fullscreen" | "inline" | "button" | "page";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  text?: string;
  subtext?: string;
  showProgress?: boolean;
  progress?: number;
  theme?: "light" | "dark" | "gradient";
  showNeuralNetwork?: boolean;
  showParticles?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  autoHide?: boolean;
  autoHideDuration?: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDuration]);

  useEffect(() => {
    if (showProgress && progress >= 0) {
      const interval = setInterval(() => {
        setInternalProgress((prev) => {
          if (prev >= progress) return progress;
          return Math.min(prev + 1, progress);
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [showProgress, progress]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
    "2xl": "w-64 h-64",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const themeClasses = {
    light: "bg-white text-gray-800",
    dark: "bg-gray-900 text-white",
    gradient: "bg-gradient-to-br from-gray-900 to-gray-800 text-white",
  };

  if (!isVisible) return null;

  const NeuralNetwork = () => (
    <div className="absolute inset-0">
      {/* Neural Network Lines */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>

      {/* Nodes */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"
          style={{
            top: `${20 + i * 15}%`,
            left: `${20 + i * 15}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        ></div>
      ))}
    </div>
  );

  const ProgressBar = () => (
    <div className="w-full mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{text}</span>
        <span>{internalProgress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${internalProgress}%` }}
        ></div>
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer -translate-x-full"></div>
      </div>
      {subtext && (
        <div className="text-xs text-gray-400 mt-2 text-center">{subtext}</div>
      )}
    </div>
  );

  const LoadingContent = () => (
    <div
      className={`relative ${themeClasses[theme]} rounded-2xl p-6 shadow-2xl border border-gray-700/50 backdrop-blur-xl`}
    >
      {/* Particles */}
      {showParticles && (
        <>
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-ping opacity-20"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 -left-2 w-3 h-3 bg-pink-500 rounded-full animate-ping opacity-20"
            style={{ animationDelay: "1s" }}
          ></div>
        </>
      )}

      <div className="relative z-10">
        <div
          className={`${sizeClasses[size]} mx-auto relative flex items-center justify-center`}
        >
          {/* Main Spinner */}
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent rounded-full border-t-blue-500 border-r-purple-500 animate-spin"></div>
          <div
            className="absolute inset-2 border-4 border-transparent rounded-full border-b-pink-500 border-l-green-400 animate-spin"
            style={{ animationDirection: "reverse" }}
          ></div>

          {/* Center Circle */}
          <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>

          {/* Neural Network Animation */}
          {showNeuralNetwork && <NeuralNetwork />}
        </div>

        {/* Text Content */}
        <div className="mt-6 text-center">
          <div
            className={`font-bold ${textSizeClasses[size]} mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}
          >
            {text}
          </div>
          {subtext && <div className="text-sm text-gray-400">{subtext}</div>}
        </div>

        {/* Progress Bar */}
        {showProgress && <ProgressBar />}

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 mx-auto block px-4 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
          >
            {cancelText}
          </button>
        )}
      </div>
    </div>
  );

  if (type === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-sm">
        <LoadingContent />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`,
              }}
            ></div>
          ))}

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                linear-gradient(to right, #4F46E5 1px, transparent 1px),
                linear-gradient(to bottom, #4F46E5 1px, transparent 1px)
              `,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "page") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Outer Rings */}
            <div className="absolute inset-0 border-8 border-gray-800 rounded-full animate-pulse"></div>
            <div className="absolute inset-8 border-8 border-transparent rounded-full border-t-blue-600 border-r-purple-600 animate-spin"></div>
            <div
              className="absolute inset-16 border-8 border-transparent rounded-full border-b-pink-600 border-l-green-500 animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {text}
          </h1>
          <p className="text-gray-400 mb-8">{subtext}</p>

          {showProgress && (
            <div className="max-w-md mx-auto">
              <ProgressBar />
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "button") {
    return (
      <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg cursor-not-allowed">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
        <span className="text-white">{text}</span>
      </div>
    );
  }

  // Inline loading
  return (
    <div className="inline-block">
      <LoadingContent />
    </div>
  );
};

export default Loading;
