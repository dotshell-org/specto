"use client"

import React from 'react';

interface NavItemProps {
    text: string;
    active?: boolean;
    onClick: () => void;
    title?: string;
}

const NavItem: React.FC<NavItemProps> = ({ text, active, onClick, title }) => {
    return (
        <button
            onClick={onClick}
            className={`rounded-md w-10 h-10 p-1 mx-2 my-0.5 font-medium transition-all cursor-pointer border-none focus:outline-0 focus-visible:outline-0 ${
                active 
                    ? 'bg-gray-200 dark:bg-gray-700 ring-1 ring-gray-300 dark:ring-gray-500 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-50 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            aria-current={active ? 'page' : undefined}
            title={title}
        >
            {text}
        </button>

    );
};

export default NavItem;