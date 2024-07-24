'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, MinusIcon, PlusIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { cn } from '@/src/lib/utils';
import { Product, User } from '@prisma/client';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const FormSchema = z.object({
  userId: z.string().trim().min(1, {
    message: 'Hãy chọn một khách hàng',
  }),
  userRequest: z
    .string()
    .min(2, {
      message: 'Yêu cầu của khách hàng phải có tối thiểu 4 ký tự',
    })
    .max(525, 'Yêu cầu của khách hàng chỉ có tối đa 525 ký tự'),
  invoiceItems: z.array(
    z.object({
      product: z.object({
        productId: z.string(),
        productName: z.string(),
        price: z.string(),
        type: z.string(),
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
            price: '',
            type: '',
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
        quantity: parseFloat(item.quantity),
        price: Number(item.product.price),
        productName: item.product.productName,
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
    const data = (await getUsers(1, query)) as any;
    setUsers(data?.data ?? []);
  }, 300);

  const searchProducts = useDebouncedCallback(async (query: string) => {
    setProducts([]);
    const data = (await getProducts(1, query)) as any;
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
                      <Input
                        placeholder="Tìm kiếm khách hàng..."
                        onChange={(e) => searchUsers(e.target.value)}
                        className="focus-visible:ring-transparent border-t-0 border-l-0 border-r-0 mb-2"
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy khách hàng</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => {
                            return (
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
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
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
                  price: '',
                  type: '',
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
                                <p className="truncate">
                                  {field.product.productId
                                    ? field.product.productName
                                    : 'Chọn sản phẩm'}
                                </p>

                                <ChevronsUpDown className="ml-2  h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                {...form.register(
                                  `invoiceItems.${index}.product.productName`
                                )}
                                onChange={(e) => searchProducts(e.target.value)}
                                className="focus-visible:ring-transparent border-t-0 border-l-0 border-r-0 mb-2"
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
                                              price:
                                                product?.priceUnit.toString() ??
                                                '',
                                              type: product?.type ?? '',
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
                                        <div className="truncate max-w-[200px]">
                                          {product?.name}
                                        </div>
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
                            <Input
                              id="quantity"
                              // value={field.quantity}
                              defaultValue={'1'}
                              {...form.register(
                                `invoiceItems.${index}.quantity`
                              )}
                              maxLength={10}
                              // pattern="[0-9]*"
                              className="w-max text-center"
                              min={0}
                              step=".01"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormItem>
                        <FormLabel>Đơn giá</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                              đ
                            </span>
                            <Input
                              className="pl-8"
                              id="amount"
                              maxLength={10}
                              pattern="[0-9]*"
                              placeholder="0.00"
                              type="number"
                              value={field.product.price}
                              disabled
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormItem>
                        <FormLabel>Loại</FormLabel>
                        <Select value={field.product.type} disabled>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vật công hoặc vật liệu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="SUPPLIES">Vật liệu</SelectItem>
                              <SelectItem value="REPAIRS">Vật công</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-8"
                      >
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
