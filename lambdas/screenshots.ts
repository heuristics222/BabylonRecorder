import puppeteer, { Page } from 'puppeteer';
import express from 'express';
import { type Server } from 'http';
import { type Widget } from '../server/lib/babylon.js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function main(): Promise<void> {
    const s3 = new S3Client({
        region: 'us-west-2',
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 768,
    });

    await testAmazon(page, s3);
    // await testBabylon(page);

    await browser.close();
}

async function testAmazon(page: Page, s3: S3Client): Promise<void> {
    await page.goto('https://www.amazon.com');

    await uploadScreenshot(page, s3, 'amazon/screenshot.png');
}

async function testBabylon(page: Page, s3: S3Client): Promise<void> {
    const server = startServer();
    await page.goto('http://localhost:3000');

    const canvas = await page.evaluateHandle(() => document.getElementsByTagName('canvas')[0]);
    const widget = await page.evaluateHandle(canvas => new Widget(canvas), canvas);
    let frame = 0;

    await page.evaluate(widget => widget.moveCamera(), widget);
    await page.evaluate(widget => widget.moveCamera(), widget);
    while (frame < 60) {
        await page.evaluate(widget => widget.moveCamera(), widget);
        await uploadScreenshot(page, s3, `screenshots/${('000' + frame).slice(-4)}.png`);
        frame += 1;
    }
    server.close();
}

async function uploadScreenshot(page: Page, s3: S3Client, path: string): Promise<void> {
    const buffer = await page.screenshot({
        type: 'png',
        encoding: 'binary',
    });

    await s3.send(new PutObjectCommand({
        Bucket: process.env['SCREENSHOT_BUCKET_NAME'],
        Key: path,
        ContentType: 'image/png',
        Body: buffer,
    }));
}

export function startServer(): Server {
    const app = express();
    app.use(express.static('server/dist'));
    app.get('/', (_req, res) => {
        res.send(`<head>
</head>
<body style="margin: 0px">
<canvas style="width:100%;height:100%"></canvas>
<script src="index.js"></script>
</body>`);
    });
    return app.listen(3000);
}
