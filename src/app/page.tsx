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

    // Save custom pages in localStorage
    useEffect(() => {
        // Load pages from localStorage on first load
        const savedPages = localStorage.getItem('customPages');
        if (savedPages) {
            try {
                // Convert date strings to Date objects
                const parsedPages = JSON.parse(savedPages).map((page: any) => ({
                    ...page,
                    createdAt: new Date(page.createdAt)
                }));
                setCustomPages(parsedPages);
            } catch (error) {
                console.error("Error loading custom pages:", error);
            }
        }
    }, []);

    // Update localStorage when pages change
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
            // Update an existing page
            const updatedPages = [...customPages];
            updatedPages[existingPageIndex] = page;
            setCustomPages(updatedPages);
        } else {
            // Add a new page
            setCustomPages([...customPages, page]);
        }
    };

    const handleDeletePage = (pageId: string) => {
        const updatedPages = customPages.filter(page => page.id !== pageId);
        setCustomPages(updatedPages);

        // If the currently selected page is deleted, return to default tab
        if (selectedTab === Tab.CustomPage && selectedCustomPageId === pageId) {
            setSelectedTab(Tab.Default);
            setSelectedCustomPageId(null);
        }
    };

    // Find the selected custom page
    const selectedCustomPage = selectedCustomPageId
        ? customPages.find(page => page.id === selectedCustomPageId) || null
        : null;

    return (
        <div className="absolute top-0 left-0 w-full h-full flex bg-white dark:bg-gray-950">
            <NavBar
                selectedTab={selectedTab}
                selectedCustomPageId={selectedCustomPageId}
                customPages={customPages}
                onTabSelected={handleTabSelected}
                onAddPageClick={() => setSelectedTab(Tab.PageManager)}
            />
    
            {selectedTab === Tab.PageManager ? (
                <PageManager
                    open={true}
                    onClose={() => setSelectedTab(Tab.Default)}
                    customPages={customPages}
                    onSavePage={handleSavePage}
                    onDeletePage={handleDeletePage}
                />
            ) : (
                <ContentContainer
                    selectedTab={selectedTab}
                    selectedCustomPage={selectedCustomPage}
                    customPages={customPages}
                />
            )}
        </div>
    );
}
