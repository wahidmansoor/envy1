import React, { useState, useEffect, KeyboardEvent, ButtonHTMLAttributes } from 'react';
import type { DetailedHTMLProps } from 'react';

export interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
  }[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(activeTab || tabs[0].id);

  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    } 
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tabId: string) => {
    const tabIds = tabs.map(tab => tab.id);
    const currentIndex = tabIds.indexOf(tabId);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        handleTabChange(tabIds[nextIndex]);
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        handleTabChange(tabIds[nextIndex]);
        break;
      case 'Home':
        handleTabChange(tabIds[0]);
        break;
      case 'End':
        handleTabChange(tabIds[tabs.length - 1]);
        break;
    }
  };

  const currentTab = tabs.find((tab) => tab.id === selectedTab);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-none 
                    bg-white/20 backdrop-blur-lg">
        <div role="tablist" 
             aria-label="Tab navigation"
             aria-orientation="horizontal"
             className="tab-list whitespace-nowrap px-2 sm:px-4 lg:px-6">
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <button 
                type="button"
                key={tab.id}
                role="tab"
                {...{'aria-selected': isSelected}}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className={`tab-button ${isSelected ? 'tab-button-selected' : ''}`}
              >
                {tab.icon && <span className="h-6 w-6 text-indigo-600">{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {currentTab && renderTabPanel(currentTab)}
    </div>
  );

  function renderTabPanel(tab: TabsProps['tabs'][0]) {
    return <div
        role="tabpanel"
        id={`tabpanel-${selectedTab}`}
        aria-labelledby={`tab-${selectedTab}`} 
        className="tab-panel"
        tabIndex={0} 
        data-state={tab.id === selectedTab ? 'active' : 'inactive'} 
      >
        {tab.content}
      </div>;
  }
}
