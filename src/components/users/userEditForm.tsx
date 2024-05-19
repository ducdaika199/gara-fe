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
import { updateUser } from '@/src/lib/actions';
import { cn } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { MoreHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

const UserEditSheet = (data: { user: User }) => {
  const [isClient, setIsClient] = useState(false);
  const [isView, setIsView] = useState(false);
  const { toast } = useToast();

  const {
    username,
    email,
    name,
    phoneNumber,
    plateNumber,
    carName,
    carType,
    code,
    id,
  } = data.user;
  const formSchema = z.object({
    username: z.string(),
    email: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    plateNumber: z.string(),
    carName: z.string(),
    carType: z.string(),
    code: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username || '',
      email: email || '',
      name: name || '',
      phoneNumber: phoneNumber || '',
      plateNumber: plateNumber || '',
      carName: carName || '',
      carType: carType || '',
      code: code || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await updateUser(id, values);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
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
                  if (!data.user) return;
                  setIsView(true);
                  form.reset(data.user);
                }}
              >
                <DropdownMenuItem>Xem</DropdownMenuItem>
              </SheetTrigger>
              <SheetTrigger
                asChild
                onClick={() => {
                  if (!data.user) return;
                  setIsView(false);
                  form.reset(data.user);
                }}
              >
                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              </SheetTrigger>
              <DropdownMenuItem>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
            {isView ? (
              <SheetHeader>
                <SheetTitle>Thông tin khách hàng</SheetTitle>
              </SheetHeader>
            ) : (
              <SheetHeader>
                <SheetTitle>Chỉnh sửa thông tin khách hàng</SheetTitle>
                <SheetDescription>
                  Sửa thông tin khách hàng ở đây và lưu
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
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đăng nhập</FormLabel>
                        <FormControl>
                          <Input
                            id='username'
                            placeholder='Tên đăng nhập...'
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
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ email</FormLabel>
                        <FormControl>
                          <Input
                            id='email'
                            placeholder='Địa chỉ email...'
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
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input
                            id='name'
                            placeholder='Tên...'
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
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            id='phoneNumber'
                            placeholder='Số điện thoại...'
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
                    name='plateNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biển số xe</FormLabel>
                        <FormControl>
                          <Input
                            id='plateNumber'
                            placeholder='Biển số xe...'
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
                    name='carName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên xe</FormLabel>
                        <FormControl>
                          <Input
                            id='carName'
                            placeholder='Tên xe...'
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
                    name='carType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại xe</FormLabel>
                        <FormControl>
                          <Input
                            id='carType'
                            placeholder='Loại xe...'
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
      ) : (
        <>
          <Skeleton className='w-[40px] h-[40px]' />
        </>
      )}
    </div>
  );
};

export default UserEditSheet;
