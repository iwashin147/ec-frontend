// auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        // ダミーデータ
        if (email === 'test@example.com' && password === 'test1234') {
          return { id: '1', name: 'Test User', email: 'test@example.com' };
        }
        return null;
      },
    }),
  ],
  // 他のAuth.js設定 (コールバックなど) をここに追加可能
});
