'use client';

import React from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/src/components/ui/sheet';
import { PlusCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { createUser } from '@/src/lib/actions';

const UserCreateSheet = () => {
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
      username: '',
      email: '',
      name: '',
      phoneNumber: '',
      plateNumber: '',
      carName: '',
      carType: '',
      code: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createUser(values);
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="h-8 gap-1" size="sm">
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Thêm khách hàng
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Thêm mới khách hàng</SheetTitle>
            <SheetDescription>
              Tạo mới thông tin khách hàng ở đây và lưu
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Tên đăng nhập..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Địa chỉ email..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Tên..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          id="phoneNumber"
                          placeholder="Số điện thoại..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biển số xe</FormLabel>
                      <FormControl>
                        <Input
                          id="plateNumber"
                          placeholder="Biển số xe..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên xe</FormLabel>
                      <FormControl>
                        <Input
                          id="carName"
                          placeholder="Tên xe..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại xe</FormLabel>
                      <FormControl>
                        <Input
                          id="carType"
                          placeholder="Loại xe..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã</FormLabel>
                      <FormControl>
                        <Input id="code" placeholder="Mã..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Lưu</Button>
                </div>
              </form>
            </Form>
          </div>
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UserCreateSheet;
