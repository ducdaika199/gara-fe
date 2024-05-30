'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { useToast } from '@/src/components/ui/use-toast';
import { createProduct } from '@/src/lib/actions';
import { cn } from '@/src/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const ProductCreateSheet = () => {
  const { toast } = useToast();
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
      name: '',
      code: '',
      description: '',
      countUnit: '',
      priceUnit: '',
      type: 'SUPPLIES',
      tax: '',
      ck: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const product = await createProduct({
        ...values,
        priceUnit: Number(values.priceUnit),
        tax: Number(values.tax),
        ck: Number(values.ck),
      });
      if (product) {
        toast({
          className: cn(
            'top-0 left-2 flex fixed md:max-w-[420px] md:top-4 md:right-4]'
          ),
          title: 'Tạo mới sản phẩm thành công',
          description: 'Thành công',
        });
        form.reset();
      }
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

  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Tên sản phẩm..." {...field} />
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input id="description" placeholder="Mô tả..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ĐVT</FormLabel>
                <FormControl>
                  <Input
                    id="countUnit"
                    placeholder="Đơn vị tính..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceUnit"
            render={({ field }) => {
              return (
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
                        {...field}
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
            name="type"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Loại</FormLabel>
                  <Select onValueChange={field.onChange}>
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
              );
            }}
          />
          <FormField
            control={form.control}
            name="tax"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Thuế</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                      <Input
                        className="pl-8"
                        id="amount"
                        maxLength={10}
                        pattern="[0-9]*"
                        placeholder="0.00"
                        type="number"
                        {...field}
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
            name="ck"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Chiết khấu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                      <Input
                        className="pl-8"
                        id="amount"
                        maxLength={10}
                        pattern="[0-9]*"
                        placeholder="0.00"
                        type="text"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end">
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCreateSheet;
