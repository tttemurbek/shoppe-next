'use client';

import { useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

// Add fallback theme definitions in case imports fail
const defaultLight = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
};

const defaultDark = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
};

// Try to import themes with fallbacks
let light: any, dark: any;
try {
  // @ts-ignore
  const themes = require('../../scss/MaterialTheme');
  light = themes.light || defaultLight;
  dark = themes.dark || defaultDark;
} catch (error) {
  console.warn('MaterialTheme import failed, using defaults:', error);
  light = defaultLight;
  dark = defaultDark;
}

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return createTheme(light);
    } catch (error) {
      console.warn('createTheme failed, using minimal theme:', error);
      return createTheme(defaultLight);
    }
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedTheme: string | null = null;
    let shouldUseDarkMode = false;

    try {
      savedTheme = localStorage.getItem('theme');
    } catch (error) {
      console.warn('localStorage not available:', error);
    }

    // Only use saved theme if it exists, otherwise default to light
    if (savedTheme) {
      shouldUseDarkMode = savedTheme === 'dark';
    } else {
      shouldUseDarkMode = false; // Always default to light theme
    }

    setIsDarkMode(shouldUseDarkMode);

    try {
      setTheme(createTheme(shouldUseDarkMode ? dark : light));
    } catch (error) {
      console.warn('createTheme failed in useEffect:', error);
      setTheme(createTheme(shouldUseDarkMode ? defaultDark : defaultLight));
    }

    try {
      if (typeof document !== 'undefined' && document?.documentElement) {
        document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light');
      }
      if (typeof document !== 'undefined' && document?.body) {
        document.body.className = shouldUseDarkMode ? 'dark-mode' : 'light-mode';
      }
    } catch (error) {
      console.warn('Document manipulation error:', error);
    }

    setIsInitialized(true);
  }, []); // Removed prefersDarkMode dependency since we're not using system preference

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;

    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    try {
      setTheme(createTheme(newTheme ? dark : light));
    } catch (error) {
      console.warn('createTheme failed in toggleTheme:', error);
      setTheme(createTheme(newTheme ? defaultDark : defaultLight));
    }

    try {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.warn('localStorage save error:', error);
    }

    try {
      if (typeof document !== 'undefined' && document?.documentElement) {
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
      }
      if (typeof document !== 'undefined' && document?.body) {
        document.body.className = newTheme ? 'dark-mode' : 'light-mode';
      }
    } catch (error) {
      console.warn('Document manipulation error:', error);
    }
  };

  return {
    isDarkMode,
    theme,
    toggleTheme,
    isInitialized,
  };
};
