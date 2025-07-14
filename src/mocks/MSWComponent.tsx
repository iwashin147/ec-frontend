'use client';

import { useEffect } from 'react';

export const MSWComponent = () => {
  useEffect(() => {
    const initMocks = async () => {
      if (typeof window !== 'undefined') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      }
    };

    if (process.env.NODE_ENV === 'development') {
      initMocks();
    }
  }, []);

  return null; // このコンポーネントはUIを描画しない
};
