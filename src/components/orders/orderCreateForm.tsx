'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
  language: z.string({
    required_error: 'Please select a language.',
  }),
});

export default function OrderCreateForm() {
  const [users, setUsers] = useState<Partial<User[]>>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const searchUsers = useDebouncedCallback(async (query: string) => {
    setUsers([]);
    const data = await getUsers(1, query);
    console.log(data, '-----check call function search user----');
    setUsers(data?.data ?? []);
  }, 300);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type='search'
                    placeholder='Search...'
                    className='pr-10'
                    {...field}
                    onChange={(e) => searchUsers(e.target.value)}
                  />
                  {users.length > 0 && (
                    <ul className='mt-2 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950'>
                      {users.map((user) => (
                        <li
                          key={user?.id}
                          className='cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800'
                          onClick={() =>
                            form.setValue('language', user?.name ?? '')
                          }
                        >
                          {user?.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormControl>

              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
