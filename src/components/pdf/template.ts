import VNnum2words from 'vn-num2words';
import { getInvoice } from '../../lib/actions';

export const renderTemplate = async (invoiceId) => {
  const invoice = await getInvoice(invoiceId);
  const joinDate = new Date(invoice?.joinDate ?? '').toLocaleDateString();
  const invoiceItems = invoice?.invoiceItems ?? [];
  const suppliesProducts = invoiceItems.filter(
    (el) => el.product.type === 'SUPPLIES'
  );
  const totalMoneyProduct = suppliesProducts.reduce(
    (acc, cur) => acc + Number(cur.quantity) * Number(cur.product.priceUnit),
    0
  );
  const totalMoneyPayProduct = suppliesProducts.reduce((acc, cur) => {
    const moneyProduct =
      Number(cur?.quantity) * Number(cur?.product?.priceUnit);
    const moneyPay =
      moneyProduct +
      moneyProduct * (cur?.product?.tax ?? 0 / 100) +
      moneyProduct * (cur?.product?.ck ?? 0 / 100);
    return acc + moneyPay;
  }, 0);
  const repairsGeneral = invoiceItems.filter(
    (el) => el.product.type === 'REPAIRS'
  );
  const totalMoneyRepairs = repairsGeneral.reduce(
    (acc, cur) => acc + Number(cur.quantity) * Number(cur.product.priceUnit),
    0
  );
  const totalMoneyPayRepairs = repairsGeneral.reduce((acc, cur) => {
    const moneyProduct =
      Number(cur?.quantity) * Number(cur?.product?.priceUnit);
    const moneyPay =
      moneyProduct +
      moneyProduct * (cur?.product?.tax ?? 0 / 100) +
      moneyProduct * (cur?.product?.ck ?? 0 / 100);
    return acc + moneyPay;
  }, 0);

  const totalMoneyProductRepairs = (
    parseInt(totalMoneyProduct) + parseInt(totalMoneyRepairs)
  ).toLocaleString('it-IT');
  const totalMoneyPayProductRepairs = (
    parseInt(totalMoneyPayProduct) + parseInt(totalMoneyPayRepairs)
  ).toLocaleString('it-IT');
  const numberToWords = VNnum2words(
    parseInt(totalMoneyPayProduct) + parseInt(totalMoneyPayRepairs)
  );

  const template = `<!DOCTYPE html>
<html>
  <head>
    <title>Gara Manh Nga</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css?family=Be Vietnam"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 14px;
      }
    </style>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div
      class="flex border-b border-slate-600 items-center justify-between pr-4 pl-2"
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/image-storage-9d005.appspot.com/o/Logo.svg?alt=media&token=23085c26-f388-4e26-aa1a-e3ca3e273728"
        alt=""
        class="object-contain w-[150px] h-100"
      />
      <div class="flex flex-col items-center">
        <h1 class="font-bold text-lg">GARA Ô TÔ MẠNH NGÀ</h1>
        <p class="italic">59 Ngô Gia Tự, Long Biên, Hà Nội</p>
        <div class="flex">
          <p class="mr-4">Điện thoại: 0913936098</p>
          <p>Email: Garaotomanhnga@gmail.com</p>
        </div>
      </div>
    </div>

    <div>
      <div><p class="uppercase font-bold ml-[40px] pt-2">Đơn hàng:</p></div>
      <div class="border border-slate-600 rounded">
        <div class="flex px-[30px]">
          <div>
            <p>Tên KH: ${invoice?.user?.name || ''}</p>
            <p>Mã KH:  ${invoice?.user?.code || ''}</p>
            <p>Điện thoại:${invoice?.user?.phoneNumber || ''} </p>
            <p>Địa chỉ: ${invoice?.user?.address || ''}</p>
            <p>Biển số:${invoice?.user?.plateNumber || ''} </p>
          </div>
          <div class="ml-auto">
            <p>Đơn hàng số: ${invoice?.id || ''}</p>
            <p>Tên xe: ${invoice?.user?.carName || ''} </p>
            <p>Kiểu xe: ${invoice?.user?.carType || ''} </p>
            <p>Ngày xe vào: ${joinDate || ''}</p>
          </div>
        </div>
      </div>
      <div class="border-slate-600 rounded mt-2">
        <p class="ml-[40px]">Yêu cầu khách hàng: ${invoice?.userRequest}</p>
      </div>
      <table class="border-collapse border border-slate-500 mb-[50px] w-full">
        <thead>
          <tr>
            <th class="border border-slate-600">STT</th>
            <th class="border border-slate-600">Mã VTHH</th>
            <th class="border border-slate-600">Mô tả</th>
            <th class="border border-slate-600 w-[30px]">ĐVT</th>
            <th class="border border-slate-600 w-[30px]">SL</th>
            <th class="border border-slate-600 w-[85px]">Đơn giá</th>
            <th class="border border-slate-600">% CK</th>
            <th class="border border-slate-600">% Thuế</th>
            <th class="border border-slate-600 w-[85px]">Tiền hàng</th>
            <th class="border border-slate-600 w-[85px]">Thanh toán</th>
          </tr>
        </thead>
        <tbody>
        <tr>
        <th class="font-bold" colspan="10">Phần vật tư phụ tùng</th>
      </tr>
         ${suppliesProducts
           .map((item, index) => {
             const moneyProduct =
               Number(item?.quantity) * Number(item?.product?.priceUnit);
             const moneyPay =
               moneyProduct +
               moneyProduct * (item?.product?.tax / 100) +
               moneyProduct * (item?.product?.ck / 100);
             const tableItemsData = `
   
  <tr>
    <th class="font-light border border-slate-600">${index + 1}</th>
    <th class="font-light border border-slate-600">${item.product.code}</th>
    <th class="font-light border border-slate-600">
    ${item.product.description}
    </th>
    <th class="font-light border border-slate-600">${
      item.product.countUnit
    }</th>
    <th class="font-light border border-slate-600">${item.quantity}</th>
    <th class="font-light border border-slate-600">${parseInt(
      item.product.priceUnit
    ).toLocaleString('it-IT')}</th>
    <th class="font-light border border-slate-600">${item.product.ck}</th>
    <th class="font-light border border-slate-600">${item.product.tax}</th>
    <th class="font-light border border-slate-600">${moneyProduct.toLocaleString(
      'it-IT'
    )}</th>
    <th class="font-light border border-slate-600">${moneyPay.toLocaleString(
      'it-IT'
    )}</th>
  </tr>  
  `;
             return tableItemsData;
           })
           .join(' ')}
  <tr>
  <th colspan="3">Tổng cộng tiền vật tư, phụ tùng</th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th>${parseInt(totalMoneyProduct).toLocaleString('it-IT')}</th>
  <th>${parseInt(totalMoneyPayProduct).toLocaleString('it-IT')}</th>
  </tr>
          <tr class="border border-slate-600">
            <th colspan="10">Phần sửa chữa chung</th>
          </tr>
        ${repairsGeneral
          .map((item, index) => {
            const moneyProduct = item?.quantity * item?.product?.priceUnit;
            const moneyPay =
              moneyProduct +
              moneyProduct * (item?.product?.tax / 100) +
              moneyProduct * (item?.product?.ck / 100);
            const tableItemsData = `<tr>
          <th class="font-light border border-slate-600">${index}</th>
          <th class="font-light border border-slate-600">${
            item?.product?.code
          }</th>
          <th class="font-light border border-slate-600">
            ${item?.product?.description}
          </th>
          <th class="font-light border border-slate-600">${
            item?.product?.countUnit
          }</th>
          <th class="font-light border border-slate-600">${item?.quantity}</th>
          <th class="font-light border border-slate-600">${parseInt(
            item.product.priceUnit
          ).toLocaleString('it-IT')}</th>
          <th class="font-light border border-slate-600">${item.product.ck}</th>
          <th class="font-light border border-slate-600">${
            item.product.tax
          }</th>
          <th class="font-light border border-slate-600">${moneyProduct.toLocaleString(
            'it-IT'
          )}</th>
          <th class="font-light border border-slate-600">${moneyPay.toLocaleString(
            'it-IT'
          )}</th>
        </tr>`;
            return tableItemsData;
          })
          .join(' ')}
          
          <tr>
            <th colspan="3">Tổng cộng tiền công</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>${parseInt(totalMoneyRepairs).toLocaleString('it-IT')}</th>
            <th>${parseInt(totalMoneyPayRepairs).toLocaleString('it-IT')}</th>
          </tr>
        </tbody>
      </table>
      <div class="font-bold ml-auto w-[220px] mb-[20px]">
        <div
          class="bg-slate-200 justify-center items-center px-4 border-t border-slate-300"
        >
          <p>Tổng tiền hàng: ${totalMoneyProductRepairs}</p>
        </div>
        <div class="justify-center items-center px-4 border-t border-slate-300">
          <p>Tổng CK: 0</p>
        </div>
        <div
          class="bg-slate-200 justify-center items-center px-4 border-t border-slate-300"
        >
          <p>Thuế VAT: 0</p>
        </div>
        <div class="justify-center items-center px-4 border-t border-slate-300">
          <p>Tổng thanh toán: ${totalMoneyPayProductRepairs}</p>
        </div>
      </div>
      <div class="ml-auto w-[350px] italic">
        <p>Số tiền bằng chữ: ${numberToWords}</p>
      </div>
      <div class="flex justify-between px-4 pt-4 pb-[100px]">
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold uppercase">Khách hàng</p>
          <p class="italic">(Ký, họ tên)</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold uppercase">Kế toán</p>
          <p class="italic">(Ký, họ tên)</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold uppercase">Người lập phiếu</p>
          <p class="italic">(Ký, họ tên)</p>
        </div>
        <div class="flex flex-col justify-center items-center">
          <p class="font-bold uppercase">Người phê duyệt</p>
          <p class="italic">(Ký, họ tên)</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  return template;
};
