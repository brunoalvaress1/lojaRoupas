const { chromium, devices } = require("playwright");
const OUT = "C:/Users/lipol/AppData/Local/Temp/claude/c--Users-lipol-OneDrive--rea-de-Trabalho-roupasvini/d83873df-c250-4059-84b1-863bc1e25d42/scratchpad";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  const errors = [];
  const pageErrors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("http://localhost:3000/categorias", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/qa-categorias-noimg.png`, fullPage: true });

  console.log("console errors:", JSON.stringify(errors, null, 2));
  console.log("page errors:", JSON.stringify(pageErrors, null, 2));

  await browser.close();
})();
