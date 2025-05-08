import puppeteer from "puppeteer";
import { firstTimeRun, readEnvFile } from "./fileUtils";

let data = readEnvFile() || (await firstTimeRun());

const browser = await puppeteer.launch({
	headless: true,
	args: ['--disable-blink-features=AutomationControlled'] // Tries to hide automation
});
const page = await browser.newPage();

// Set a common user agent
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

await page.evaluateOnNewDocument(() => {
	// Pass a common webdriver test
	Object.defineProperty(navigator, 'webdriver', {
		get: () => false,
	});
	// Pass the Chrome test
	// @ts-ignore
	window.chrome = {
		// @ts-ignore
		runtime: {},
	};
	// Pass the permissions test
	// @ts-ignore
	navigator.permissions.query = (parameters) => (
		parameters.name === 'notifications' ?
			Promise.resolve({ state: Notification.permission }) :
			Promise.reject(new Error('Unknown permission name'))
	);
});

await page.goto('https://sa.www4.irs.gov/wmr/');
// Set screen size.
await page.setViewport({ width: 1080, height: 1024 });

await page.locator('input#ssnInputControl').fill(data.ssn);
await page.locator(`input[data-testid="${data.taxYear}"]`).click();
await page.locator(`#${data.filingStatus}`).click();
await page.locator('input[name=refundAmountInput]').fill(data.amount);
await page.locator('text/Submit').click();

try {
	// getting the step we are on to get the text
	const step = await page.waitForSelector('li:has(> div.current-step)', { timeout: 2000 });
	const txt = await step?.evaluate(el => el.textContent);
	console.log(`current step: ${txt}`);

} catch {
	const content = await page.waitForSelector('.section-alert__content');
	if (content) {
		const txt = await content.evaluate(el => el.textContent);
		console.log(`message: ${txt}`);
	}
}

// still need to get a good page back and see what the message is 

await browser.close();

