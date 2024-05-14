import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import PaginationFooter from '@/src/components/ui/paginationFooter';
import SearchInput from '@/src/components/ui/search';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { getUsers } from '@/src/lib/actions';
import {
  FileIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
} from 'lucide-react';

const Users = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const users = await getUsers(currentPage, query);

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <Tabs defaultValue='all'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='all'>Tất cả</TabsTrigger>
          </TabsList>
          <div className='relative ml-2 flex-1 md:grow-0'>
            <SearchInput />
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='h-8 gap-1' size='sm' variant='outline'>
                  <ListFilterIcon className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className='h-8 gap-1' size='sm' variant='outline'>
              <FileIcon className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Export
              </span>
            </Button>
            <Button className='h-8 gap-1' size='sm'>
              <PlusCircleIcon className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Thêm khách hàng
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value='all'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Khách hàng</CardTitle>
              <CardDescription>Danh sách khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[100px] sm:table-cell'>
                      STT
                    </TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Số điện thoại
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Biển số xe
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Loại xe
                    </TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.data?.map((item) => {
                    return (
                      <TableRow key={item?.id ?? 0}>
                        <TableCell className='hidden sm:table-cell'>
                          {item?.id ?? 0}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {item?.name ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.phoneNumber ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.plateNumber ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.carName ?? ''}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup='true'
                                size='icon'
                                variant='ghost'
                              >
                                <MoreHorizontalIcon className='h-4 w-4' />
                                <span className='sr-only'>Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuItem>Xóa</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className='text-xs text-muted-foreground'>
                Hiển thị
                <strong>{` ${users.data.length} - ${users.pagination.take} `}</strong>
                của <strong>{users.total} </strong>
                khách hàng
              </div>
              <div className='text-xs ml-auto'>
                <PaginationFooter totalItems={users.total} />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Users;
