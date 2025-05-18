"use client"

import Image from "next/image";
import NavItem from "./NavItem";
import {Tab} from '@/types/nav/Tab'
import React from "react";
import { CustomPage } from "@/types/nav/CustomPage";

interface NavBarProps {
    selectedTab: Tab | string;
    customPages: CustomPage[];
    onTabSelected: (tab: Tab | string, customPageId?: string) => void;
    onAddPageClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedTab, customPages, onTabSelected, onAddPageClick }) => {

    const handleTabSelected = (tab: Tab | string, customPageId?: string) => {
        onTabSelected(tab, customPageId);
    }

    return (
        <div className="z-50 w-14 h-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-600 flex flex-col">
            <div className="p-1.5 mt-6 mb-4 flex justify-center items-center">
                <Image src="/app-icon.svg" alt="App Icon" width={40} height={40} className="dark:invert"/>
            </div>

            {/* Pages personnalisées */}
            {customPages.map((page) => (
                <NavItem
                    key={page.id}
                    text={page.emoji}
                    active={selectedTab === page.id}
                    onClick={() => handleTabSelected(Tab.CustomPage, page.id)}
                />
            ))}

            {/* Bouton pour ajouter une page */}
            <div className="p-1.5 flex justify-center">
                <button
                    onClick={onAddPageClick}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                    title="Ajouter une page"
                >
                    <span className="text-gray-700 dark:text-gray-300 text-xl font-bold">+</span>
                </button>
            </div>

            {/* Séparateur */}
            <div className="my-3 border-t border-gray-300 dark:border-gray-700 mx-2"></div>
        </div>
    )
}

export default NavBar