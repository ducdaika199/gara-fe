import ProductCreateSheet from '@/src/components/products/productCreateForm';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import PaginationFooter from '@/src/components/ui/paginationFooter';
import SearchInput from '@/src/components/ui/search';
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
import UserCreateSheet from '@/src/components/users/userCreateForm';
import UserEditSheet from '@/src/components/users/userEditForm';
import { getProducts, getUsers } from '@/src/lib/actions';
import { FileIcon, ListFilterIcon, PlusCircleIcon } from 'lucide-react';

const Products = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const products = await getProducts(currentPage, query);

  const renderType = (type: string) => {
    if (type === 'SUPPLIES') {
      return 'Vật liệu';
    }
    return 'Vật công';
  };

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
            <Sheet>
              <SheetTrigger asChild>
                <Button className='h-8 gap-1' size='sm'>
                  <PlusCircleIcon className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Thêm sản phẩm
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Thêm mới sản phẩm</SheetTitle>
                  <SheetDescription>
                    Tạo mới thông tin sản phẩm ở đây và lưu
                  </SheetDescription>
                </SheetHeader>
                <div className='py-4'>
                  <ProductCreateSheet />
                </div>
                <SheetFooter>
                  <SheetClose asChild></SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <TabsContent value='all'>
          <Card x-chunk='dashboard-06-chunk-0'>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
              <CardDescription>Danh sách sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[100px] sm:table-cell'>
                      ID
                    </TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Đơn vị tính
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Đơn giá
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>Thuế</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Chiết khấu
                    </TableHead>
                    <TableHead className='hidden md:table-cell'>Loại</TableHead>
                    <TableHead>
                      <span className='sr-only'>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.data?.map((item) => {
                    return (
                      <TableRow key={item?.id ?? 0}>
                        <TableCell className='hidden sm:table-cell'>
                          {item?.id ?? 0}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {item?.name ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.countUnit ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {`${item?.priceUnit?.toLocaleString('it-IT')} đ`}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.tax?.toString() ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {item?.ck?.toString() ?? ''}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {renderType(item?.type) ?? ''}
                        </TableCell>
                        <TableCell>
                          {/* <UserEditSheet user={item} /> */}
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
                <strong>{` ${products.data.length} - ${products.pagination.take} `}</strong>
                của <strong>{products.total} </strong>
                sản phẩm
              </div>
              <div className='text-xs ml-auto'>
                <PaginationFooter totalItems={products.total} />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Products;
