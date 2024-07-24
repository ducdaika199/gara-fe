import { Copy, File, MoreHorizontalIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

const OrderView = (data: any) => {
  const renderType = (type: string) => {
    if (type === 'SUPPLIES') {
      return 'Vật liệu';
    }
    return 'Vật công';
  };

  return (
    <div>
      <div>
        <Dialog>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem>Xem</DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="max-w-[1200px] max-h-[700px]">
            <DialogHeader>
              <DialogTitle>Thông tin hóa đơn</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết của hóa đơn
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Hóa đơn số: {data?.data?.id ?? ''}
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy Order ID</span>
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Ngày vào:{' '}
                      {new Date(
                        data?.data?.joinDate ?? ''
                      ).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Link href={`/orders/${data.data.id}`} target="_blank">
                      <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          In hóa đơn
                        </span>
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Chi tiết hóa đơn</div>
                    <ul className="grid gap-3">
                      {data?.data?.invoiceItems.map((item: any) => {
                        return (
                          <div key={item.id}>
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                <div className="truncate max-w-[300px]">
                                  <span>{item.productName}</span>
                                </div>
                                x <span>{item.quantity}</span> -{'  '}
                                <span>{renderType(item.productType)}</span>
                              </span>
                              <span>{`${Number(item.price).toLocaleString(
                                'it-IT'
                              )} đ`}</span>
                            </li>
                            <Separator className="my-4" />
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="grid gap-3">
                    <div className="font-semibold">Tạm tính</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Tổng tiền</dt>
                        <dd>
                          {`${Number(data.data.totalAmount).toLocaleString(
                            'it-IT'
                          )} đ`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Thông tin khách hàng</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Khách hàng</dt>
                        <dd>{data?.data?.name ?? ''}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Địa chỉ</dt>
                        <dd>{data?.data?.address ?? ''}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Số điện thoại</dt>
                        <dd>{data?.data?.phoneNumber ?? ''}</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Cập nhật{' '}
                    <time dateTime={data?.data?.joinDate.toDateString() ?? ''}>
                      {new Date(
                        data?.data?.joinDate ?? ''
                      ).toLocaleDateString()}
                    </time>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderView;
