import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { Provider } from 'next-auth/providers';

interface UserRecord {
  email: string;
  passwordHash: string;
  name: string;
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Correo', type: 'email' },
      password: { label: 'Contraseña', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const users: UserRecord[] = JSON.parse(process.env.AUTH_USERS ?? '[]');

      const user = users.find((u) => u.email === credentials.email);
      if (!user) return null;

      const hash = user.passwordHash.replace(/\\\$/g, '$');
      const passwordOk = await bcrypt.compare(
        credentials.password as string,
        hash
      );
      if (!passwordOk) return null;

      return { id: user.email, name: user.name, email: user.email };
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');
      return isPublicPage || isLoggedIn;
    },
  },
});
