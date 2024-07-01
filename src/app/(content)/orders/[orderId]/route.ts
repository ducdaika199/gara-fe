import puppeteer from 'puppeteer';
import { renderTemplate } from '../../../../components/pdf/template';

export async function GET(request: Request, context: any) {
  const { params } = context;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
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
