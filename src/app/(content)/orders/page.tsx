'use client';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Search,
  Truck,
} from 'lucide-react';

import { Badge } from '@/src/components/ui/badge';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/src/components/ui/pagination';
import { Progress } from '@/src/components/ui/progress';
import { Separator } from '@/src/components/ui/separator';
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
import { Input } from '@/src/components/ui/input';
import { getInvoices } from '@/src/lib/actions';
import { Invoice } from '@prisma/client';
import { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getInvoices({take: 10, skip: 0});
      console.log(data)
      setOrders(data?.data ?? []);
    }
    fetchData();
  }, []);

  
  const formattedCurrency = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'});
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleClickInvoice = (item: Invoice) => {
    setSelectedInvoice(item);
  }

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
          <Card className='sm:col-span-2'>
            <CardHeader className='pb-3'>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription className='max-w-lg text-balance leading-relaxed'>
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Create New Order</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>This Week</CardDescription>
              <CardTitle className='text-4xl'>$1329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label='25% increase' />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>This Month</CardDescription>
              <CardTitle className='text-3xl'>$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label='12% increase' />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue='week'>
          <div className='flex items-center'>
            <TabsList>
              <TabsTrigger value='week'>Week</TabsTrigger>
              <TabsTrigger value='month'>Month</TabsTrigger>
              <TabsTrigger value='year'>Year</TabsTrigger>
            </TabsList>
            <div className='relative ml-2 flex-1 md:grow-0'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search...'
                className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
              />
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-sm'
                  >
                    <ListFilter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size='sm' variant='outline' className='h-7 gap-1 text-sm'>
                <File className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only'>Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value='week'>
            <Card>
              <CardHeader className='px-7'>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Recent orders from your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Type
                      </TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Status
                      </TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Date
                      </TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {orders?.map((item) => {
                    return (
                    <TableRow key={item?.id ?? 0} onClick={() => handleClickInvoice(item)} >
                      <TableCell>
                        <div className='font-medium'>{item.user.username}</div>
                        <div className='hidden text-sm text-muted-foreground md:inline'>
                        {item.user.email}
                        </div>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        Sale
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <Badge className='text-xs' variant='secondary'>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>
                        <div>
                        {item.createdDate?.toDateString()}
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>{formattedCurrency.format(item.invoiceItems.reduce((total, i) => total + Number(i.amount), 0))}</TableCell>
                    </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                {/* <div className='text-xs text-muted-foreground'>
                  Hiển thị
                  <strong>{` ${users.pagination.skip} - ${users.pagination.take} `}</strong>
                  of <strong>{users.total} </strong>
                  khách hàng
                </div> */}
                <div className='text-xs ml-auto'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href='#' />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#'>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#' isActive>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href='#'>3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href='#' />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Card className='overflow-hidden'>
          <CardHeader className='flex flex-row items-start bg-muted/50'>
            <div className='grid gap-0.5'>
              <CardTitle className='group flex items-center gap-2 text-lg'>
                Order ID: {selectedInvoice?.id}
                <Button
                  size='icon'
                  variant='outline'
                  className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
                >
                  <Copy className='h-3 w-3' />
                  <span className='sr-only'>Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription>Date: {selectedInvoice?.createdDate.toDateString()}</CardDescription>
            </div>
            <div className='ml-auto flex items-center gap-1'>
              <Button size='sm' variant='outline' className='h-8 gap-1'>
                <Truck className='h-3.5 w-3.5' />
                <span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
                  Track Order
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='outline' className='h-8 w-8'>
                    <MoreVertical className='h-3.5 w-3.5' />
                    <span className='sr-only'>More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className='p-6 text-sm'>
            <div className='grid gap-3'>
              <div className='font-semibold'>Order Details</div>
              <ul className='grid gap-3'>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Glimmer Lamps x <span>2</span>
                  </span>
                  <span>$250.00</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>
                    Aqua Filters x <span>1</span>
                  </span>
                  <span>$49.00</span>
                </li>
              </ul>
              <Separator className='my-2' />
              <ul className='grid gap-3'>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>$299.00</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span>$5.00</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span>$25.00</span>
                </li>
                <li className='flex items-center justify-between font-semibold'>
                  <span className='text-muted-foreground'>Total</span>
                  <span>$329.00</span>
                </li>
              </ul>
            </div>
            <Separator className='my-4' />
            <div className='grid gap-3'>
              <div className='font-semibold'>Customer Information</div>
              <dl className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Customer</dt>
                  <dd>{selectedInvoice?.user.username}</dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Email</dt>
                  <dd>
                    <a href='mailto:'>{selectedInvoice?.user.email}</a>
                  </dd>
                </div>
                <div className='flex items-center justify-between'>
                  <dt className='text-muted-foreground'>Phone</dt>
                  <dd>
                    <a href='tel:'>{selectedInvoice?.user.Phone}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <Separator className='my-4' />
            <div className='grid gap-3'>
              <div className='font-semibold'>Payment Information</div>
              <dl className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <dt className='flex items-center gap-1 text-muted-foreground'>
                    <CreditCard className='h-4 w-4' />
                    Visa
                  </dt>
                  <dd>**** **** **** 4532</dd>
                </div>
              </dl>
            </div>
          </CardContent>
          <CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
            <div className='text-xs text-muted-foreground'>
              Updated <time dateTime='2023-11-23'>November 23, 2023</time>
            </div>
            <Pagination className='ml-auto mr-0 w-auto'>
              <PaginationContent>
                <PaginationItem>
                  <Button size='icon' variant='outline' className='h-6 w-6'>
                    <ChevronLeft className='h-3.5 w-3.5' />
                    <span className='sr-only'>Previous Order</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size='icon' variant='outline' className='h-6 w-6'>
                    <ChevronRight className='h-3.5 w-3.5' />
                    <span className='sr-only'>Next Order</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
export default Orders;