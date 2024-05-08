export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    // FOR MORE DETAIL ABOUT CALLBACK FUNCTIONS CHECK https://next-auth.js.org/configuration/callbacks
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    authorized({ auth, request }: any) {
      const user = auth?.user;
      const isOnUsersPage = request.nextUrl?.pathname.startsWith('/users');
      const isOnProductsPage =
        request.nextUrl?.pathname.startsWith('/products');
      const isOnOrdersPage = request.nextUrl?.pathname.startsWith('/orders');

      // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD

      if (isOnUsersPage && !user?.isAdmin) {
        return false;
      }

      // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE

      if (isOnProductsPage && !user) {
        return false;
      }

      // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE

      if (isOnOrdersPage && user) {
        return Response.redirect(new URL('/', request.nextUrl));
      }

      return true;
    },
  },
};
