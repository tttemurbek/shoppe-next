'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { light, dark } from '../../scss/MaterialTheme';

export const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(createTheme(light));
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let shouldUseDarkMode = false;

    if (savedTheme) {
      shouldUseDarkMode = savedTheme === 'dark';
    } else {
      shouldUseDarkMode = prefersDarkMode;
    }

    setIsDarkMode(shouldUseDarkMode);
    setTheme(createTheme(shouldUseDarkMode ? dark : light));

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light');
    document.body.className = shouldUseDarkMode ? 'dark-mode' : 'light-mode';

    setIsInitialized(true);
  }, [prefersDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    setTheme(createTheme(newTheme ? dark : light));

    // Save to localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');

    // Apply to document
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    document.body.className = newTheme ? 'dark-mode' : 'light-mode';
  };

  return {
    isDarkMode,
    theme,
    toggleTheme,
    isInitialized,
  };
};
