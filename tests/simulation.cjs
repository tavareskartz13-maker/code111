const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1500, height: 1000 },
        reducedMotion: "reduce",
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:8012/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.clock.install();
    const data = () =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("tavares-dashboard-v1")),
      );
    const dialog = page.locator("#dialog");
    const fill = (name, value) =>
      dialog.locator(`[name="${name}"]`).fill(String(value));
    const nav = (key) =>
      page.locator(`#navigation [data-navigate="${key}"]`).click();
    const configure = async (count, interval, min, max) => {
      await page.locator('[data-action="simulate-sales"]').click();
      await fill("batchCount", count);
      await dialog
        .locator('[name="batchInterval"]')
        .selectOption(String(interval));
      await fill("batchMin", min);
      await fill("batchMax", max);
    };
    const start = async () => {
      await dialog
        .getByRole("button", { name: "Iniciar simulação", exact: true })
        .click();
      await page.clock.runFor(1);
    };
    const clear = async () => {
      await page.locator('[data-action="sim-clear"]').click();
      await dialog
        .getByRole("button", { name: "Limpar simulações", exact: true })
        .click();
    };
    await page
      .getByRole("button", { name: "Personalizar painel", exact: true })
      .click();
    await fill("revenue", 1000);
    await fill("orders", 10);
    await fill("ticket", 100);
    await fill("total", 1000);
    await fill("status_paid", 2);
    await dialog
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await nav("orders");
    await page.locator('[data-action="new-order"]').click();
    await fill("customer", "Pedido cadastrado");
    await fill("amount", 99);
    await dialog
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await configure(10, 0, 50, 50);
    await start();
    assert.equal((await data()).orders.length, 11);
    assert.equal((await data()).orders.filter((o) => o.simulated).length, 10);
    assert.match(
      await page.locator("#sales-simulator").innerText(),
      /LOTE CONCLUÍDO/,
    );
    assert.equal(await page.locator("#orders-list .demo-badge").count(), 10);
    await nav("dashboard");
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /1\.500,00/,
    );
    assert.equal(await page.locator("#metric-orders").innerText(), "20");
    assert.equal(
      await page.locator("#operation-count").innerText(),
      "12 pedidos",
    );
    await page.reload();
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /1\.500,00/,
    );
    assert.equal((await data()).orders.filter((o) => o.simulated).length, 10);
    assert.equal(await page.locator("#simulation-dashboard-note").count(), 0);
    await nav("orders");
    await configure(5, 500, 20, 20);
    await start();
    assert.equal((await data()).orders.length, 12);
    await page.locator('#sales-simulator [data-action="sim-pause"]').click();
    await page.clock.runFor(3000);
    assert.equal((await data()).orders.length, 12);
    await nav("dashboard");
    assert.equal(await page.locator("#simulation-dock").count(), 0);
    assert.equal(
      await page
        .getByRole("button", { name: "Continuar simulação", exact: true })
        .isVisible(),
      false,
    );
    await page
      .getByRole("button", { name: "Personalizar painel", exact: true })
      .click();
    assert.equal(
      await page.locator(".simulation-settings").getAttribute("open"),
      null,
    );
    await page.locator(".simulation-settings summary").click();
    await dialog
      .getByRole("button", { name: "Continuar simulação", exact: true })
      .click();
    await page.clock.runFor(550);
    assert.equal((await data()).orders.length, 13);
    await dialog
      .getByRole("button", { name: "Pausar simulação", exact: true })
      .click();
    await page.clock.runFor(1000);
    assert.equal((await data()).orders.length, 13);
    await dialog
      .getByRole("button", { name: "Continuar simulação", exact: true })
      .click();
    await page.locator("#dialog-close").click();
    await nav("orders");
    await page.locator('[data-action="sim-sound"]').click();
    await page.locator('[data-action="sim-sound"]').click();
    await page.locator('#sales-simulator [data-action="sim-stop"]').click();
    await page.clock.runFor(3000);
    assert.equal((await data()).orders.length, 13);
    await clear();
    assert.equal((await data()).orders.length, 1);
    assert.equal((await data()).orders[0].customer, "Pedido cadastrado");
    await nav("dashboard");
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /1\.000,00/,
    );
    assert.equal(await page.locator("#metric-orders").innerText(), "10");
    assert.match(await page.locator("#metric-ticket").innerText(), /100,00/);
    assert.equal(
      await page.locator("#operation-count").innerText(),
      "2 pedidos",
    );
    await nav("orders");
    await configure(100, 0, 10, 20);
    await dialog.locator('[name="batchMetrics"]').uncheck();
    await start();
    assert.equal((await data()).orders.length, 101);
    assert(
      (await data()).orders
        .filter((o) => o.simulated)
        .every((o) => o.amount >= 10 && o.amount <= 20),
    );
    assert.equal(await page.locator("#orders-list tbody tr").count(), 50);
    await page.locator('[data-action="orders-more"]').click();
    assert.equal(await page.locator("#orders-list tbody tr").count(), 100);
    const exportWait = page.waitForEvent("download");
    await page.locator('[data-action="export-orders"]').click();
    const download = await exportWait;
    const csv = await fs.readFile(await download.path(), "utf8");
    assert.match(csv, /origem/);
    assert.match(csv, /Simulação/);
    await nav("dashboard");
    assert.match(
      await page.locator("#metric-revenue").innerText(),
      /1\.000,00/,
    );
    assert.equal(
      await page.locator("#simulation-dashboard-note").isVisible(),
      false,
    );
    await nav("orders");
    await clear();
    await configure(1, 0, 100, 50);
    await start();
    assert.equal(await dialog.isVisible(), true);
    assert.equal((await data()).orders.length, 1);
    await page.locator("#dialog-cancel").click();
    await configure(4, 500, 100, 100);
    await start();
    await page.clock.runFor(1600);
    assert.equal((await data()).orders.length, 5);
    assert.match(
      await page.locator("#sales-simulator").innerText(),
      /LOTE CONCLUÍDO/,
    );
    assert.equal((await page.locator(".sale-notification").count()) <= 3, true);
    assert.equal(await page.locator('.sale-notification').filter({hasText:/simulação/i}).count(),0);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.screenshot({
      path: "/tmp/code111-sales-mobile.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 1600, height: 1050 });
    await page.screenshot({
      path: "/tmp/code111-sales-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 1500, height: 1000 });
    await clear();
    await nav("catalog");
    await page.locator('[data-action="new-product"]').click();
    await fill("name", "Produto do catálogo");
    await fill("price", 79.9);
    await fill("stock", 30);
    await dialog
      .getByRole("button", { name: "Salvar alterações", exact: true })
      .click();
    await nav("orders");
    await configure(3, 0, 1, 2);
    await dialog.locator('[name="batchProducts"]').selectOption("catalog");
    await dialog.locator('[name="batchStatus"]').selectOption("mix");
    await start();
    assert(
      (await data()).orders
        .filter((o) => o.simulated)
        .every((o) => o.amount === 79.9 && o.productId),
    );
    assert.equal((await data()).products[0].stock, 30);
    await nav("dashboard");
    assert.match(
      await page.locator("#top-products").innerText(),
      /Produto do catálogo/,
    );
    await nav("orders");
    await clear();
    await page.locator('[data-action="simulate-sales"]').click();
    assert.equal(await dialog.locator('[name="batchInterval"]').inputValue(), "5000");
    await fill("batchCount",2);
    await start();
    assert.equal((await data()).orders.length,2);
    await page.clock.runFor(4000);
    assert.equal((await data()).orders.length,2);
    await page.clock.runFor(1100);
    assert.equal((await data()).orders.length,3);
    assert.match(await page.locator("#sales-simulator").innerText(),/LOTE CONCLUÍDO/);
    assert.deepEqual(errors, []);
    console.log(
      "PASS: criação em lote, identificação, totais, status, persistência, entradas em sequência, pausa/retomada, encerramento, preservação dos indicadores manuais, exclusão seletiva, modo sem métricas, paginação, origem no CSV, validação de valores, conclusão e layout móvel.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
