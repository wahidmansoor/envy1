import React, { useState } from 'react';

interface DecisionTree {
  startNode: string;
  nodes: {
    [nodeId: string]: DecisionNode;
  };
}

export interface DecisionNode { // Add export keyword here
  type: 'question' | 'outcome';
  question?: string;
  options?: { label: string; nextNode: string }[];
  outcome?: string;
}

interface DecisionTreeProps {
  tree: DecisionTree;
}

const DecisionTree: React.FC<DecisionTreeProps> = ({ tree }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(tree.startNode);
  const currentNode = tree.nodes[currentNodeId];

  const handleOptionSelect = (nextNodeId: string) => {
    setCurrentNodeId(nextNodeId);
  };

  if (!currentNode) {
    return <div>Error: Node not found.</div>; // Basic error handling
  }

  return (
    <div className="space-y-4">
      {currentNode.type === 'question' ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{currentNode.question}</h4>
          <div className="space-y-2">
            {currentNode.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option.nextNode)}
                className="w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Outcome</h4>
          <p className="text-gray-700">{currentNode.outcome}</p>
        </div>
      )}
    </div>
  );
};

export default DecisionTree;