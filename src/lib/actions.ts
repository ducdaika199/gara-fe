'use server';

import { signIn, signOut } from './auth';
import { prisma } from './db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export const register = async (formData) => {
  const { username, password } = formData;

  try {
    const users = await prisma.user.findMany();
    const findUser = users.find((item) => item.username === username);

    if (findUser) {
      return { error: 'Username already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      username,
      password: hashedPassword,
    };
    await prisma.user.create({
      data: newUser,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: 'Something went wrong!' };
  }
};

export const login = async (formData) => {
  const { username, password } = formData;

  try {
    await signIn('credentials', { username, password });
  } catch (err: any) {
    if (err.message.includes('CredentialsSignin')) {
      return { error: 'Invalid username or password' };
    }
    throw err;
  }
};

export const handleLogout = async () => {
  'use server';
  await signOut();
};

// user action

export const getUsers = async (page, query) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);
  const users = await prisma.$transaction([
    prisma.user.findMany({
      take: take,
      skip: skip,
      where: {
        OR: [
          {
            name: {
              startsWith: query,
            },
          },
        ],
        NOT: {
          status: 'INACTIVE',
        },
      },
    }),
    prisma.user.count(),
  ]);
  return {
    data: users[0],
    total: users[1],
    pagination: {
      take,
      skip,
    },
  };
};

export const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

export const createUser = async (formData) => {
  const user = await prisma.user.create({
    data: formData,
  });
  revalidatePath('/users');
  return user;
};

export const updateUser = async (id, formData) => {
  const userUpdated = await prisma.user.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/users');
  return userUpdated;
};

export const deleteUser = async (id) => {
  const userDeleted = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      status: 'INACTIVE',
    },
  });
  revalidatePath('/users');
  return userDeleted;
};

// product actions

export const getProducts = async (page, query) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);
  const products = await prisma.$transaction([
    prisma.product.findMany({
      take: take,
      skip: skip,
      where: {
        OR: [
          {
            name: {
              startsWith: query,
            },
          },
        ],
        NOT: {
          status: 'INACTIVE',
        },
      },
    }),
    prisma.product.count(),
  ]);
  return {
    data: products[0],
    total: products[1],
    pagination: {
      take,
      skip,
    },
  };
};

export const getProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  return product;
};

export const createProduct = async (formData) => {
  const product = await prisma.product.create({
    data: formData,
  });
  revalidatePath('/products');
  return product;
};

export const updateProduct = async (id, formData) => {
  const productUpdate = await prisma.product.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/products');
  return productUpdate;
};

export const deleteProduct = async (id) => {
  const productDeleted = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      status: 'INACTIVE',
    },
  });
  revalidatePath('/products');
  return productDeleted;
};

// invoice actions
export const getInvoices = async (page, query) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);
  const invoices = await prisma.$transaction([
    prisma.invoice.findMany({
      take: take,
      skip: skip,
      where: {
        OR: [
          {
            user: {
              username: {
                startsWith: query,
              },
            },
          },
        ],
        NOT: {
          user: {
            status: 'INACTIVE',
          },
        },
      },
      include: {
        user: true,
        invoiceItems: true,
      },
    }),
    prisma.invoice.count(),
  ]);
  return {
    data: invoices[0],
    total: invoices[1],
    pagination: {
      take,
      skip,
    },
  };
};

export const getInvoice = async (id) => {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: id,
    },
    include: {
      invoiceItems: {
        select: {
          quantity: true,
          id: true,
          product: true,
        },
      },
      user: true,
    },
  });
  return invoice;
};

export const createInvoice = async (formData) => {
  const { userRequest, userId, invoiceItems } = formData;
  console.log(invoiceItems, '-----invoiceItems--------');
  const invoice = await prisma.invoice.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      userRequest,
      invoiceItems: {
        createMany: {
          data: invoiceItems,
        },
      },
    },
  });
  revalidatePath('/invoices');
  return invoice;
};

export const updateInvoice = async (id, formData) => {
  const invoiceUpdated = await prisma.invoice.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/invoices');
  return invoiceUpdated;
};

export const deleteInvoice = async (id) => {
  const invoiceDeleted = await prisma.invoice.update({
    where: {
      id: id,
    },
    data: {
      status: 'INACTIVE',
    },
  });
  revalidatePath('/invoices');
  return invoiceDeleted;
};
