import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { prisma } from './db';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials, request) => {
        let user = null;

        // logic to salt and hash password

        // logic to verify if user exists
        user = await prisma.user.findUnique({
          where: {
            username: credentials.username as string,
          },
        });

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error('User not found.');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isPasswordCorrect) throw new Error('Wrong credentials!');

        // return user object with their profile data
        return user as any | null;
      },
    }),
  ],
  // callbacks: {
  //   async signIn({ user, account, profile }) {
  //     return true;
  //   },
  //   ...authConfig.callbacks,
  // },
});
