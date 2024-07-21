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
import { deleteProduct, updateProduct } from '@/src/lib/actions';
import { cn } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';

const ProductEditSheet = (data: any) => {
  const [isClient, setIsClient] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productSelected, setProductSelected] = useState<number>(0);
  const { toast } = useToast();

  const { id, name, description, priceUnit, countUnit, ck, tax, code, type } =
    data.product;
  const formSchema = z.object({
    name: z.string(),
    code: z.string(),
    description: z.string(),
    countUnit: z.string(),
    priceUnit: z.string(),
    type: z.string(),
    tax: z.string(),
    ck: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || '',
      code: code || '',
      description: description || '',
      countUnit: countUnit || '',
      priceUnit: priceUnit || '',
      type: type || 'SUPPLIES',
      tax: ck || '',
      ck: tax || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await updateProduct(id, {
        ...values,
        priceUnit: Number(values.priceUnit),
        tax: Number(values.tax),
        ck: Number(values.ck),
      });
      toast({
        className: cn(
          'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
        ),
        title: 'Cập nhật thông tin sản phẩm thành công',
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
                            <Textarea
                              id='name'
                              placeholder='Tên sản phẩm...'
                              className='resize-none'
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
                              <div className='relative'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                                  đ
                                </span>
                                <Input
                                  className='pl-8'
                                  id='amount'
                                  maxLength={12}
                                  pattern='[0-9]*'
                                  placeholder=''
                                  type='text'
                                  {...field}
                                  disabled={isView}
                                />
                              </div>
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
                              <div className='relative'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                                  %
                                </span>
                                <Input
                                  className='pl-8'
                                  id='tax'
                                  maxLength={10}
                                  pattern='[0-9]*'
                                  placeholder=''
                                  type='text'
                                  {...field}
                                  disabled={isView}
                                />
                              </div>
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
                              <div className='relative'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                                  %
                                </span>
                                <Input
                                  className='pl-8'
                                  id='ck'
                                  maxLength={10}
                                  pattern='[0-9]*'
                                  placeholder=''
                                  type='text'
                                  {...field}
                                  disabled={isView}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    {!isView && (
                      <div className='flex justify-end'>
                        <Button
                          type='submit'
                          disabled={!form.formState.isDirty}
                        >
                          Lưu
                        </Button>
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
