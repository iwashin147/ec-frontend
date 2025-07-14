import { McUser } from '@/features/auth/types/next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type {
  Session,
  NextAuthConfig,
  Account,
  Profile,
  User as NextAuthUser,
} from 'next-auth';

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req): Promise<McUser | null> {
        const res = await fetch('YOUR_BACKEND_API_URL/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user: McUser = await res.json();

        if (res.ok && user && user.accessToken) {
          // アクセストークンの存在も確認
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            role: user.role, // ロールも返す場合
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: JWT;
      user?: NextAuthUser;
      account?: Account | null;
      profile?: Profile;
      isNewUser?: boolean;
      // trigger?: "signIn" | "signUp" | "update"; // 必要であれば追加
      // session?: any; // 必要であれば追加
    }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: NextAuthUser;
    }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
