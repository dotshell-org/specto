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
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Helper to get API base path from env
    const getApiBasePath = () => {
        if (typeof window !== 'undefined') {
            return process.env.NEXT_PUBLIC_BASE_PATH || '';
        }
        return '';
    };

    // Function to load pages with auth
    const fetchPagesWithAuth = async (pwd: string) => {
        setIsLoading(true);
        setPasswordError('');
        try {
            const basic = btoa(`user:${pwd}`);
            const response = await fetch(`${getApiBasePath()}/api/pages`, {
                headers: {
                    'Authorization': `Basic ${basic}`
                }
            });
            if (!response.ok) {
                throw new Error('Incorrect password');
            }
            const data = await response.json();
            const parsedPages = data.map((page: CustomPage) => ({
                ...page,
                createdAt: new Date(page.createdAt)
            }));
            setCustomPages(parsedPages);
            setIsAuthenticated(true);
        } catch {
            setPasswordError('Incorrect password');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [prefersDarkMode]);

    // Show password form if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Sign in</h2>
                    <form onSubmit={e => { e.preventDefault(); fetchPagesWithAuth(password); }}>
                        <input
                            type="password"
                            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-3 transition"
                            placeholder="Password..."
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                        {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                            disabled={isLoading || !password}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

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
                const response = await fetch(`${getApiBasePath()}/api/pages/${page.id}`, {
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
                const response = await fetch(`${getApiBasePath()}/api/pages`, {
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
                setCustomPages(prevPages => [...prevPages, {
                    ...newPage,
                    createdAt: new Date(newPage.createdAt)
                }]);
            }
        } catch {
            console.error('Error saving page');
            // You might want to show an error message to the user here
        }
    };

    const handleDeletePage = async (pageId: string) => {
        try {
            const response = await fetch(`${getApiBasePath()}/api/pages/${pageId}`, {
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
        } catch {
            console.error('Error deleting page');
            // You might want to show an error message to the user here
        }
    };

    const handleDeleteAllPages = async () => {
        if (confirm('Are you sure you want to delete all pages? This action cannot be undone.')) {
            try {
                const response = await fetch(`${getApiBasePath()}/api/pages/delete-all`, {
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
            } catch {
                console.error('Error deleting all pages');
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
            />

            {selectedTab === Tab.PageManager ? (
                <PageManager
                    open={true}
                    customPages={customPages}
                    onSavePage={handleSavePage}
                    onDeletePage={handleDeletePage}
                    onDeleteAllPages={handleDeleteAllPages}
                />
            ) : (
                <ContentContainer
                    selectedTab={selectedTab}
                    selectedCustomPage={selectedCustomPage}
                />
            )}
        </div>
    );
}
