import React from "react";
import { motion } from "framer-motion";

const Loading = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        className={`border-4 border-indigo-200 border-t-indigo-600 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm mt-2"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loading;