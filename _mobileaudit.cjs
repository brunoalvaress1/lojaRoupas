const { chromium, devices } = require("playwright");
const OUT = "C:/Users/lipol/AppData/Local/Temp/claude/c--Users-lipol-OneDrive--rea-de-Trabalho-roupasvini/d83873df-c250-4059-84b1-863bc1e25d42/scratchpad";

const PAGES = [
  { name: "home", url: "/" },
  { name: "categorias", url: "/categorias" },
  { name: "colecao", url: "/colecao" },
  { name: "login", url: "/login" },
  { name: "carrinho", url: "/carrinho" },
  { name: "sobre", url: "/sobre" },
];

(async () => {
  const browser = await chromium.launch();
  const iphone = devices["iPhone 13"];
  const context = await browser.newContext({ ...iphone, }); // real mobile network throttling not applied; measuring on localhost (fast) — focus on payload weight, not latency
  const page = await context.newPage();

  for (const p of PAGES) {
    const errors = [];
    const reqs = [];
    page.removeAllListeners("console");
    page.removeAllListeners("response");
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("response", async (res) => {
      try {
        const headers = res.headers();
        const len = headers["content-length"] ? parseInt(headers["content-length"], 10) : 0;
        reqs.push({ url: res.url(), len, type: headers["content-type"] || "" });
      } catch {}
    });

    const t0 = Date.now();
    await page.goto(`http://localhost:3000${p.url}`, { waitUntil: "networkidle" });
    const loadTime = Date.now() - t0;

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);

    const totalBytes = reqs.reduce((s, r) => s + r.len, 0);
    const imgBytes = reqs.filter(r => r.type.startsWith("image")).reduce((s, r) => s + r.len, 0);
    const jsBytes = reqs.filter(r => r.type.includes("javascript")).reduce((s, r) => s + r.len, 0);
    const numReqs = reqs.length;
    const biggestImages = reqs.filter(r => r.type.startsWith("image")).sort((a,b) => b.len - a.len).slice(0, 5);

    console.log(`\n=== ${p.name} (${p.url}) ===`);
    console.log(`load(networkidle): ${loadTime}ms | horizontal overflow: ${overflow} (scrollWidth ${scrollWidth} vs innerWidth ${innerWidth})`);
    console.log(`requests: ${numReqs} | total: ${(totalBytes/1024).toFixed(0)}KB | images: ${(imgBytes/1024).toFixed(0)}KB | js: ${(jsBytes/1024).toFixed(0)}KB`);
    console.log(`biggest images:`, biggestImages.map(i => `${(i.len/1024).toFixed(0)}KB ${i.url.slice(0,90)}`));
    if (errors.length) console.log("console errors:", errors);

    await page.screenshot({ path: `${OUT}/mobile-${p.name}.png`, fullPage: true });
  }

  await browser.close();
})();
