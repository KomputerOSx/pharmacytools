// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    isLight: boolean;
    setIsLight: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isLight, setIsLight] = useState<boolean>(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Get theme from cookie on initial load
        const savedTheme = document.cookie
            .split('; ')
            .find(row => row.startsWith('theme='))
            ?.split('=')[1];

        const initialIsLight = savedTheme ? savedTheme === 'light' : true;
        setIsLight(initialIsLight);

        // Apply initial theme
        document.documentElement.classList.toggle('theme-light', initialIsLight);
        document.documentElement.classList.toggle('theme-dark', !initialIsLight);

        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ isLight, setIsLight }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};