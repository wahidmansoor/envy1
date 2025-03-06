import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabViewProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  children: React.ReactNode[];
}

export default function TabView({ tabs, activeTab, onTabChange, children }: TabViewProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex space-x-1 mb-4 overflow-x-auto scrollbar-hide -mx-2 px-2 pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => onTabChange(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out 
                          ${activeTab === index ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50'}
                          focus:outline-none focus:ring-2 focus:ring-indigo-300`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}