import { DefaultSession, DefaultUser, DefaultJWT } from 'next-auth';

interface McUser {
  id: string;
  name?: string;
  email?: string;
  accessToken: string;
  refreshToken?: string;
  role?: 'voi' | 'epos' | 'guest';
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'voi' | 'epos' | 'guest';
    };
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;

    accessToken?: string;
    refreshToken?: string;
    role?: 'voi' | 'epos' | 'guest';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    role?: 'voi' | 'epos' | 'guest';
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
  }
}
