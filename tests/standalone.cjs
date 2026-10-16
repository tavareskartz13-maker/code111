const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");
(async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "code111-offline-"));
  const html = path.join(folder, "index (download).html");
  await fs.copyFile(path.join(__dirname, "..", "index.html"), html);
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      offline: true,
      reducedMotion: "reduce",
    });
    const errors = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!r.isNavigationRequest()) requests.push(r.url());
    });
    await page.route("**/*", async (route) => {
      if (route.request().isNavigationRequest())
        await route.fulfill({
          status: 200,
          contentType: "text/html; charset=utf-8",
          body: await fs.readFile(html, "utf8"),
        });
      else await route.abort();
    });
    // The managed Chromium blocks file: URLs. Serve only the copied document
    // through interception, while network access remains disabled.
    await page.goto("http://single-document.test/index%20(download).html");
    assert.equal(
      await page
        .locator("body")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgb(11, 12, 14)",
    );
    assert.equal(await page.locator("#navigation [data-navigate]").count(), 10);
    await page
      .getByRole("button", { name: "Personalizar painel", exact: true })
      .click();
    await page.locator('[name="revenue"]').fill("9876.54");
    await page
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /9\.876,54/,
    );
    await page.reload();
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /9\.876,54/,
    );
    assert.deepEqual(
      requests,
      [],
      "O HTML deve funcionar sem buscar arquivos externos.",
    );
    assert.deepEqual(errors, []);
    await page.screenshot({ path: "/tmp/code111-offline.png", fullPage: true });
    console.log(
      "PASS: documento único copiado para pasta isolada e carregado sem rede; visual escuro, menu, edição e persistência; nenhuma dependência externa ou erro JavaScript.",
    );
  } finally {
    await browser.close();
    await fs.rm(folder, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
