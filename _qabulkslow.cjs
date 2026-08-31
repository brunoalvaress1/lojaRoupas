const { chromium } = require("playwright");
const fs = require("fs");
const OUT = "C:/Users/lipol/AppData/Local/Temp/claude/c--Users-lipol-OneDrive--rea-de-Trabalho-roupasvini/d83873df-c250-4059-84b1-863bc1e25d42/scratchpad";
const creds = JSON.parse(fs.readFileSync(".qa-bulkadmin.json", "utf8"));
const photos = Array.from({ length: 8 }, (_, i) => `${OUT}/bulk-${i}.jpg`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });
  const errors = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));
  page.on("requestfailed", (req) => errors.push("REQUESTFAILED: " + req.url().slice(0,150) + " -> " + req.failure()?.errorText));

  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("http://localhost:3000/admin", { timeout: 15000 });
  console.log("logged in");

  await page.goto("http://localhost:3000/admin/produtos/novo", { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "QA Bulk Slow");
  await page.fill('input[name="reference"]', "QABULKSLOW");
  await page.fill('input[name="price"]', "159.90");

  // Throttle to a slow 3G-like profile via CDP, but only for the Supabase storage
  // upload host — the localhost app itself should still respond normally.
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 400, // ms
    downloadThroughput: (400 * 1024) / 8, // ~400kbps
    uploadThroughput: (300 * 1024) / 8, // ~300kbps upload, typical weak mobile data
  });

  const fileInputs = await page.$$('input[type="file"]');
  console.log("uploading 8 photos (~46MB) on throttled ~300kbps upload...");
  const start = Date.now();
  await fileInputs[0].setInputFiles(photos);
  await page.waitForTimeout(500);

  await page.click('button[type="submit"]');

  const navResult = await page.waitForURL("http://localhost:3000/admin/produtos", { timeout: 180000 }).then(() => "success").catch((e) => "TIMEOUT/FAIL: " + e.message);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`elapsed: ${elapsed}s, nav result: ${navResult}, final url: ${page.url()}`);

  await page.screenshot({ path: `${OUT}/qabulkslow-result.png`, fullPage: true });
  const errorP = await page.locator("p.text-red-600, p.text-sm.text-red-600").allTextContents().catch(() => []);
  console.log("visible red error messages:", errorP);

  console.log("\n=== console/network errors ===");
  console.log(errors.join("\n"));
  await browser.close();
})();
