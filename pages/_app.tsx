'use client';

import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useTheme } from '../libs/hooks/useTheme';
import ThemeToggle from '../libs/components/ThemeToggle';
import '../scss/app.scss';
import '../scss/pc/main.scss';

const App = ({ Component, pageProps }: AppProps) => {
  const { theme, isInitialized } = useTheme();
  const client = useApollo(pageProps.initialApolloState);

  // Prevent flash of unstyled content
  useEffect(() => {
    if (isInitialized) {
      document.body.style.visibility = 'visible';
    }
  }, [isInitialized]);

  // Hide body until theme is initialized to prevent flash
  useEffect(() => {
    document.body.style.visibility = 'hidden';
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeToggle />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default appWithTranslation(App);
