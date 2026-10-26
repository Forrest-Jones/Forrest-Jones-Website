// Builds img/Forrest-Jones-Resume-Web.pdf from tools/resume/resume.html.
// Usage: node tools/resume/build.js  (needs Playwright with Chromium)
const path = require('path');

let chromium;
try {
	({ chromium } = require('playwright'));
} catch (err) {
	({ chromium } = require('/opt/node22/lib/node_modules/playwright'));
}

(async () => {
	const root = path.resolve(__dirname, '..', '..');
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto('file://' + path.join(__dirname, 'resume.html'), { waitUntil: 'load' });
	await page.pdf({
		path: path.join(root, 'img', 'Forrest-Jones-Resume-Web.pdf'),
		format: 'Letter',
		printBackground: true,
		preferCSSPageSize: true
	});
	await browser.close();
	console.log('Wrote img/Forrest-Jones-Resume-Web.pdf');
})();
