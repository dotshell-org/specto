"use client"

import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/system";
import NavBar from "@/components/nav/NavBar";
import { Tab } from '@/types/nav/Tab';
import { CustomPage } from '@/types/nav/CustomPage';
import PageManager from '@/components/PageManager';
import ContentContainer from '@/components/ContentContainer';
import { Trash2 } from 'lucide-react';

export default function Home() {
    const [selectedTab, setSelectedTab] = useState<Tab | string>(Tab.Default);
    const [selectedCustomPageId, setSelectedCustomPageId] = useState<string | null>(null);
    const [customPages, setCustomPages] = useState<CustomPage[]>([]);
    const [isPageManagerOpen, setIsPageManagerOpen] = useState(false);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Load pages from API on first load
    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch('/api/pages');
                if (!response.ok) {
                    throw new Error('Failed to fetch pages');
                }
                const data = await response.json();
                // Convert date strings to Date objects
                const parsedPages = data.map((page: any) => ({
                    ...page,
                    createdAt: new Date(page.createdAt)
                }));
                setCustomPages(parsedPages);
            } catch (error) {
                console.error("Error loading custom pages:", error);
            }
        };

        fetchPages();
    }, []);

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

    const handleSavePage = async (page: CustomPage) => {
        try {
            if (page.id && customPages.some(p => p.id === page.id)) {
                // Update an existing page
                const response = await fetch(`/api/pages/${page.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: page.title,
                        emoji: page.emoji,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update page');
                }

                const updatedPage = await response.json();

                // Update the page in the local state
                setCustomPages(prevPages => 
                    prevPages.map(p => p.id === page.id ? {
                        ...updatedPage,
                        createdAt: new Date(updatedPage.createdAt)
                    } : p)
                );
            } else {
                // Add a new page
                const response = await fetch('/api/pages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: page.title,
                        emoji: page.emoji,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create page');
                }

                const newPage = await response.json();

                // Add the new page to the local state
                setCustomPages(prevPages => [...prevPages, {
                    ...newPage,
                    createdAt: new Date(newPage.createdAt)
                }]);
            }
        } catch (error) {
            console.error('Error saving page:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleDeletePage = async (pageId: string) => {
        try {
            const response = await fetch(`/api/pages/${pageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete page');
            }

            // Remove the page from the local state
            setCustomPages(prevPages => prevPages.filter(page => page.id !== pageId));

            // If the currently selected page is deleted, return to default tab
            if (selectedTab === Tab.CustomPage && selectedCustomPageId === pageId) {
                setSelectedTab(Tab.Default);
                setSelectedCustomPageId(null);
            }
        } catch (error) {
            console.error('Error deleting page:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleDeleteAllPages = async () => {
        if (confirm('Are you sure you want to delete all pages? This action cannot be undone.')) {
            try {
                const response = await fetch('/api/pages/delete-all', {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete all pages');
                }

                // Clear the local state
                setCustomPages([]);

                // Return to default tab
                setSelectedTab(Tab.Default);
                setSelectedCustomPageId(null);
            } catch (error) {
                console.error('Error deleting all pages:', error);
                // You might want to show an error message to the user here
            }
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
                    onDeleteAllPages={handleDeleteAllPages}
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
