"use client"

import React, { useState, useEffect } from 'react';
import { CustomPage } from '@/types/nav/CustomPage';

type PageManagerProps = {
    open: boolean;
    onClose: () => void;
    customPages: CustomPage[];
    onSavePage: (page: CustomPage) => void;
    onDeletePage: (pageId: string) => void;
};

const PageManager: React.FC<PageManagerProps> = ({
    open,
    onClose,
    customPages,
    onSavePage,
    onDeletePage
}) => {
    const [title, setTitle] = useState('');
    const [emoji, setEmoji] = useState('');
    const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
    const [isAddMode, setIsAddMode] = useState(true);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (open && !editingPage) {
            // Réinitialiser le formulaire lorsqu'il est ouvert
            setTitle('');
            setEmoji('');
            setIsAddMode(true);
        }
    }, [open, editingPage]);

    const handleSave = () => {
        if (title.trim() === '' || emoji.trim() === '') return;

        if (isAddMode) {
            // Ajouter une nouvelle page
            const newPage: CustomPage = {
                id: Date.now().toString(), // Utiliser un timestamp comme ID unique
                title: title.trim(),
                emoji: emoji.trim(),
                createdAt: new Date()
            };
            onSavePage(newPage);
        } else if (editingPage) {
            // Modifier une page existante
            const updatedPage: CustomPage = {
                ...editingPage,
                title: title.trim(),
                emoji: emoji.trim()
            };
            onSavePage(updatedPage);
        }

        // Réinitialiser le formulaire
        setTitle('');
        setEmoji('');
        setEditingPage(null);
        setIsAddMode(true);
    };

    const handleEdit = (page: CustomPage) => {
        setEditingPage(page);
        setTitle(page.title);
        setEmoji(page.emoji);
        setIsAddMode(false);
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

            // Si la page en cours de modification est supprimée, réinitialiser le formulaire
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
        if (!isAddMode && editingPage) {
            setEditingPage(null);
            setTitle('');
            setEmoji('');
            setIsAddMode(true);
        } else {
            onClose();
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="p-4 border-b dark:border-gray-700">
                            <h2 className="text-xl font-semibold">
                                {isAddMode ? "Ajouter une nouvelle page" : "Modifier la page"}
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Emoji</label>
                                <input
                                    type="text"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Ex: 🚀, 🎯, 🌟"
                                />
                                <p className="text-xs text-gray-500 mt-1">Choisissez un emoji représentatif pour votre page</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Nom de la page"
                                />
                            </div>
    
                            {customPages.length > 0 && (
                                <>
                                    <h3 className="font-medium text-sm mt-6 mb-2">Pages existantes:</h3>
                                    <ul className="divide-y dark:divide-gray-700">
                                        {customPages.map((page) => (
                                            <li key={page.id} className="py-2 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <span className="mr-2">{page.emoji}</span>
                                                    <span>{page.title}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(page)}
                                                        className="p-1 text-blue-500 hover:bg-blue-100 rounded dark:hover:bg-gray-700"
                                                        aria-label="edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(page.id)}
                                                        className="p-1 text-red-500 hover:bg-red-100 rounded dark:hover:bg-gray-700"
                                                        aria-label="delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
                            <button 
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                {isAddMode ? "Annuler" : "Retour"}
                            </button>
                            <button
                                onClick={handleSave}
                                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${!title.trim() || !emoji.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!title.trim() || !emoji.trim()}
                            >
                                {isAddMode ? "Ajouter" : "Mettre à jour"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Boîte de dialogue de confirmation de suppression */}
            {confirmDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <div className="p-4 border-b dark:border-gray-700">
                            <h2 className="text-xl font-semibold">Confirmer la suppression</h2>
                        </div>
                        <div className="p-4">
                            <p>
                                Êtes-vous sûr de vouloir supprimer cette page? Cette action est irréversible.
                            </p>
                        </div>
                        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
                            <button 
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PageManager;
