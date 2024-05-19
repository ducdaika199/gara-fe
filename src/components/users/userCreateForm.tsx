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

import { Button } from '../ui/button';
import { createUser } from '@/src/lib/actions';
import { useState, useEffect } from 'react';
import { useToast } from '@/src/components/ui/use-toast';
import { cn } from '@/src/lib/utils';

const UserCreateSheet = () => {
  const { toast } = useToast();
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
    try {
      const user = await createUser(values);
      if (user) {
        toast({
          className: cn(
            'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
          ),
          title: 'Tạo mới khách hàng thành công',
          description: 'Thành công',
        });
        form.reset();
      }
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

  return (
    <div className='py-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                  <Input id='email' placeholder='Địa chỉ email...' {...field} />
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
                  <Input id='name' placeholder='Tên...' {...field} />
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
                  <Input id='carName' placeholder='Tên xe...' {...field} />
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
                  <Input id='carType' placeholder='Loại xe...' {...field} />
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
                  <Input id='code' placeholder='Mã...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button type='submit'>Lưu</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserCreateSheet;
