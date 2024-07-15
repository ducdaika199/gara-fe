'use server';

import { signIn, signOut } from './auth';
import { prisma } from './db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export const register = async (formData: any) => {
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

export const login = async (formData: any) => {
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

export const getUsers = async (page: any, query: any) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);

  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS unaccent;`;

  const users = await prisma.$queryRaw`
  SELECT *
  FROM "User"
  WHERE (
    unaccent("name") ILIKE unaccent(${query} || '%')
    AND "status" != 'INACTIVE'
  )
  LIMIT ${take}
  OFFSET ${skip};`;

  const count = (await prisma.$queryRaw`
  SELECT COUNT(*)
  FROM "User"
  WHERE (
  unaccent("name") ILIKE unaccent(${query} || '%')
  AND "status" != 'INACTIVE'
);
`) as any;

  return {
    data: users,
    total: Number(count[0].count),
    pagination: {
      take,
      skip,
    },
  };
};

export const getUser = async (id: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

export const createUser = async (formData: any) => {
  const user = await prisma.user.create({
    data: formData,
  });
  revalidatePath('/users');
  return user;
};

export const updateUser = async (id: any, formData: any) => {
  const userUpdated = await prisma.user.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/users');
  return userUpdated;
};

export const deleteUser = async (id: any) => {
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

export const getProducts = async (page: any, query: any) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS unaccent;`;

  const products = await prisma.$queryRaw`
  SELECT *
  FROM "Product"
  WHERE (
    unaccent("name") ILIKE unaccent(${query} || '%')
    AND "status" != 'INACTIVE'
  )
  LIMIT ${take}
  OFFSET ${skip};`;

  const count = (await prisma.$queryRaw`
SELECT COUNT(*)
FROM "Product"
WHERE (
  unaccent("name") ILIKE unaccent(${query} || '%')
  AND "status" != 'INACTIVE'
);
`) as any;

  return {
    data: products,
    total: Number(count[0].count),
    pagination: {
      take,
      skip,
    },
  };
};

export const getProduct = async (id: any) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
  return product;
};

export const createProduct = async (formData: any) => {
  const product = await prisma.product.create({
    data: formData,
  });
  revalidatePath('/products');
  return product;
};

export const updateProduct = async (id: any, formData: any) => {
  const productUpdate = await prisma.product.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/products');
  return productUpdate;
};

export const deleteProduct = async (id: any) => {
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
export const getInvoices = async (page: any, query: any) => {
  const ITEM_PER_PAGE = 10;
  const take = ITEM_PER_PAGE;
  const skip = ITEM_PER_PAGE * (page - 1);
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS unaccent;`;
  const invoices = await prisma.$queryRaw`
        SELECT
      "Invoice"."id",
      "Invoice"."userRequest",
      "Invoice"."joinDate",
      "Invoice"."userId",
      "Invoice"."status",
      "Invoice"."totalAmount",
      u."username",
      u."email",
      u."phoneNumber",
      array_agg(
        json_build_object(
          'id', "InvoiceItem"."id",
          'quantity', "InvoiceItem"."quantity",
          'productId', "InvoiceItem"."productId",
          'price', "InvoiceItem"."price",
          'productName', p."name"
        )
      ) AS "invoiceItems"
    FROM
      "Invoice" 
    LEFT JOIN
      "InvoiceItem" ON "Invoice"."id" = "InvoiceItem"."invoiceId"
    LEFT JOIN
      "Product" p ON "InvoiceItem"."productId" = p."id"
    LEFT JOIN
      "User" u ON "Invoice"."userId" = u."id"
    WHERE (
        unaccent(u."username") ILIKE unaccent(${query} || '%')
        AND u."status" != 'INACTIVE'
      )
    GROUP BY
      "Invoice"."id", "Invoice"."userRequest", "Invoice"."joinDate", "Invoice"."userId", "Invoice"."status", "Invoice"."totalAmount", u."username", u."email", u."phoneNumber";
  `;
  const count = (await prisma.$queryRaw`
    SELECT COUNT(*) 
    FROM "Invoice" i
    LEFT JOIN "User" u ON i."userId" = u."id"
    WHERE (
      u."username" LIKE ${query + '%'}
    )
    AND u."status" != 'INACTIVE';
  `) as any;
  return {
    data: invoices,
    total: Number(count[0].count),
    pagination: {
      take,
      skip,
    },
  };
};

export const getInvoice = async (id: any) => {
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

export const createInvoice = async (formData: any) => {
  const { userRequest, userId, invoiceItems } = formData;
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
      totalAmount: invoiceItems.reduce(
        (acc: any, cur: any) => acc + cur.quantity * cur.price,
        0
      ),
    },
  });
  revalidatePath('/invoices');
  return invoice;
};

export const updateInvoice = async (id: any, formData: any) => {
  const invoiceUpdated = await prisma.invoice.update({
    where: {
      id: id,
    },
    data: formData,
  });
  revalidatePath('/invoices');
  return invoiceUpdated;
};

export const deleteInvoice = async (id: any) => {
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
