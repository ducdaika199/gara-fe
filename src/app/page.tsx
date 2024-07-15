import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Gara Mạnh Ngà
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Chúng tôi hướng tới xây dựng đội ngũ nhân viên phục vụ với
                  thái độ chuyên nghiệp nhất
                </p>
              </div>
              <div>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="dashboard"
                >
                  Đi tới trang quản lý
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Chất lượng, nhanh chóng, bền lâu
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Hệ thống gara của chúng tôi cam kết giá trị lâu bền, chất
                    lượng tốt nhất và đem đến trải nghiệm có một không hai tới
                    khách hàng
                  </p>
                </div>
              </div>
              <Image
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="https://firebasestorage.googleapis.com/v0/b/image-storage-9d005.appspot.com/o/Yellow%20Luxury%20Car%20Showroom%20Instagram%20Post.png?alt=media&token=c42499e1-5f7a-4f13-b307-4c1a70706884"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-start space-y-4">
                <RocketIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Nhanh chóng</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Khách hàng sẽ nhận được xế yêu nhanh chóng và đạt chất lượng
                  tốt nhất
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <BoltIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Công cụ mạnh mẽ</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Ở đây chúng tôi có đội ngũ kỹ sư và nhân viên lành nghề đáp
                  ứng mọi yêu cầu của khách hàng
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <LayersIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                <h3 className="text-xl font-bold">Chi nhánh rộng khắp</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Trong tương lai ga-ra chúng tôi sẽ phát triển và ngày càng
                  thêm hoàn thiện hơn
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function BoltIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function LayersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
