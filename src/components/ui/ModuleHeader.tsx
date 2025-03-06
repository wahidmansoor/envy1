import React from 'react';

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function ModuleHeader({ title, description, icon }: ModuleHeaderProps) {
  return (
    <div className="module-header bg-white/20 backdrop-blur-lg border border-gray-200/40 shadow-lg 
                    opacity-90 hover:opacity-100 hover:shadow-[0px_0px_15px_rgba(255,255,255,0.2)]
                    p-6 rounded-xl transition-all duration-300">
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0">
            <div className="h-6 w-6 text-indigo-600">
              {icon}
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-indigo-700 hover:text-indigo-800 
                         hover:shadow-[0px_0px_5px_rgba(99,102,241,0.6)]
                         transition-all duration-300">
            {title}
          </h1>
          <p className="mt-2 text-lg text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
}