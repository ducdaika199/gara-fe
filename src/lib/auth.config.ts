export const authConfig = {
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  trustHostedDomain: true,
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
      const isOnLoginPage = request.nextUrl?.pathname.startsWith('/login');
      const isOnDashboardPage =
        request.nextUrl?.pathname.startsWith('/dashboard');

      // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD

      if (isOnUsersPage && !user) {
        return false;
      }

      if (isOnDashboardPage && !user) {
        return false;
      }

      // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE

      if (isOnProductsPage && !user) {
        return false;
      }

      if (isOnOrdersPage && !user) {
        return false;
      }

      // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE

      if (isOnLoginPage && user) {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }

      return true;
    },
  },
};
