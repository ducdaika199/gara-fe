'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';
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
import { getUsers } from '@/src/lib/actions';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { log } from 'console';
import { Input } from '../ui/input';

const FormSchema = z.object({
  userId: z.string({
    required_error: 'Hãy chọn một khách hàng',
  }),
  userRequest: z
    .string()
    .min(2, {
      message: 'Yêu cầu của khách hàng phải có tối thiểu 4 ký tự',
    })
    .max(255, 'Yêu cầu của khách hàng chỉ có tối đa 255 ký tự'),
  invoiceItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.string(),
    })
  ),
});

export default function OrderCreateForm() {
  const [users, setUsers] = useState<Partial<User[]>>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: '',
      userRequest: '',
    },
  });

  const { fields, append } = useFieldArray({
    name: 'invoiceItems',
    control: form.control,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data, '-----submit data-------');
  }

  console.log(
    form.watch('invoiceItems'),
    '------watch value invoice items------'
  );

  const searchUsers = useDebouncedCallback(async (query: string) => {
    setUsers([]);
    const data = await getUsers(1, query);
    setUsers(data?.data ?? []);
  }, 300);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Khách hàng :</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user?.id.toString() === field.value
                          )?.name
                        : 'Chọn khách hàng'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
            <FormItem>
              <FormLabel>Y/c khách hàng</FormLabel>
              <FormControl>
                <Input
                  id="username"
                  placeholder="Y/c khách hàng ..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => {
          return (
            <>
              <FormField
                control={form.control}
                name="invoiceItems"
                key={index}
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Form 1</FormLabel>
                      <FormControl>
                        <Input
                          id="productId"
                          placeholder="Y/c khách hàng ..."
                          {...form.register(`invoiceItems.${index}.productId`)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Form 2</FormLabel>
                      <FormControl>
                        <Input
                          id="quantity"
                          placeholder="Y/c khách hàng ..."
                          {...form.register(`invoiceItems.${index}.quantity`)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </>
          );
        })}
        <Button
          type="button"
          onClick={() =>
            append({
              quantity: '',
              productId: '',
            })
          }
        >
          APPEND
        </Button>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
