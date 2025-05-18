"use client"

import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/system";
import NavBar from "@/components/nav/NavBar";
import { Tab } from '@/types/nav/Tab';
import { CustomPage } from '@/types/nav/CustomPage';
import PageManager from '@/components/PageManager';
import ContentContainer from '@/components/ContentContainer';

export default function Home() {
    const [selectedTab, setSelectedTab] = useState<Tab | string>(Tab.Default);
    const [selectedCustomPageId, setSelectedCustomPageId] = useState<string | null>(null);
    const [customPages, setCustomPages] = useState<CustomPage[]>([]);
    const [isPageManagerOpen, setIsPageManagerOpen] = useState(false);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Sauvegarde des pages personnalisées dans le localStorage
    useEffect(() => {
        // Charger les pages depuis le localStorage lors du premier chargement
        const savedPages = localStorage.getItem('customPages');
        if (savedPages) {
            try {
                // Convertir les dates de chaîne en objets Date
                const parsedPages = JSON.parse(savedPages).map((page: any) => ({
                    ...page,
                    createdAt: new Date(page.createdAt)
                }));
                setCustomPages(parsedPages);
            } catch (error) {
                console.error("Erreur lors du chargement des pages personnalisées:", error);
            }
        }
    }, []);

    // Mise à jour du localStorage quand les pages changent
    useEffect(() => {
        localStorage.setItem('customPages', JSON.stringify(customPages));
    }, [customPages]);

    useEffect(() => {
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [prefersDarkMode]);

    const handleTabSelected = (tab: Tab | string, customPageId?: string) => {
        setSelectedTab(tab);
        if (tab === Tab.CustomPage && customPageId) {
            setSelectedCustomPageId(customPageId);
        } else {
            setSelectedCustomPageId(null);
        }
    };

    const handleSavePage = (page: CustomPage) => {
        const existingPageIndex = customPages.findIndex(p => p.id === page.id);

        if (existingPageIndex !== -1) {
            // Mettre à jour une page existante
            const updatedPages = [...customPages];
            updatedPages[existingPageIndex] = page;
            setCustomPages(updatedPages);
        } else {
            // Ajouter une nouvelle page
            setCustomPages([...customPages, page]);
        }
    };

    const handleDeletePage = (pageId: string) => {
        const updatedPages = customPages.filter(page => page.id !== pageId);
        setCustomPages(updatedPages);

        // Si la page actuellement sélectionnée est supprimée, revenir à l'onglet par défaut
        if (selectedTab === Tab.CustomPage && selectedCustomPageId === pageId) {
            setSelectedTab(Tab.Default);
            setSelectedCustomPageId(null);
        }
    };

    // Trouver la page personnalisée sélectionnée
    const selectedCustomPage = selectedCustomPageId
        ? customPages.find(page => page.id === selectedCustomPageId) || null
        : null;

    return (
        <div className="absolute top-0 left-0 w-full h-full flex bg-white dark:bg-gray-950">
            <NavBar
                selectedTab={selectedTab}
                customPages={customPages}
                onTabSelected={handleTabSelected}
                onAddPageClick={() => setIsPageManagerOpen(true)}
            />
    
            <ContentContainer
                selectedTab={selectedTab}
                selectedCustomPage={selectedCustomPage}
                customPages={customPages}
            />
    
            <PageManager
                open={isPageManagerOpen}
                onClose={() => setIsPageManagerOpen(false)}
                customPages={customPages}
                onSavePage={handleSavePage}
                onDeletePage={handleDeletePage}
            />
        </div>
    );
}
