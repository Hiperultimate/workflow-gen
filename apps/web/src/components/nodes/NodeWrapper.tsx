import React from "react";

interface NodeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const NodeWrapper: React.FC<NodeWrapperProps> = ({
  children,
  className = "",
}) => (
  <div
    className={`relative px-3 py-1 rounded-lg border-1 border-gray-300 bg-[#1E1E1E] shadow-md hover:shadow-lg transition-all ${className}`}
  >
    {children}
  </div>
);

export default NodeWrapper;
