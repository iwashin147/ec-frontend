'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

// クライアント側で QueryClient のインスタンスを作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5分間はデータを fresh とみなす（必要に応じて調整）
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* 開発時のみ表示される Devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
