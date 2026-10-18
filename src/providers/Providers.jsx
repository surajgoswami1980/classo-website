'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/store';
import { hydrateAuth } from '../store/slices/authSlice';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Restore auth (user/role/token) from localStorage once, at the root, so every
// page already has `user.role` available and routing never races on an
// undefined role.
function AuthBoot({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);
  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBoot>{children}</AuthBoot>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}
