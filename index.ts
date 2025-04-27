
import puppeteer from "puppeteer";
import { firstTimeRun, readEnvFile } from "./fileUtils";

let data = readEnvFile() || (await firstTimeRun());

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

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

