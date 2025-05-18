"use client"

import React from 'react';
import { Tab } from '@/types/nav/Tab';
import { CustomPage } from '@/types/nav/CustomPage';

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
  const getTitle = () => {
    if (selectedTab === Tab.CustomPage && selectedCustomPage) {
      return (
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <span className="text-2xl">{selectedCustomPage.emoji}</span>
          {selectedCustomPage.title}
        </h1>
      );
    } else {
      // Titre pour les onglets par défaut
      let title = "";
      switch (selectedTab) {
        case Tab.Default:
          title = "Accueil";
          break;
        case Tab.Calendar:
          title = "Calendrier";
          break;
        case Tab.Objects:
          title = "Objets";
          break;
        case Tab.History:
          title = "Historique";
          break;
        case Tab.Stats:
          title = "Statistiques";
          break;
        case Tab.Export:
          title = "Exporter";
          break;
        case Tab.Settings:
          title = "Paramètres";
          break;
        default:
          title = "Page inconnue";
      }
  
      // Trouver l'emoji associé à cet onglet
      const defaultItems = [
        { text: "📅", tab: Tab.Calendar },
        { text: "📝", tab: Tab.Objects},
        { text: "⏳", tab: Tab.History},
        { text: "📊", tab: Tab.Stats},
        { text: "💾", tab: Tab.Export},
        { text: "⚙️", tab: Tab.Settings },
      ];
  
      const item = defaultItems.find(i => i.tab === selectedTab);
      const emoji = item ? item.text : "";
  
      return (
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          {emoji && <span className="text-2xl">{emoji}</span>}
          {title}
        </h1>
      );
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {getTitle()}
  
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        {selectedTab === Tab.CustomPage && selectedCustomPage ? (
          <div>
            <p className="text-base">
              Contenu de votre page personnalisée "{selectedCustomPage.title}"
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Cette page a été créée le {selectedCustomPage.createdAt.toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>
            Contenu de l'onglet {selectedTab}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentContainer;
