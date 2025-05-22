import React, { useState, useEffect, useRef } from 'react';
import { CustomPage } from '@/types/nav/CustomPage';
import { Edit, Trash2, Save, ChevronLeft, AlertCircle, Smile, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import EmojiPicker with SSR disabled
const EmojiPicker = dynamic(
    () => import('emoji-picker-react'),
    { ssr: false }
);

type PageManagerProps = {
    open: boolean;
    customPages: CustomPage[];
    onSavePage: (page: CustomPage) => void;
    onDeletePage: (pageId: string) => void;
    onDeleteAllPages?: () => void;
};

const PageManager: React.FC<PageManagerProps> = ({
                                                     open,
                                                     customPages,
                                                     onSavePage,
                                                     onDeletePage,
                                                     onDeleteAllPages
                                                 }) => {
    const [title, setTitle] = useState('');
    const [emoji, setEmoji] = useState('');
    const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
    const [isAddMode, setIsAddMode] = useState(true);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);
    const [emojiError, setEmojiError] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [copiedPageId, setCopiedPageId] = useState<string | null>(null);

    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && !editingPage) {
            // Reset form when opened
            setTitle('');
            setEmoji('');
            setIsAddMode(true);
            setShowEmojiPicker(false);
            setEmojiError(false);
        }
    }, [open, editingPage]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) &&
                emojiContainerRef.current && !emojiContainerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSave = () => {
        if (title.trim() === '') return;
        if (!emoji) {
            setEmojiError(true);
            return;
        }

        if (isAddMode) {
            // Add a new page
            const newPage: CustomPage = {
                id: Date.now().toString(), // Use timestamp as unique ID
                title: title.trim(),
                emoji: emoji,
                createdAt: new Date()
            };
            onSavePage(newPage);
        } else if (editingPage) {
            // Update existing page
            const updatedPage: CustomPage = {
                ...editingPage,
                title: title.trim(),
                emoji: emoji
            };
            onSavePage(updatedPage);
        }

        // Reset form
        setTitle('');
        setEmoji('');
        setEditingPage(null);
        setIsAddMode(true);
        setShowEmojiPicker(false);
        setEmojiError(false);
    };

    const handleEdit = (page: CustomPage) => {
        setEditingPage(page);
        setTitle(page.title);
        setEmoji(page.emoji);
        setIsAddMode(false);
        setShowEmojiPicker(false);
        setEmojiError(false);
    };

    const handleDeleteClick = (pageId: string) => {
        setPageToDelete(pageId);
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (pageToDelete) {
            onDeletePage(pageToDelete);
            setConfirmDeleteOpen(false);
            setPageToDelete(null);

            // If the page being edited is deleted, reset the form
            if (editingPage && editingPage.id === pageToDelete) {
                setEditingPage(null);
                setTitle('');
                setEmoji('');
                setIsAddMode(true);
            }
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);
        setPageToDelete(null);
    };

    const handleCancel = () => {
        setEditingPage(null);
        setTitle('');
        setEmoji('');
        setIsAddMode(true);
        setShowEmojiPicker(false);
    };

    const handleEmojiSelect = (emojiData: { emoji: string }) => {
        setEmoji(emojiData.emoji);
        setShowEmojiPicker(false);
        setEmojiError(false);
    };

    // Robust clipboard copy helper for all browsers
    const copyToClipboard = async (text: string) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                alert('Error copying to clipboard');
            }
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                alert('Copy not supported in this browser');
            }
            document.body.removeChild(textarea);
        }
    };

    return (
        <>
            <div className="flex-1 p-4 md:p-6 overflow-auto bg-white dark:bg-gray-900">
                <div className="max-w-3xl mx-auto">
                    <header className="flex items-center justify-between mb-6">
                        <h1 className="mt-20 text-3xl md:text-4xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <span className="text-2xl">📄</span>
                            {isAddMode ? "My Pages" : "Edit Page"}
                        </h1>
                        {!isAddMode && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back to Pages
                            </button>
                        )}
                    </header>

                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
                        <div className="p-5">
                            <div className="mb-6">
                                <div>
                                    <div className="flex justify-center items-center mb-4">
                                        <div
                                            ref={emojiContainerRef}
                                            className={`flex items-center justify-center w-16 h-16 rounded-md shadow-sm cursor-pointer transition-all ${
                                                emoji ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-600'
                                            } ${showEmojiPicker ? 'ring-2 ring-blue-500' : ''}`}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        >
                                            {emoji ? (
                                                <span className="text-4xl">{emoji}</span>
                                            ) : (
                                                <Smile className="h-8 w-8 text-gray-400 dark:text-gray-500"/>
                                            )}
                                        </div>
                                    </div>

                                    {emojiError && (
                                        <div
                                            className="flex items-center justify-center text-red-500 text-sm mt-1 mb-2">
                                            <AlertCircle className="h-4 w-4 mr-1"/>
                                            Please select an emoji
                                        </div>
                                    )}

                                    {showEmojiPicker && (
                                        <div
                                            ref={emojiPickerRef}
                                            className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                                        >
                                            <div
                                                className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                                                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                                    Emoji Picker
                                                </h3>
                                                <button
                                                    onClick={() => setShowEmojiPicker(false)}
                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <X className="h-5 w-5"/>
                                                </button>
                                            </div>
                                            <div className="emoji-picker-container">
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiSelect}
                                                    searchDisabled={false}
                                                    width="100%"
                                                    height={350}
                                                    previewConfig={{
                                                        showPreview: false
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Page Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center ${
                                        !title.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                    disabled={!title.trim()}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isAddMode ? "Add Page" : "Update Page"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {isAddMode && customPages.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
                            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        Your Pages
                                    </h2>
                                    {onDeleteAllPages && customPages.length > 0 && (
                                        <button
                                            onClick={onDeleteAllPages}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center text-sm cursor-pointer"
                                            aria-label="Delete all pages"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete All
                                        </button>
                                    )}
                                </div>
                            </div>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {customPages.map((page) => (
                                    <li key={page.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-md mr-3">
                                                    <span className="text-xl">{page.emoji}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{page.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(page.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(page)}
                                                    className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                                    aria-label="Edit page"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(page.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                                    aria-label="Delete page"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await copyToClipboard(page.id);
                                                        setCopiedPageId(page.id);
                                                        setTimeout(() => setCopiedPageId(null), 1200);
                                                    }}
                                                    className={`p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer`}
                                                    aria-label="Copy page ID"
                                                    title="Copy page ID"
                                                >
                                                    {copiedPageId === page.id ? (
                                                        <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Copied!</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation dialog */}
            {confirmDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-0 border border-gray-200 dark:border-gray-700">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Confirm Deletion</h2>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-700 dark:text-gray-300">
                                Are you sure you want to delete this page? This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PageManager;
