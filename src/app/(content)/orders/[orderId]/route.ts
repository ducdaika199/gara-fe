import puppeteer from 'puppeteer';
import { renderTemplate } from '../../../../components/pdf/template';
import locateChrome from 'locate-chrome';

export async function GET(request: Request, context: any) {
  const { params } = context;
  const executablePath: string = await new Promise(resolve => locateChrome((arg: any) => resolve(arg))) || '';
  const browser = await puppeteer.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // `headless: true` (default) enables old Headless;
    // `headless: 'new'` enables new Headless;
    // `headless: false` enables “headful” mode.
  });
  const page = await browser.newPage();
  const html = await renderTemplate(Number(params.orderId));
  await page.setContent(html, { waitUntil: 'load' });
  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    path: 'result.pdf',
    margin: { top: '40px', right: '20px', bottom: '50px', left: '20px' },
    printBackground: true,
    format: 'A4',
  });

  await browser.close();
  return new Response(pdf, { status: 200, statusText: 'OK' });
}
