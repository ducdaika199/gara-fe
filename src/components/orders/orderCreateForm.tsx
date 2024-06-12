'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronsUpDown,
  MinusIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { toast } from '@/src/components/ui/use-toast';
import { createInvoice, getProducts, getUsers } from '@/src/lib/actions';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import { Product, User } from '@prisma/client';
import { log } from 'console';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import React from 'react';

const FormSchema = z.object({
  userId: z.string().trim().min(1, {
    message: 'Hãy chọn một khách hàng',
  }),
  userRequest: z
    .string()
    .min(2, {
      message: 'Yêu cầu của khách hàng phải có tối thiểu 4 ký tự',
    })
    .max(255, 'Yêu cầu của khách hàng chỉ có tối đa 255 ký tự'),
  invoiceItems: z.array(
    z.object({
      product: z.object({
        productId: z.string({
          required_error: 'Hãy chọn một sản phẩm',
        }),
        productName: z.string(),
      }),
      quantity: z.string(),
    })
  ),
});

export default function OrderCreateForm() {
  const [users, setUsers] = useState<Partial<User[]>>([]);
  const [products, setProducts] = useState<Partial<Product[]>>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: '',
      userRequest: '',
      invoiceItems: [
        {
          product: {
            productId: '',
            productName: '',
          },
          quantity: '1',
        },
      ],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    name: 'invoiceItems',
    control: form.control,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const invoicesItems = data.invoiceItems.map((item) => {
      return {
        productId: Number(item.product.productId),
        quantity: Number(item.quantity),
      };
    });
    const dataRequest = {
      userId: Number(data.userId ?? ''),
      userRequest: data.userRequest ?? '',
      invoiceItems: invoicesItems,
    };
    if (invoicesItems.find((item) => item.productId === 0)) {
      form.setError('invoiceItems', {
        type: 'manual',
        message: 'Hãy chọn tối thiểu một sản phẩm',
      });
    } else {
      form.clearErrors('invoiceItems');
      const order = await createInvoice(dataRequest);
      if (order) {
        toast({
          className: cn(
            'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
          ),
          title: 'Tạo mới hóa đơn thành công',
          description: 'Thành công',
        });
        form.reset();
      }
    }
  }

  const searchUsers = useDebouncedCallback(async (query: string) => {
    setUsers([]);
    const data = await getUsers(1, query);
    setUsers(data?.data ?? []);
  }, 300);

  const searchProducts = useDebouncedCallback(async (query: string) => {
    setProducts([]);
    const data = await getProducts(1, query);
    setProducts(data?.data ?? []);
  }, 300);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-flow-col gap-2">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Khách hàng: </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between mt-8',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? users.find(
                              (user) => user?.id.toString() === field.value
                            )?.name
                          : 'Chọn khách hàng'}
                        <ChevronsUpDown className="ml-2  h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Tìm kiếm khách hàng..."
                        onValueChange={(value) => searchUsers(value)}
                      />
                      <CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {users.map((user) => (
                            <CommandItem
                              value={user?.name ?? ''}
                              key={user?.id ?? ''}
                              onSelect={() => {
                                form.setValue(
                                  'userId',
                                  user?.id.toString() ?? ''
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  user?.id.toString() === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {user?.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userRequest"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Yêu cầu của khách hàng: </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Điền thông tin yêu cầu của khách hàng ..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex">
          <Button
            type="button"
            onClick={() =>
              append({
                quantity: '1',
                product: {
                  productId: '',
                  productName: '',
                },
              })
            }
          >
            + Thêm mới
          </Button>
        </div>

        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="grid grid-flow-col gap-2 items-center"
            >
              <FormField
                control={form.control}
                name="invoiceItems"
                key={index}
                render={() => {
                  return (
                    <>
                      <FormItem className="flex flex-col">
                        <FormLabel>Sản phẩm: </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-[200px] justify-between mt-8',
                                  !field.id && 'text-muted-foreground'
                                )}
                              >
                                {field.product.productId
                                  ? field.product.productName
                                  : 'Chọn sản phẩm'}

                                <ChevronsUpDown className="ml-2  h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                id="productId"
                                placeholder="Tìm kiếm sản phẩm..."
                                {...form.register(
                                  `invoiceItems.${index}.product.productId`
                                )}
                                onValueChange={(value) => searchProducts(value)}
                              />
                              <CommandEmpty>
                                Không tìm thấy sản phẩm
                              </CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {products.map((product) => {
                                    return (
                                      <CommandItem
                                        value={product?.name ?? ''}
                                        key={product?.id ?? ''}
                                        onSelect={() => {
                                          update(index, {
                                            product: {
                                              productId:
                                                product?.id.toString() ?? '',
                                              productName: product?.name ?? '',
                                            },
                                            quantity: field.quantity ?? '1',
                                          });
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            product?.id.toString() ===
                                              field.product.productId
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {product?.name}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                      <FormItem>
                        <FormLabel>Số lượng: </FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (Number(field.quantity) > 1) {
                                  update(index, {
                                    product: {
                                      productId: field.product.productId,
                                      productName: field.product.productName,
                                    },
                                    quantity: (
                                      Number(field.quantity) - 1
                                    ).toString(),
                                  });
                                }
                              }}
                              className="h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <MinusIcon className="h-5 w-5" />
                              <span className="sr-only">Decrement</span>
                            </Button>
                            <Input
                              id="quantity"
                              type="number"
                              value={field.quantity}
                              {...form.register(
                                `invoiceItems.${index}.quantity`
                              )}
                              disabled
                              className="w-max text-center"
                              min={1}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                update(index, {
                                  product: {
                                    productId: field.product.productId,
                                    productName: field.product.productName,
                                  },
                                  quantity: (
                                    Number(field.quantity) + 1
                                  ).toString(),
                                })
                              }
                              className="h-10 w-10 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <PlusIcon className="h-5 w-5" />
                              <span className="sr-only">Increment</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Button type="button" onClick={() => remove(index)}>
                        Xóa
                      </Button>
                    </>
                  );
                }}
              />
            </div>
          );
        })}

        <Button type="submit" className="ml-auto flex">
          Tạo mới hóa đơn
        </Button>
      </form>
    </Form>
  );
}
