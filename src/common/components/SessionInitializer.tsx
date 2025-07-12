'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/common/store/authStore';

export default function SessionInitializer() {
  const { data: session, status } = useSession();
  const { login, logout } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      login({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
      });
    } else if (status === 'unauthenticated') {
      logout();
    }
  }, [session, status, login, logout]);

  return null;
}
