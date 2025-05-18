"use client"

import {ThemeProvider} from '@mui/material';
import {useEffect, useMemo} from "react";
import {createTheme, useMediaQuery} from "@mui/system";
import NavBar from "@/components/nav/NavBar";
import { Tab } from '@/types/nav/Tab';

export default function Home() {

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
                text: {
                    primary: prefersDarkMode ? '#ffffff' : '#000000',
                },
            },
        }), [prefersDarkMode]);

    useEffect(() => {
        if (prefersDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [prefersDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            <div className="absolute top-0 left-0 w-full h-full flex bg-white dark:bg-gray-950">
                <NavBar selectedTab={Tab.Calendar} onTabSelected={function(tab: Tab): void {
                  throw new Error('Function not implemented.');
              } } />
        </div>
      </ThemeProvider>
  );
}
