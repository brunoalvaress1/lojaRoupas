const { chromium } = require("playwright");
const fs = require("fs");
const OUT = "C:/Users/lipol/AppData/Local/Temp/claude/c--Users-lipol-OneDrive--rea-de-Trabalho-roupasvini/d83873df-c250-4059-84b1-863bc1e25d42/scratchpad";
const creds = JSON.parse(fs.readFileSync(".qa-bulkadmin.json", "utf8"));
const photos = Array.from({ length: 8 }, (_, i) => `${OUT}/bulk-${i}.jpg`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error" || msg.type() === "warning") errors.push(`[${msg.type()}] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));
  page.on("requestfailed", (req) => errors.push("REQUESTFAILED: " + req.url().slice(0,150) + " -> " + req.failure()?.errorText));

  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("http://localhost:3000/admin", { timeout: 15000 });
  console.log("logged in");

  await page.goto("http://localhost:3000/admin/produtos/novo", { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "QA Bulk Fotos");
  await page.fill('input[name="reference"]', "QABULKFOTOS");
  await page.fill('input[name="price"]', "159.90");

  const fileInputs = await page.$$('input[type="file"]');
  console.log("uploading all 8 photos at once (~46MB total)...");
  const start = Date.now();
  await fileInputs[0].setInputFiles(photos);
  await page.waitForTimeout(500);

  const thumbCount = await page.locator('section:has-text("Imagens") img, section:has-text("Fotos gerais") img').count();
  console.log("thumbnails rendered after selecting files:", thumbCount);

  await page.click('button[type="submit"]');

  // Wait longer since 8 concurrent large uploads take time
  const navResult = await page.waitForURL("http://localhost:3000/admin/produtos", { timeout: 60000 }).then(() => "success").catch((e) => "TIMEOUT/FAIL: " + e.message);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`elapsed: ${elapsed}s, nav result: ${navResult}, final url: ${page.url()}`);

  const bodyText = await page.textContent("body").catch(() => "");
  console.log("visible error text on page:", bodyText.match(/(Não foi possível[^.]*\.|erro[^.]*\.)/i)?.[0] ?? "(none found)");
  await page.screenshot({ path: `${OUT}/qabulk-result.png`, fullPage: true });

  console.log("\n=== console/network errors ===");
  console.log(errors.join("\n"));
  await browser.close();
})();
