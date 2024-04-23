const paths = {
  login: '/login',
  root: '/',
  products: '/products',
  users: '/users',
  orders: '/orders',
};
const protectedPaths = [paths.products, paths.users, paths.orders];
const restrictedPaths = [paths.login];

export const checkPathIsProtected = (pathname: string) => {
  return protectedPaths.some((item) => {
    return item === pathname;
  });
};

export const checkPathIsRestricted = (pathname: string) => {
  return restrictedPaths.some((item) => {
    return item === pathname;
  });
};

export default paths;
