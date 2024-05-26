'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/src/components/ui/sheet';
import { useToast } from '@/src/components/ui/use-toast';
import {
  deleteProduct,
  deleteUser,
  updateProduct,
  updateUser,
} from '@/src/lib/actions';
import { cn } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product, User } from '@prisma/client';
import { MoreHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import CurrencyInput from 'react-currency-input-field';

const ProductEditSheet = (data: { product: Product }) => {
  const [isClient, setIsClient] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<number>(0);
  const { toast } = useToast();

  const { id, name, description, priceUnit, countUnit, ck, tax, code, type } =
    data.product;
  console.log(data.product, '------price unit-------');
  const formSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string(),
    countUnit: z.string(),
    priceUnit: z.string(),
    type: z.string(),
    tax: z.number(),
    ck: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || '',
      code: code || '',
      description: description || '',
      countUnit: countUnit || '',
      priceUnit: priceUnit.toString() || '',
      type: type || 'SUPPLIES',
      tax: ck || 0,
      ck: tax || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await updateProduct(id, values);
      toast({
        className: cn(
          'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
        ),
        title: 'Cập nhật thông tin khách hàng thành công',
        description: 'Thành công',
      });
      return user;
    } catch (err) {
      toast({
        className: cn(
          'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
        ),
        title: 'Có lỗi xảy ra vui lòng thử lại',
        description: 'Lỗi xảy ra',
      });
    }
  }

  async function handleDeleted(id: number) {
    try {
      const product = await deleteProduct(id);
      toast({
        className: cn(
          'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
        ),
        title: 'Xóa sản phẩm thành công',
        description: 'Thành công',
      });
      return product;
    } catch (err) {
      toast({
        className: cn(
          'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
        ),
        title: 'Có lỗi xảy ra vui lòng thử lại',
        description: 'Lỗi xảy ra',
      });
    }
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
        <>
          <Sheet>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup='true' size='icon' variant='ghost'>
                  <MoreHorizontalIcon className='h-4 w-4' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <SheetTrigger
                  asChild
                  onClick={() => {
                    if (!data.product) return;
                    setIsView(true);
                    form.reset(data.product);
                  }}
                >
                  <DropdownMenuItem>Xem</DropdownMenuItem>
                </SheetTrigger>
                <SheetTrigger
                  asChild
                  onClick={() => {
                    if (!data.product) return;
                    setIsView(false);
                    form.reset(data.product);
                  }}
                >
                  <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuItem
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                    setProductSelected(data.product.id);
                  }}
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
              {isView ? (
                <SheetHeader>
                  <SheetTitle>Thông tin sản phẩm</SheetTitle>
                </SheetHeader>
              ) : (
                <SheetHeader>
                  <SheetTitle>Chỉnh sửa thông tin sản phẩm</SheetTitle>
                  <SheetDescription>
                    Sửa thông tin sản phẩm ở đây và lưu
                  </SheetDescription>
                </SheetHeader>
              )}
              <div className='py-4'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                  >
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sản phẩm</FormLabel>
                          <FormControl>
                            <Input
                              id='name'
                              placeholder='Tên sản phẩm...'
                              {...field}
                              disabled={isView}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='code'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã</FormLabel>
                          <FormControl>
                            <Input
                              id='code'
                              placeholder='Mã...'
                              {...field}
                              disabled={isView}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Input
                              id='description'
                              placeholder='Mô tả...'
                              {...field}
                              disabled={isView}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='countUnit'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ĐVT</FormLabel>
                          <FormControl>
                            <Input
                              id='countUnit'
                              placeholder='Đơn vị tính...'
                              {...field}
                              disabled={isView}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='priceUnit'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Đơn giá</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                id='priceUnit'
                                placeholder='đ1,234,567'
                                allowDecimals={false}
                                className={
                                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                }
                                onValueChange={field.onChange}
                                prefix={'đ'}
                                step={10}
                                name='priceUnit'
                                disabled={isView}
                                defaultValue={priceUnit.toString()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => {
                        console.log(field, '-----field-----');
                        return (
                          <FormItem>
                            <FormLabel>Loại</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                              disabled={isView}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Chọn vật công hoặc vật liệu' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value='SUPPLIES'>
                                    Vật liệu
                                  </SelectItem>
                                  <SelectItem value='REPAIRS'>
                                    Vật công
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name='tax'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Thuế</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                id='tax'
                                placeholder='0%'
                                allowDecimals={false}
                                className={
                                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                }
                                onValueChange={field.onChange}
                                suffix={'%'}
                                step={10}
                                name='tax'
                                disabled={isView}
                                defaultValue={tax?.toString()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name='ck'
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Chiết khấu</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                id='ck'
                                placeholder='0%'
                                allowDecimals={false}
                                className={
                                  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                }
                                onValueChange={field.onChange}
                                suffix={'%'}
                                step={10}
                                name='ck'
                                disabled={isView}
                                defaultValue={ck?.toString()}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    {!isView && (
                      <div className='flex justify-end'>
                        <Button type='submit'>Lưu</Button>
                      </div>
                    )}
                  </form>
                </Form>
              </div>
              <SheetFooter>
                <SheetClose asChild></SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={() => {
              setIsDeleteDialogOpen(false);
              setProductSelected(0);
            }}
          >
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Xóa dữ liệu?</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa không?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type='submit'
                  onClick={() => handleDeleted(productSelected)}
                >
                  Xóa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <Skeleton className='w-[40px] h-[40px]' />
        </>
      )}
    </div>
  );
};

export default ProductEditSheet;
