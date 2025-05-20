"use client"

import React, { useState } from 'react';
import { Tab } from '@/types/nav/Tab';
import { CustomPage } from '@/types/nav/CustomPage';
import LogViewer from '@/components/logs/LogViewer';
import LogProcessor from '@/components/logs/LogProcessor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ContentContainerProps {
  selectedTab: Tab | string;
  selectedCustomPage?: CustomPage | null;
  customPages: CustomPage[];
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  selectedTab,
  selectedCustomPage,
  customPages
}) => {
  const [activeTab, setActiveTab] = useState<string>("content");

  const getTitle = () => {
    if (selectedTab === Tab.CustomPage && selectedCustomPage) {
      return (
        <h1 className="mt-20 text-4xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
          <span className="text-2xl md:text-3xl">{selectedCustomPage.emoji}</span>
          {selectedCustomPage.title}
        </h1>
      );
    } else {
      // Title for default tabs
      let title = "";
      switch (selectedTab) {
        case Tab.Default:
          title = "Home";
          break;
        case Tab.Calendar:
          title = "Calendar";
          break;
        case Tab.Objects:
          title = "Objects";
          break;
        case Tab.History:
          title = "History";
          break;
        case Tab.Stats:
          title = "Statistics";
          break;
        case Tab.Export:
          title = "Export";
          break;
        case Tab.Settings:
          title = "Settings";
          break;
        case Tab.PageManager:
          title = "Page Manager";
          break;
        case Tab.Logs:
          title = "Log Management";
          break;
        default:
          title = "Unknown Page";
      }

      // Find the emoji associated with this tab
      const defaultItems = [
        { text: "📅", tab: Tab.Calendar },
        { text: "📝", tab: Tab.Objects},
        { text: "⏳", tab: Tab.History},
        { text: "📊", tab: Tab.Stats},
        { text: "💾", tab: Tab.Export},
        { text: "⚙️", tab: Tab.Settings },
        { text: "🔮", tab: Tab.Logs },
      ];

      const item = defaultItems.find(i => i.tab === selectedTab);
      const emoji = item ? item.text : "";

      return (
        <h1 className="mt-20 text-3xl md:text-4xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
          {emoji && <span className="text-2xl md:text-3xl">{emoji}</span>}
          {/* Change title for Logs tab */}
          {selectedTab === Tab.Logs ? "Global Vision" : title}
        </h1>
      );
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        {selectedTab === Tab.Default ? (
          <div className="flex items-center justify-center h-[60vh]">
            <img
              src="/app-icon.svg"
              alt="Specto Logo"
              className="w-[20rem] h-[20rem] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[12rem] opacity-5 select-none dark:invert"
              draggable="false"
            />
          </div>
        ) : (
          <>
            {getTitle()}
            {selectedTab === Tab.Logs ? (
              <LogProcessor customPages={customPages} />
            ) : selectedTab === Tab.CustomPage && selectedCustomPage ? (
              <div className="mb-8">
                <LogViewer 
                  customPages={customPages} 
                  initialPageFilter={selectedCustomPage.id}
                  key={selectedCustomPage.id} // force refresh on page change
                />
              </div>
            ) : (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p>
                  Content of tab {selectedTab}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentContainer;
