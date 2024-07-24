import { MoreHorizontalIcon } from 'lucide-react';

import OrderCreateForm from '@/src/components/orders/orderCreateForm';
import OrderView from '@/src/components/orders/orderView';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import PaginationFooter from '@/src/components/ui/paginationFooter';
import { Progress } from '@/src/components/ui/progress';
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
import { getInvoices } from '@/src/lib/actions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';

const Orders = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const orders = await getInvoices(currentPage, query);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Hóa đơn</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Tổng hợp hóa đơn và tiền hóa đơn theo tuần, theo tháng
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Tạo mới hóa đơn</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1200px] sm:max-h-[90%]">
                  <DialogHeader>
                    <DialogTitle>Tạo mới hóa đơn</DialogTitle>
                    <DialogDescription>
                      Tạo mới hóa đơn ở đây. Khi xong bấm lưu để tạo mới thành
                      công
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <OrderCreateForm />
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tuần</CardDescription>
              <CardTitle className="text-4xl">$1329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% so với tuần trước
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tháng</CardDescription>
              <CardTitle className="text-3xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% so với tháng trước
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
            </TabsList>
            <div className="relative ml-2 flex-1 md:grow-0">
              <SearchInput />
            </div>
          </div>
          <TabsContent value="all">
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Hóa đơn</CardTitle>
                <CardDescription>Hóa đơn gần đây của gara</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Yêu cầu của khách hàng
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ngày vào
                      </TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders?.data as any[]).map((item) => {
                      return (
                        <TableRow key={item?.id ?? 0}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {item.phoneNumber}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="font-medium truncate max-w-[300px]">
                                  {item.userRequest}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px]">
                                <p>{item.userRequest}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              {new Date(
                                item?.joinDate ?? ''
                              ).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {`${Number(item.totalAmount).toLocaleString(
                              'it-IT'
                            )} đ`}
                          </TableCell>
                          <TableCell>
                            <OrderView data={item} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Hiển thị
                  <strong>{` ${((orders?.data as any[]) || []).length} - ${
                    orders?.pagination?.take
                  } `}</strong>
                  của <strong>{orders?.total} </strong>
                  hóa đơn
                </div>
                <div className="text-xs ml-auto">
                  <PaginationFooter totalItems={orders.total} />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};
export default Orders;
