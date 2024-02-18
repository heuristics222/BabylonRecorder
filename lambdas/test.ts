import puppeteer, { JSHandle, Page } from 'puppeteer';
import express from 'express';
import { type Server } from 'http';
import { type Widget } from '../server/lib/babylon.js';
import fs from 'fs';

export async function main(): Promise<void> {
    fs.mkdirSync('screenshots', { recursive: true });

    const server = startServer();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 768,
    });
    await page.goto('http://localhost:3000');

    const canvas = await page.evaluateHandle(() => document.getElementsByTagName('canvas')[0]);
    const widget = await page.evaluateHandle(canvas => new Widget(canvas), canvas);
    let frame = 0;

    await page.evaluate(widget => widget.moveCamera(), widget);
    await page.evaluate(widget => widget.moveCamera(), widget);
    while (frame < 60) {
        await ss(page, widget, frame);
        frame += 1;
    }

    await browser.close();

    server.close();
}

async function ss(page: Page, widget: JSHandle<Widget>, frame: number): Promise<void> {
    await page.evaluate(widget => widget.moveCamera(), widget);
    await page.screenshot({
        path: `screenshots/${('000' + frame).slice(-4)}.png`,
    });
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
