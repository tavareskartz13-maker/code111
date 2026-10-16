const assert = require("node:assert/strict");
const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1600, height: 1000 },
        reducedMotion: "reduce",
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:8011/", {
      waitUntil: "domcontentloaded",
    });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    const dialog = page.locator("#dialog");
    const fill = async (name, value) =>
      dialog.locator(`[name="${name}"]`).fill(String(value));
    const save = () =>
      dialog
        .getByRole("button", { name: "Salvar alterações", exact: true })
        .click();
    const openEditor = () =>
      page
        .getByRole("button", { name: "Personalizar painel", exact: true })
        .click();
    const nav = (key) =>
      page.locator(`#navigation [data-navigate="${key}"]`).click();
    assert.match(await page.locator("#metric-revenue").innerText(), /0,00/);
    await openEditor();
    await fill("revenue", 12500.5);
    await fill("orders", 50);
    await fill("today", 3);
    await fill("shipped", 35);
    await fill("total", 12500.5);
    await fill("status_paid", 12);
    await fill("status_delivered", 20);
    await dialog.locator("#calculate-ticket").click();
    await save();
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /12\.500,50/,
    );
    assert.match(await page.locator("#metric-ticket").innerText(), /250,01/);
    assert.equal(
      await page.locator("#operation-count").innerText(),
      "32 pedidos",
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /12\.500,50/,
    );
    await page.locator('[data-period="7"]').click();
    assert.match(await page.locator("#metric-revenue").innerText(), /0,00/);
    await openEditor();
    await fill("series", "10;20;30;40;50;60;70");
    await save();
    assert.match(await page.locator("#chart-total").innerText(), /280,00/);
    await page.locator('[data-period="30"]').click();
    assert.equal(await page.locator("#metric-orders").innerText(), "50");
    await nav("catalog");
    await page.locator('[data-action="new-product"]').click();
    await fill("name", "Camiseta <teste>");
    await fill("sku", "TEST-001");
    await fill("price", 59.9);
    await fill("stock", 20);
    await save();
    assert.match(
      await page.locator("#module-view").innerText(),
      /Camiseta <teste>/,
    );
    await nav("orders");
    await page.locator('[data-action="new-order"]').click();
    await fill("customer", "Cliente de teste");
    await dialog
      .locator('[name="productId"]')
      .selectOption({ label: "Camiseta <teste>" });
    await dialog.locator('[name="status"]').selectOption("delivered");
    await save();
    assert.match(await page.locator("#module-view").innerText(), /59,90/);
    await nav("dashboard");
    assert.match(
      await page.locator("#recent-orders").innerText(),
      /Cliente de teste/,
    );
    assert.match(
      await page.locator("#top-products").innerText(),
      /Camiseta <teste>/,
    );
    await nav("tools");
    await page.locator('[data-action="calculator"]').first().click();
    await fill("cost", 30);
    await fill("price", 100);
    await fill("fee", 10);
    assert.match(await page.locator("#calculator-output").innerText(), /60,00/);
    await page.locator("#dialog-close").click();
    const download = page.waitForEvent("download");
    await page.locator('#module-view [data-action="export"]').click();
    assert.match((await download).suggestedFilename(), /relatorio-30d/);
    await nav("import");
    const chooser = page.waitForEvent("filechooser");
    await page.locator('[data-action="import-csv"]').click();
    await (
      await chooser
    ).setFiles({
      name: "produtos.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("nome;sku;preco;estoque\nCaneca;CAN-001;29,90;10"),
    });
    await dialog
      .getByRole("button", { name: "Importar produtos", exact: true })
      .click();
    assert.match(await page.locator("#module-view").innerText(), /Caneca/);
    await nav("finance");
    await page.locator('[data-action="new-transaction"]').click();
    await fill("description", "Venda teste");
    await fill("amount", 250);
    await save();
    assert.match(await page.locator(".summary-cards").innerText(), /250,00/);
    await nav("suppliers");
    await page.locator('[data-action="new-supplier"]').click();
    await fill("name", "Fornecedor exemplo");
    await save();
    assert.match(
      await page.locator("#module-view").innerText(),
      /Fornecedor exemplo/,
    );
    await nav("integrations");
    await page.locator('[data-action="new-integration"]').first().click();
    await fill("name", "Minha loja");
    await fill("url", "https://example.com/loja");
    await save();
    assert.equal(
      await page.locator("#module-view a").getAttribute("href"),
      "https://example.com/loja",
    );
    await nav("tickets");
    await page.locator('[data-action="new-ticket"]').click();
    await fill("subject", "Pendência");
    await fill("description", "Verificar estoque");
    await save();
    assert.match(await page.locator("#module-view").innerText(), /Pendência/);
    await nav("dashboard");
    await page.locator("#theme-button").click();
    assert(
      await page
        .locator("body")
        .evaluate((el) => el.classList.contains("light")),
    );
    await page.locator("#theme-button").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#mobile-menu").click();
    await page.locator('#navigation [data-navigate="catalog"]').click();
    assert.match(await page.locator("#module-view").innerText(), /Caneca/);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.locator("#mobile-menu").click();
    await page.locator('#navigation [data-navigate="dashboard"]').click();
    await page.locator("#mobile-menu").click();
    await openEditor();
    await fill("revenue", 15000);
    await save();
    await page.keyboard.press("Escape");
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /15\.000,00/,
    );
    await page.setViewportSize({ width: 1600, height: 1000 });
    await nav("tools");
    await page.locator('#module-view [data-action="backup"]').click();
    const backupDownload = page.waitForEvent("download");
    await dialog.locator('[data-action="download-backup"]').click();
    const backupFile = await (await backupDownload).path();
    await page.locator("#dialog-close").click();
    await nav("dashboard");
    await openEditor();
    await fill("revenue", 1);
    await save();
    await nav("tools");
    await page.locator('#module-view [data-action="backup"]').click();
    const restoreChooser = page.waitForEvent("filechooser");
    await dialog.locator('[data-action="restore"]').click();
    await (await restoreChooser).setFiles(backupFile);
    await dialog
      .getByRole("button", { name: "Substituir e restaurar" })
      .click();
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /15\.000,00/,
    );
    await nav("catalog");
    await page.locator('[data-delete="products"]').first().click();
    await page.locator("#dialog-cancel").click();
    assert.equal(await page.locator('[data-delete="products"]').count(), 2);
    await page.locator('[data-delete="products"]').first().click();
    await dialog
      .getByRole("button", { name: "Excluir registro", exact: true })
      .click();
    assert.equal(await page.locator('[data-delete="products"]').count(), 1);
    await nav("dashboard");
    await page.setViewportSize({ width: 390, height: 844 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.screenshot({ path: "/tmp/code111-mobile.png", fullPage: true });
    assert.deepEqual(errors, []);
    const clean = await browser.newPage({
      viewport: { width: 1920, height: 1000 },
    });
    await clean.goto(process.env.TEST_URL || "http://127.0.0.1:8011/", {
      waitUntil: "domcontentloaded",
    });
    await clean.screenshot({
      path: "/tmp/code111-dashboard.png",
      fullPage: true,
    });
    console.log(
      "PASS: indicadores, ticket, status, persistência, períodos independentes, série do gráfico, produtos, pedidos, top produtos, calculadora, exportação, importação CSV, financeiro, fornecedores, canais, chamados, tema e editor móvel; nenhum erro JavaScript.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
