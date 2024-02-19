import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';
import { run } from './screenshots.js';

chromium.setHeadlessMode = true;

export async function main(): Promise<void> {
    const time = +new Date();
    const path = await chromium.executablePath('/opt/');
    console.log(`extracting binaries: ${+new Date() - time}ms`);

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: path,
        headless: true,
    });

    await run(browser);
    await browser.close();
}
