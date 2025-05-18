"use client"

import Image from "next/image";
import NavItem from "./NavItem";
import {Tab} from '@/types/nav/Tab'
import React from "react";
import { CustomPage } from "@/types/nav/CustomPage";

interface NavBarProps {
    selectedTab: Tab | string;
    selectedCustomPageId?: string | null;
    customPages: CustomPage[];
    onTabSelected: (tab: Tab | string, customPageId?: string) => void;
    onAddPageClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ selectedTab, selectedCustomPageId, customPages, onTabSelected, onAddPageClick }) => {

    const handleTabSelected = (tab: Tab | string, customPageId?: string) => {
        onTabSelected(tab, customPageId);
    }

    return (
        <div className="z-50 w-14 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-1.5 mt-6 mb-4 flex justify-center items-center">
                <Image src="/app-icon.svg" alt="App Icon" width={40} height={40} className="dark:invert"/>
            </div>
    
            {/* Page Manager button */}
            <div className="flex justify-center">
                <NavItem 
                    text="📝"
                    active={selectedTab === Tab.PageManager}
                    onClick={() => handleTabSelected(Tab.PageManager)}
                    title="Page Manager"
                />
            </div>
    
            {/* Separator */}
            <div className="my-3 border-t border-gray-200 dark:border-gray-800 mx-2"></div>
    
            {/* Custom pages */}
            <div className="flex flex-col items-center">
                {customPages.map((page) => (
                    <NavItem
                        key={page.id}
                        text={page.emoji}
                        active={selectedTab === Tab.CustomPage && page.id === selectedCustomPageId}
                        onClick={() => handleTabSelected(Tab.CustomPage, page.id)}
                        title={page.title}
                    />
                ))}
            </div>
        </div>
    )
}

export default NavBar