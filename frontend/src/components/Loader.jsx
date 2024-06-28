import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-fit bg-transparent mb-20">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce-more"></div>
        <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-more-delay-1"></div>
        <div className="w-4 h-4 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-bounce-more-delay-2"></div>
        <div className="w-4 h-4 hidden md:block bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce-more-delay-3"></div>
        <div className="w-4 h-4 hidden md:block bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce-more-delay-4"></div>
        <div className="w-4 h-4 hidden lg:block bg-cyan-600 dark:bg-cyan-400 rounded-full animate-bounce-more-delay-1"></div>
        <div className="w-4 h-4 hidden lg:block bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce-more-delay-2"></div>
      </div>
    </div>
  );
};

export default Loader;
