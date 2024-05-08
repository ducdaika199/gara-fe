import { getInvoice } from '@/src/lib/actions';
import { renderTemplate } from '@/src/lib/template';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const GET = async (
  request: NextResponse,
  response: NextApiResponse,
  { params }
) => {
  const { slug } = params;
  try {
    const invoice = await getInvoice(slug);
    const browser = await puppeteer.launch({
      headless: 'new',
      // `headless: true` (default) enables old Headless;
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });
    const page = await browser.newPage();
    const html = await renderTemplate(invoice);
    await page.setContent(html, { waitUntil: 'load' });
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      path: 'result.pdf',
      margin: { top: '40px', right: '20px', bottom: '50px', left: '20px' },
      printBackground: true,
      format: 'A4',
    });
    await browser.close();
    request.headers.set('Content-Type', 'application/pdf');
    response.send(pdf);
  } catch (err) {
    console.log(err);
    throw new Error('Failed to fetch posts!');
  }
};
