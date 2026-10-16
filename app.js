"use strict";
const $ = (s, root = document) => root.querySelector(s),
  $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const money = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(v) || 0,
  );
const integer = (v) => new Intl.NumberFormat("pt-BR").format(Number(v) || 0);
const numeric = (v) => {
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) ? Math.max(0, Math.min(n, 1e12)) : 0;
};
const id = () =>
  globalThis.crypto?.randomUUID?.() ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);
const day = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const dateLabel = (d) => new Date(`${d}T12:00:00`).toLocaleDateString("pt-BR");
const icons = {
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  panel:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m7-11-3 3 3 3"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  store:
    '<path d="M4 10v11h16V10M3 10l2-6h14l2 6M3 10a3 3 0 0 0 4.5 2.6A3 3 0 0 0 12 12a3 3 0 0 0 4.5.6A3 3 0 0 0 21 10M9 21v-6h6v6"/>',
  factory: '<path d="M3 21V4h4v9l7-5v5l7-5v13ZM7 17h1m4 0h1m4 0h1"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M3 6h1m-1 6h1m-1 6h1"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  wallet:
    '<path d="M20 8V5H5a2 2 0 0 0 0 4h16v12H5a2 2 0 0 1-2-2V7m18 6h-5v4h5"/>',
  tool: '<path d="m14 6 4 4 4-4a7 7 0 0 1-9 9l-7 7-4-4 7-7a7 7 0 0 1 9-9Z"/>',
  book: '<path d="m2 8 10-5 10 5-10 5ZM6 10v7c4 4 8 4 12 0v-7m4-2v8"/>',
  headphones:
    '<path d="M3 14v-2a9 9 0 0 1 18 0v2M3 13h4v8H5a2 2 0 0 1-2-2Zm18 0h-4v8h2a2 2 0 0 0 2-2Z"/>',
  logout: '<path d="M9 4H4v16h5m6-12 4 4-4 4m-7-4h11"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  bell: '<path d="M5 16V9a7 7 0 0 1 14 0v7l2 3H3Zm5 6h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  refresh:
    '<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
  trend: '<path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/>',
  cart: '<path d="M2 3h3l3 13h11l3-10H6"/><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>',
  box: '<path d="m12 2 9 5v10l-9 5-9-5V7Zm-9 5 9 5 9-5m-9 5v10M8 4l9 5v5"/>',
  plug: '<path d="M8 2v5m8-5v5M6 7h12v5a6 6 0 0 1-12 0Zm6 11v4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1.5.8-1.5 1-1.5 3m0 3h.01"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  calculator:
    '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};
const icon = (n) =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[n] || icons.box}</svg>`;
function hydrate(root = document) {
  $$("i[data-icon]", root).forEach(
    (el) => (el.outerHTML = icon(el.dataset.icon)),
  );
}
const statuses = [
  ["label", "Aguardando etiqueta", "#f5ab16"],
  ["sku", "Vincular SKU", "#f14e59"],
  ["payment", "Aguardando pagamento", "#f5ab16"],
  ["paid", "Pagos (aguardando impressão)", "#24cc70"],
  ["printed", "Impressos (aguardando despacho)", "#4286ff"],
  ["shipped", "Despachados", "#4286ff"],
  ["posted", "Postados", "#4286ff"],
  ["delivered", "Entregues", "#ebebeb"],
  ["cancelled", "Cancelados", "#91949b"],
];
const blankMetrics = () => ({
  revenue: 0,
  orders: 0,
  today: 0,
  ticket: 0,
  shipped: 0,
  total: 0,
  series: [],
  status: Object.fromEntries(statuses.map((s) => [s[0], 0])),
});
const emptyState = () => ({
  version: 1,
  name: "Tavares",
  theme: "dark",
  wallet: 0,
  pix: "",
  periods: { 7: blankMetrics(), 30: blankMetrics(), 365: blankMetrics() },
  products: [],
  orders: [],
  suppliers: [],
  transactions: [],
  integrations: [],
  tickets: [],
});
const KEY = "tavares-dashboard-v1";
let storageOK = true;
function normalize(raw) {
  if (!raw || raw.version !== 1) throw Error("Formato de backup incompatível.");
  const out = emptyState();
  out.name = String(raw.name || "Tavares").slice(0, 60);
  out.theme = raw.theme === "light" ? "light" : "dark";
  out.wallet = numeric(raw.wallet);
  out.pix = String(raw.pix || "").slice(0, 200);
  for (const p of [7, 30, 365]) {
    const m = raw.periods?.[p] || {};
    for (const k of [
      "revenue",
      "orders",
      "today",
      "ticket",
      "shipped",
      "total",
    ])
      out.periods[p][k] = numeric(m[k]);
    for (const k of ["orders", "today", "shipped"])
      out.periods[p][k] = Math.floor(out.periods[p][k]);
    for (const [k] of statuses)
      out.periods[p].status[k] = Math.floor(numeric(m.status?.[k]));
    out.periods[p].series = Array.isArray(m.series)
      ? m.series.slice(0, p === 365 ? 12 : p).map(numeric)
      : [];
  }
  const required = {
    products: ["name"],
    orders: ["customer", "date"],
    suppliers: ["name"],
    transactions: ["description", "date"],
    integrations: ["name", "url"],
    tickets: ["subject", "description"],
  };
  const allowed = [
    "id",
    "name",
    "sku",
    "price",
    "stock",
    "customer",
    "amount",
    "status",
    "date",
    "quantity",
    "productId",
    "email",
    "phone",
    "notes",
    "description",
    "type",
    "url",
    "subject",
  ];
  for (const type of Object.keys(required)) {
    if (raw[type] !== undefined && !Array.isArray(raw[type]))
      throw Error("Lista inválida.");
    const seen = new Set();
    out[type] = (raw[type] || []).slice(0, 10000).map((r) => {
      if (!r || typeof r !== "object") throw Error("Registro inválido.");
      const item = {};
      for (const [k, v] of Object.entries(r))
        if (allowed.includes(k) && ["string", "number"].includes(typeof v))
          item[k] =
            typeof v === "string"
              ? v.slice(0, 5000)
              : Number.isFinite(v)
                ? v
                : 0;
      item.id = String(item.id || id());
      if (seen.has(item.id)) throw Error("ID repetido.");
      seen.add(item.id);
      for (const k of required[type])
        if (typeof item[k] !== "string" || !item[k].trim())
          throw Error("Campo obrigatório ausente.");
      for (const k of [
        "name",
        "sku",
        "customer",
        "email",
        "phone",
        "notes",
        "subject",
        "description",
        "productId",
      ])
        if (k in item) item[k] = String(item[k]);
      for (const k of ["price", "stock", "amount", "quantity"])
        if (k in item) item[k] = numeric(item[k]);
      if (
        item.date &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
          !Number.isFinite(Date.parse(item.date)))
      )
        throw Error("Data inválida.");
      if (type === "products") {
        item.price = numeric(item.price);
        item.stock = Math.floor(numeric(item.stock));
        item.sku = String(item.sku || "");
      }
      if (type === "orders") {
        item.amount = numeric(item.amount);
        item.quantity = Math.floor(numeric(item.quantity) || 1);
        if (!statuses.some(([k]) => k === item.status)) item.status = "payment";
      }
      if (type === "transactions") {
        item.amount = numeric(item.amount);
        item.type = item.type === "out" ? "out" : "in";
      }
      if (type === "integrations") {
        const url = new URL(item.url);
        if (!["https:", "http:"].includes(url.protocol))
          throw Error("Endereço inválido.");
        item.url = url.href;
      }
      return item;
    });
  }
  return out;
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : emptyState();
  } catch (e) {
    storageOK = false;
    return emptyState();
  }
}
let state = load(),
  period = 30,
  view = "dashboard",
  filter = "",
  toastTimer,
  dialogHandler;
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOK = true;
  } catch {
    storageOK = false;
  }
  $("#save-status").textContent = storageOK
    ? "Dados salvos neste navegador"
    : "Não foi possível salvar no navegador. Exporte um backup.";
  if (!storageOK)
    toast("Armazenamento indisponível. Exporte um backup antes de fechar.");
  renderDashboard();
}
function toast(message) {
  clearTimeout(toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 3800);
}
const metrics = () => state.periods[period];
const periodName = () => (period === 365 ? "12m" : `${period}d`);
const navItems = [
  ["dashboard", "home", "Dashboard"],
  ["catalog", "layers", "Catálogo"],
  ["import", "store", "Importadores"],
  ["suppliers", "factory", "Fornecedores"],
  ["orders", "list", "Pedidos"],
  ["integrations", "globe", "Integrações"],
  ["finance", "wallet", "Financeiro & PIX"],
  ["tools", "tool", "Ferramentas"],
  ["tutorials", "book", "Tutoriais"],
  ["tickets", "headphones", "Chamados"],
];
function renderNav() {
  $("#navigation").innerHTML =
    navItems
      .map(
        ([key, i, label]) =>
          `<button data-navigate="${key}" class="${view === key ? "active" : ""}" title="${label}" ${key === "tools" ? 'aria-expanded="false"' : ""}>${icon(i)}<span class="nav-label">${label}</span>${key === "tools" ? '<span class="nav-arrow">' + icon("chevron") + "</span>" : ""}</button>${key === "tools" ? '<div class="tool-submenu" hidden><button data-action="calculator">Calculadora de margem</button><button data-action="export">Exportar relatório</button><button data-action="backup">Backup e restauração</button></div>' : ""}`,
      )
      .join("") +
    `<button class="logout" data-action="exit">${icon("logout")}<span class="nav-label">Sair</span></button>`;
}
function table(headers, rows) {
  return `<table><thead><tr>${headers.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
}
function statusName(k) {
  return statuses.find((s) => s[0] === k)?.[1] || "Aguardando pagamento";
}
const actionButtons = (type, item) =>
  `<div class="row-actions"><button data-edit="${type}" data-id="${esc(item.id)}" aria-label="Editar ${esc(item.name || item.customer || item.subject || item.description || "registro")}">Editar</button><button class="danger" data-delete="${type}" data-id="${esc(item.id)}" aria-label="Excluir ${esc(item.name || item.customer || item.subject || item.description || "registro")}">Excluir</button></div>`;
function orderRows(list, actions = false) {
  return table(
    ["Pedido / Cliente", "Valor", "Status", ...(actions ? ["Ações"] : [])],
    list.map(
      (o) =>
        `<tr><td><strong>#${esc(o.id.slice(0, 8).toUpperCase())}</strong><small>${esc(o.customer)} · ${esc(dateLabel(o.date))}</small></td><td>${money(o.amount)}</td><td><span class="badge">${esc(statusName(o.status))}</span></td>${actions ? `<td>${actionButtons("orders", o)}</td>` : ""}</tr>`,
    ),
  );
}
function renderDashboard() {
  const m = metrics();
  $("#metric-revenue").textContent = money(m.revenue);
  $("#metric-orders").textContent = integer(m.orders);
  $("#metric-today").textContent = integer(m.today);
  $("#metric-ticket").textContent = money(m.ticket);
  $("#metric-shipped").textContent = integer(m.shipped);
  $("#metric-order-caption").textContent = integer(m.orders);
  $("#chart-total").textContent = money(m.total);
  $$(".period-label").forEach((el) => (el.textContent = periodName()));
  $$("[data-period]").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.period) === period);
    el.setAttribute(
      "aria-pressed",
      String(Number(el.dataset.period) === period),
    );
  });
  $$(".user-name").forEach((el) => (el.textContent = state.name));
  $$(".avatar").forEach(
    (el) => (el.textContent = state.name.slice(0, 1).toUpperCase()),
  );
  document.body.classList.toggle("light", state.theme === "light");
  $("#wallet-value").textContent = money(state.wallet);
  const total = statuses.reduce((n, [k]) => n + m.status[k], 0);
  $("#operation-count").textContent = `${integer(total)} pedidos`;
  $("#operation-status").innerHTML = statuses
    .map(
      ([k, label, color]) =>
        `<div class="status-row"><div class="status-label"><span><b style="background:${color}"></b>${label}</span><span>${integer(m.status[k])}</span></div><div class="status-track"><span style="width:${total ? (m.status[k] / total) * 100 : 0}%;background:${color}"></span></div></div>`,
    )
    .join("");
  const recent = [...state.orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  $("#recent-orders").innerHTML = recent.length
    ? orderRows(recent)
    : '<div class="empty-state">Nenhum pedido recente</div>';
  const sold = state.products
    .map((p) => ({
      ...p,
      sold: state.orders
        .filter((o) => o.productId === p.id && o.status !== "cancelled")
        .reduce((n, o) => n + numeric(o.quantity), 0),
    }))
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);
  $("#top-products").innerHTML = sold.length
    ? sold
        .map(
          (p) =>
            `<div class="product-row"><span class="product-placeholder">${icon("box")}</span><div><strong>${esc(p.name)}</strong><small>${integer(p.sold)} itens vendidos</small></div><strong>${money(p.price * p.sold)}</strong></div>`,
        )
        .join("")
    : '<div class="empty-state">Nenhum produto vendido ainda</div>';
  renderChart();
}
function chartData() {
  const m = metrics(),
    count = period === 365 ? 12 : period;
  if (m.series.length)
    return Array.from({ length: count }, (_, i) => numeric(m.series[i]));
  const weights = Array.from(
      { length: count },
      (_, i) => 1 + Math.sin(i * 1.7) * 0.35 + (i / count) * 0.3,
    ),
    sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (m.total * w) / sum);
}
function chartDates() {
  return Array.from({ length: period === 365 ? 12 : period }, (_, i) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    if (period === 365) {
      d.setDate(1);
      d.setMonth(d.getMonth() - (11 - i));
      return d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    }
    d.setDate(d.getDate() - (period - 1 - i));
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  });
}
function renderChart() {
  const svg = $("#performance-chart");
  if (!svg) return;
  const rect = $("#chart-wrap").getBoundingClientRect();
  if (!rect.width) return;
  const width = Math.round(rect.width),
    height = Math.round(rect.height),
    left = 46,
    right = width - 12,
    bottom = height - 26,
    top = 18;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const data = chartData(),
    dates = chartDates(),
    max = Math.max(...data);
  const magnitude = max ? 10 ** Math.floor(Math.log10(max / 4)) : 1;
  const ceiling = max ? Math.ceil(max / 4 / magnitude) * magnitude * 4 : 4;
  const x = (i) => left + (i / (data.length - 1)) * (right - left),
    y = (v) => bottom - (v / ceiling) * (bottom - top);
  const points = data.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`);
  const maxLabels = Math.max(2, Math.floor((right - left) / 34)),
    step = Math.ceil(data.length / maxLabels);
  let markup =
    '<defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f7e500" stop-opacity=".16"/><stop offset="100%" stop-color="#f7e500" stop-opacity="0"/></linearGradient></defs>';
  for (let i = 0; i < 5; i++) {
    const v = (ceiling * i) / 4;
    const label = new Intl.NumberFormat("pt-BR", {
      notation: v > 999 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(v);
    markup += `<line x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="2 4"/><text x="${left - 7}" y="${y(v) + 4}" text-anchor="end" fill="var(--muted)" font-size="9">R$ ${label}</text>`;
  }
  markup += `<polygon points="${left},${bottom} ${points.join(" ")} ${right},${bottom}" fill="url(#chart-fill)"/><polyline points="${points.join(" ")}" fill="none" stroke="var(--yellow)" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
  dates.forEach((label, i) => {
    if (
      i === 0 ||
      i === dates.length - 1 ||
      (i % step === 0 && i < dates.length - 1 - step / 2)
    )
      markup += `<text x="${x(i)}" y="${height - 10}" fill="var(--muted)" font-size="9" text-anchor="middle">${label}</text>`;
  });
  markup += `<line id="chart-hover-line" x1="${left}" x2="${left}" y1="${top}" y2="${bottom}" stroke="var(--muted)" stroke-dasharray="3 3" visibility="hidden"/>`;
  svg.innerHTML = markup;
}
function field(label, name, value = "", type = "text", extra = "") {
  return `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
}
const numField = (label, name, value = 0, decimal = false) =>
  field(
    label,
    name,
    value,
    "number",
    `min="0" max="1000000000000" step="${decimal ? ".01" : "1"}" required`,
  );
function selectField(label, name, options, value) {
  return `<label class="field">${label}<select name="${name}">${options.map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(value) ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
}
function showDialog(title, html, handler, saveText = "Salvar alterações") {
  const dialog = $("#dialog");
  if (dialog.open) dialog.close();
  $("#dialog-form").reset();
  $("#dialog-title").textContent = title;
  $("#dialog-body").innerHTML = html;
  $("#dialog-save").textContent = saveText;
  $(".dialog-actions").hidden = !handler;
  dialogHandler = handler;
  dialog.showModal();
  hydrate(dialog);
}
function closeDialog() {
  $("#dialog").close();
  dialogHandler = null;
}
function openEditor() {
  const m = metrics();
  showDialog(
    `Personalizar painel · ${periodName()}`,
    `<p class="dialog-description">Ajuste os indicadores do período selecionado. As alterações ficam salvas somente neste navegador. Os cadastros de pedidos permanecem independentes desses indicadores.</p><div class="form-grid">${numField("Faturamento Total (R$)", "revenue", m.revenue, true)}${numField("Pedidos no Período", "orders", m.orders)}${numField("Ticket Médio (R$)", "ticket", m.ticket, true)}${numField("Itens Despachados", "shipped", m.shipped)}${numField("Pedidos hoje", "today", m.today)}${numField("Total acumulado do gráfico (R$)", "total", m.total, true)}<button type="button" class="inline-action full-width" id="calculate-ticket">Calcular ticket pelo faturamento ÷ pedidos</button></div><fieldset class="form-section"><legend>Status da operação</legend><div class="form-grid">${statuses.map(([k, label]) => numField(label, `status_${k}`, m.status[k])).join("")}</div></fieldset><fieldset class="form-section"><legend>Faturamento e Performance</legend><label class="field">Valores ${period === 365 ? "mensais" : "diários"} do gráfico (opcional)<textarea name="series" placeholder="0,00; 150,00; 220,00">${esc(m.series.join("; "))}</textarea><small>Separe por ponto e vírgula ou por linha. Informe ${period === 365 ? 12 : period} valores. O total acumulado será a soma da série. Deixe vazio para distribuir o total automaticamente.</small></label></fieldset>`,
    (data) => {
      const raw = String(data.get("series")).trim(),
        pieces = raw
          ? raw
              .split(/[;\n]/)
              .map((x) => x.trim())
              .filter(Boolean)
          : [];
      if (pieces.length && pieces.length !== (period === 365 ? 12 : period)) {
        toast(
          `Informe exatamente ${period === 365 ? 12 : period} valores ou deixe a série vazia.`,
        );
        return false;
      }
      if (
        pieces.some(
          (x) =>
            !Number.isFinite(Number(x.replace(",", "."))) ||
            Number(x.replace(",", ".")) < 0,
        )
      ) {
        toast("A série deve conter apenas números positivos ou zero.");
        return false;
      }
      for (const k of [
        "revenue",
        "orders",
        "ticket",
        "shipped",
        "today",
        "total",
      ])
        m[k] = numeric(data.get(k));
      for (const [k] of statuses)
        m.status[k] = numeric(data.get(`status_${k}`));
      m.series = pieces.map(numeric);
      if (m.series.length)
        m.total = Math.round(m.series.reduce((a, b) => a + b, 0) * 100) / 100;
      persist();
      toast("Painel atualizado e salvo.");
      return true;
    },
  );
  $("#calculate-ticket").onclick = () => {
    const f = $("#dialog-form");
    f.elements.ticket.value = (
      numeric(f.elements.revenue.value) /
      Math.max(1, numeric(f.elements.orders.value))
    ).toFixed(2);
  };
}
function heading(title, description, button = "", action = "") {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${button ? `<button class="yellow-button" data-action="${action}">${icon("plus")}${button}</button>` : ""}</div>`;
}
function empty(iconName, title, description) {
  return `<div class="empty-state large">${icon(iconName)}<h3>${title}</h3><p>${description}</p></div>`;
}
function feature(i, title, description, button, action) {
  return `<article class="panel feature-card">${icon(i)}<h2>${title}</h2><p>${description}</p><button class="secondary-button" data-action="${action}">${button}</button></article>`;
}
function navigate(next) {
  view = next;
  filter = "";
  $("#global-search").value = "";
  $("#search-results").hidden = true;
  $("#sidebar").classList.remove("open");
  $("#sidebar-backdrop").classList.remove("visible");
  $("#dashboard-view").hidden = next !== "dashboard";
  $("#module-view").hidden = next === "dashboard";
  renderNav();
  if (next === "tools") $(".tool-submenu").hidden = false;
  renderModule();
  window.scrollTo(0, 0);
}
function renderModule() {
  if (view === "dashboard") return;
  const box = $("#module-view"),
    filtered = (arr) =>
      arr.filter((r) =>
        Object.values(r).join(" ").toLowerCase().includes(filter.toLowerCase()),
      );
  let html = "";
  if (view === "catalog") {
    const list = filtered(state.products);
    html =
      heading(
        "Catálogo",
        "Organize produtos, preços e estoque da sua loja.",
        "Novo produto",
        "new-product",
      ) +
      `<div class="module-toolbar"><input class="module-search" placeholder="Buscar nome ou SKU…" value="${esc(filter)}" aria-label="Filtrar produtos"><button class="secondary-button" data-action="export-products">${icon("download")}Exportar CSV</button></div><div class="panel table-wrap">${
        list.length
          ? table(
              ["Produto / SKU", "Preço", "Estoque", "Ações"],
              list.map(
                (p) =>
                  `<tr><td><strong>${esc(p.name)}</strong><small>${esc(p.sku || "Sem SKU")}</small></td><td>${money(p.price)}</td><td>${integer(p.stock)}</td><td>${actionButtons("products", p)}</td></tr>`,
              ),
            )
          : empty(
              "box",
              "Nenhum produto encontrado",
              "Cadastre um produto ou importe seu catálogo em CSV.",
            )
      }</div>`;
  } else if (view === "orders") {
    const list = filtered(state.orders);
    html =
      heading(
        "Pedidos",
        "Acompanhe e organize os pedidos cadastrados neste painel.",
        "Novo pedido",
        "new-order",
      ) +
      `<div class="module-toolbar"><input class="module-search" placeholder="Buscar cliente ou pedido…" value="${esc(filter)}" aria-label="Filtrar pedidos"><button class="secondary-button" data-action="export-orders">${icon("download")}Exportar CSV</button></div><div class="panel table-wrap">${list.length ? orderRows(list, true) : empty("cart", "Nenhum pedido encontrado", "Adicione seu primeiro pedido para acompanhar a operação.")}</div><p class="muted" style="margin-top:16px;line-height:1.7">Os cadastros não substituem os indicadores manuais do dashboard. Use o editor do painel para ajustar o resumo.</p>`;
  } else if (view === "suppliers") {
    const list = filtered(state.suppliers);
    html =
      heading(
        "Fornecedores",
        "Mantenha os contatos dos seus parceiros em um só lugar.",
        "Novo fornecedor",
        "new-supplier",
      ) +
      `<div class="panel table-wrap">${
        list.length
          ? table(
              ["Fornecedor", "E-mail", "Telefone", "Ações"],
              list.map(
                (s) =>
                  `<tr><td>${esc(s.name)}</td><td>${esc(s.email || "—")}</td><td>${esc(s.phone || "—")}</td><td>${actionButtons("suppliers", s)}</td></tr>`,
              ),
            )
          : empty(
              "factory",
              "Sua rede começa aqui",
              "Cadastre fornecedores e mantenha os dados de contato organizados.",
            )
      }</div>`;
  } else if (view === "import")
    html =
      heading(
        "Importadores",
        "Traga seu catálogo para o painel com uma planilha CSV.",
      ) +
      `<div class="module-cards">${feature("upload", "Importar produtos", "Envie um CSV com as colunas nome, sku, preco e estoque. Os produtos são adicionados ao catálogo local.", "Selecionar arquivo CSV", "import-csv")}${feature("download", "Modelo de planilha", "Baixe um exemplo com o formato das colunas, pronto para preencher no Excel ou Google Sheets.", "Baixar modelo", "csv-template")}${feature("layers", "Consultar catálogo", "Confira os produtos importados, ajuste seus preços e organize o estoque.", "Abrir catálogo", "open-catalog")}</div>`;
  else if (view === "integrations")
    html =
      heading(
        "Integrações",
        "Guarde os endereços das lojas e canais que você usa.",
        "Adicionar canal",
        "new-integration",
      ) +
      '<div class="notice">Este painel funciona localmente. Os canais abaixo são atalhos salvos; não sincronizam vendas, estoque ou contas externas.</div><div class="module-cards">' +
      state.integrations
        .map(
          (s) =>
            `<article class="panel feature-card">${icon("globe")}<h2>${esc(s.name)}</h2><p>${esc(s.url)}</p><p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" class="secondary-button">Abrir canal ↗</a></p>${actionButtons("integrations", s)}</article>`,
        )
        .join("") +
      (state.integrations.length
        ? ""
        : feature(
            "globe",
            "Seus canais de venda",
            "Salve links para acessar suas lojas e marketplaces com rapidez.",
            "Adicionar canal",
            "new-integration",
          )) +
      "</div>";
  else if (view === "finance") {
    const entries = state.transactions.reduce(
        (s, t) => s + (t.type === "in" ? t.amount : 0),
        0,
      ),
      exits = state.transactions.reduce(
        (s, t) => s + (t.type === "out" ? t.amount : 0),
        0,
      );
    html =
      heading(
        "Financeiro & PIX",
        "Registre entradas e saídas e organize sua chave PIX.",
        "Novo lançamento",
        "new-transaction",
      ) +
      `<div class="summary-cards"><article class="panel summary-card"><p>Entradas registradas</p><strong>${money(entries)}</strong></article><article class="panel summary-card"><p>Saídas registradas</p><strong>${money(exits)}</strong></article><article class="panel summary-card"><p>Saldo dos lançamentos</p><strong>${money(entries - exits)}</strong></article></div><div class="module-toolbar"><button class="secondary-button" data-action="pix">${icon("wallet")}Minha chave PIX</button><button class="secondary-button" data-action="export-finance">${icon("download")}Exportar lançamentos</button></div><div class="panel table-wrap">${
        state.transactions.length
          ? table(
              ["Descrição", "Data", "Tipo", "Valor", "Ações"],
              state.transactions.map(
                (t) =>
                  `<tr><td>${esc(t.description)}</td><td>${esc(dateLabel(t.date))}</td><td><span class="badge">${t.type === "in" ? "Entrada" : "Saída"}</span></td><td>${money(t.amount)}</td><td>${actionButtons("transactions", t)}</td></tr>`,
              ),
            )
          : empty(
              "wallet",
              "Nenhum lançamento",
              "Registre movimentações para acompanhar o saldo local.",
            )
      }</div>`;
  } else if (view === "tools")
    html =
      heading(
        "Ferramentas",
        "Recursos para facilitar sua rotina e manter seus dados à mão.",
      ) +
      `<div class="module-cards">${feature("calculator", "Calculadora de margem", "Calcule lucro, margem e preço sugerido considerando custos, frete e taxas.", "Abrir calculadora", "calculator")}${feature("download", "Relatório do período", "Exporte os indicadores e os status da operação do período selecionado em CSV.", "Exportar relatório", "export")}${feature("layers", "Backup e restauração", "Baixe uma cópia dos dados deste navegador ou restaure um backup anterior.", "Gerenciar backup", "backup")}</div>`;
  else if (view === "tutorials")
    html =
      heading("Tutoriais", "Um começo simples para organizar sua operação.") +
      `<div class="module-cards">${feature("box", "01 · Cadastre seu catálogo", "Adicione nome, SKU, preço e estoque. Você também pode importar uma planilha CSV.", "Cadastrar produto", "new-product")}${feature("cart", "02 · Organize os pedidos", "Cadastre cliente, produto e valor. Atualize o status até a entrega.", "Criar pedido", "new-order")}${feature("download", "03 · Proteja seus dados", "Os dados ficam neste navegador. Exporte backups para guardar uma cópia e transferir para outro dispositivo.", "Fazer backup", "download-backup")}</div>`;
  else if (view === "tickets")
    html =
      heading(
        "Chamados",
        "Organize pendências e anotações de atendimento.",
        "Novo chamado",
        "new-ticket",
      ) +
      '<div class="notice">Os chamados são registros pessoais neste navegador. Não são enviados a uma equipe externa.</div><div class="panel table-wrap">' +
      (state.tickets.length
        ? table(
            ["Assunto", "Descrição", "Status", "Ações"],
            state.tickets.map(
              (t) =>
                `<tr><td>${esc(t.subject)}</td><td>${esc(t.description.slice(0, 70))}</td><td><span class="badge">${t.status === "closed" ? "Resolvido" : "Aberto"}</span></td><td>${actionButtons("tickets", t)}</td></tr>`,
            ),
          )
        : empty(
            "headphones",
            "Tudo em dia por aqui",
            "Registre uma dúvida ou pendência para acompanhar depois.",
          )) +
      "</div>";
  box.innerHTML = html;
  hydrate(box);
  const search = $(".module-search", box);
  if (search)
    search.addEventListener("input", (e) => {
      const start = e.target.selectionStart;
      filter = e.target.value;
      renderModule();
      const input = $(".module-search");
      input.focus();
      input.setSelectionRange(start, start);
    });
}
function editRecord(type, recordId) {
  const existing = state[type].find((x) => x.id === recordId),
    r = existing || {},
    labels = {
      products: "produto",
      orders: "pedido",
      suppliers: "fornecedor",
      transactions: "lançamento",
      integrations: "canal",
      tickets: "chamado",
    };
  let html = '<div class="form-grid">';
  if (type === "products")
    html +=
      field(
        "Nome do produto",
        "name",
        r.name,
        "text",
        'required maxlength="120"',
      ) +
      field("SKU", "sku", r.sku, "text", 'maxlength="80"') +
      numField("Preço (R$)", "price", r.price, true) +
      numField("Estoque", "stock", r.stock);
  if (type === "orders")
    html +=
      field(
        "Cliente",
        "customer",
        r.customer,
        "text",
        'required maxlength="120"',
      ) +
      field("Data do pedido", "date", r.date || day(), "date", "required") +
      selectField(
        "Produto",
        "productId",
        [
          ["", "Sem produto vinculado"],
          ...state.products.map((p) => [p.id, p.name]),
        ],
        r.productId || "",
      ) +
      numField("Quantidade", "quantity", r.quantity || 1) +
      numField("Valor total (R$)", "amount", r.amount, true) +
      selectField(
        "Status",
        "status",
        statuses.map(([k, v]) => [k, v]),
        r.status || "payment",
      );
  if (type === "suppliers")
    html +=
      field(
        "Nome do fornecedor",
        "name",
        r.name,
        "text",
        'required maxlength="120"',
      ) +
      field("E-mail", "email", r.email, "email", 'maxlength="160"') +
      field("Telefone", "phone", r.phone, "tel", 'maxlength="40"') +
      field("Observações", "notes", r.notes, "text", 'maxlength="500"');
  if (type === "transactions")
    html +=
      field(
        "Descrição",
        "description",
        r.description,
        "text",
        'required maxlength="120"',
      ) +
      numField("Valor (R$)", "amount", r.amount, true) +
      selectField(
        "Tipo",
        "type",
        [
          ["in", "Entrada"],
          ["out", "Saída"],
        ],
        r.type || "in",
      ) +
      field("Data", "date", r.date || day(), "date", "required");
  if (type === "integrations")
    html +=
      field(
        "Nome do canal",
        "name",
        r.name,
        "text",
        'required maxlength="120"',
      ) +
      field(
        "Endereço da loja (https://)",
        "url",
        r.url,
        "url",
        'required maxlength="500"',
      );
  if (type === "tickets")
    html +=
      field(
        "Assunto",
        "subject",
        r.subject,
        "text",
        'required maxlength="120"',
      ) +
      selectField(
        "Status",
        "status",
        [
          ["open", "Aberto"],
          ["closed", "Resolvido"],
        ],
        r.status || "open",
      ) +
      `<label class="field full-width">Descrição<textarea name="description" required maxlength="5000">${esc(r.description || "")}</textarea></label>`;
  html += "</div>";
  showDialog(
    `${existing ? "Editar" : "Novo"} ${labels[type]}`,
    html,
    (data) => {
      const item = { id: r.id || id() };
      for (const [k, v] of data.entries())
        item[k] = ["price", "stock", "quantity", "amount"].includes(k)
          ? numeric(v)
          : String(v).trim();
      if (
        ["name", "customer", "description", "subject"].some(
          (k) => data.has(k) && !item[k],
        )
      ) {
        toast("Preencha os campos obrigatórios.");
        return false;
      }
      if (type === "integrations") {
        let url;
        try {
          url = new URL(item.url);
        } catch {
          toast("Informe uma URL válida.");
          return false;
        }
        if (!["https:", "http:"].includes(url.protocol)) {
          toast("Use um endereço HTTP ou HTTPS.");
          return false;
        }
        item.url = url.href;
      }
      if (
        type === "products" &&
        item.sku &&
        state.products.some(
          (p) =>
            p.id !== item.id && p.sku.toLowerCase() === item.sku.toLowerCase(),
        )
      ) {
        toast("Esse SKU já existe no catálogo.");
        return false;
      }
      if (existing)
        state[type] = state[type].map((x) => (x.id === r.id ? item : x));
      else state[type].unshift(item);
      persist();
      renderModule();
      toast("Registro salvo.");
      return true;
    },
  );
  if (type === "orders")
    $("#dialog-form").elements.productId.onchange = (e) => {
      const p = state.products.find((x) => x.id === e.target.value);
      if (p)
        $("#dialog-form").elements.amount.value = (
          p.price * numeric($("#dialog-form").elements.quantity.value)
        ).toFixed(2);
    };
}
function deleteRecord(type, recordId) {
  const r = state[type].find((x) => x.id === recordId);
  if (!r) return;
  showDialog(
    "Excluir registro?",
    `<p class="dialog-description">Você vai excluir <strong>${esc(r.name || r.customer || r.subject || r.description || "este registro")}</strong>. Essa ação não pode ser desfeita.</p>`,
    () => {
      state[type] = state[type].filter((x) => x.id !== recordId);
      persist();
      renderModule();
      toast("Registro excluído.");
      return true;
    },
    "Excluir registro",
  );
}
function download(name, content, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function csv(name, rows) {
  const cell = (v) => {
    let s = String(v ?? "");
    if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  download(
    name,
    "\uFEFF" + rows.map((row) => row.map(cell).join(";")).join("\r\n"),
    "text/csv;charset=utf-8",
  );
  toast("Arquivo exportado.");
}
function report() {
  const m = metrics();
  csv(`relatorio-${periodName()}-${day()}.csv`, [
    ["Indicador", "Valor", "Período"],
    ["Faturamento Total", m.revenue, periodName()],
    ["Pedidos no Período", m.orders, periodName()],
    ["Ticket Médio", m.ticket, periodName()],
    ["Itens Despachados", m.shipped, periodName()],
    ["Pedidos hoje", m.today, periodName()],
    ["Total acumulado", m.total, periodName()],
    ...statuses.map(([k, v]) => [v, m.status[k], periodName()]),
  ]);
}
function calculator() {
  showDialog(
    "Calculadora de margem",
    `<p class="dialog-description">Descubra o lucro por venda e o preço sugerido para sua margem desejada.</p><div class="form-grid">${numField("Custo do produto (R$)", "cost", 0, true)}${numField("Frete e outros custos (R$)", "shipping", 0, true)}${numField("Preço de venda (R$)", "price", 0, true)}${field("Taxa sobre a venda (%)", "fee", 0, "number", 'min="0" max="99" step=".01"')}${field("Margem desejada (%)", "margin", 20, "number", 'min="0" max="99" step=".01"')}</div><div id="calculator-output" class="calculator-result"></div>`,
    null,
  );
  const calculate = () => {
    const f = $("#dialog-form").elements,
      cost = numeric(f.cost.value) + numeric(f.shipping.value),
      price = numeric(f.price.value),
      fee = numeric(f.fee.value) / 100,
      margin = numeric(f.margin.value) / 100,
      profit = price * (1 - fee) - cost;
    $("#calculator-output").innerHTML =
      `<div><span>Lucro por venda</span><strong>${money(profit)}</strong><p>${price ? ((profit / price) * 100).toFixed(1) : "0"}% de margem</p></div><div><span>Preço sugerido</span><strong>${fee + margin < 1 ? money(cost / (1 - fee - margin)) : "—"}</strong><p>${fee + margin < 1 ? "Para a margem desejada" : "Taxa + margem devem ser menores que 100%"}</p></div>`;
  };
  $("#dialog-body").oninput = calculate;
  calculate();
}
function parseCSV(text) {
  const rows = [];
  let row = [],
    value = "",
    quoted = false;
  const first = text.replace(/^\uFEFF/, "").split(/\r?\n/)[0],
    sep = first.includes(";") ? ";" : ",";
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === sep && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quoted) throw Error("Há aspas não fechadas no CSV.");
  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}
function chooseFile(accept, handler) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Escolha um arquivo de até 5 MB.");
      return;
    }
    try {
      await handler(await file.text());
    } catch (e) {
      toast(e.message || "Não foi possível ler o arquivo.");
    }
  };
  input.click();
}
function importCSV() {
  chooseFile(".csv", (text) => {
    const rows = parseCSV(text),
      headers = rows.shift()?.map((s) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      );
    if (
      !headers ||
      !["nome", "sku", "preco", "estoque"].every((s) => headers.includes(s))
    )
      throw Error("Use as colunas nome, sku, preco e estoque.");
    if (!rows.length) throw Error("A planilha não contém produtos.");
    if (rows.length > 10000)
      throw Error("Importe até 10.000 produtos por vez.");
    const seen = new Set(
      state.products.filter((p) => p.sku).map((p) => p.sku.toLowerCase()),
    );
    let skipped = 0;
    const items = [];
    for (const [i, row] of rows.entries()) {
      const read = (k) => row[headers.indexOf(k)] || "",
        name = read("nome"),
        sku = read("sku"),
        price = read("preco"),
        stock = read("estoque");
      if (
        !name ||
        !Number.isFinite(Number(price.replace(",", "."))) ||
        Number(price.replace(",", ".")) < 0 ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
      )
        throw Error(
          `Dados inválidos na linha ${i + 2}. Confira nome, preço e estoque.`,
        );
      if (sku && seen.has(sku.toLowerCase())) {
        skipped++;
        continue;
      }
      if (sku) seen.add(sku.toLowerCase());
      items.push({
        id: id(),
        name: name.slice(0, 120),
        sku: sku.slice(0, 80),
        price: numeric(price),
        stock: numeric(stock),
      });
    }
    showDialog(
      "Confirmar importação",
      `<p class="dialog-description">${items.length} produtos serão adicionados ao catálogo. ${skipped} SKUs repetidos foram ignorados. Os produtos existentes serão preservados.</p>`,
      () => {
        state.products.push(...items);
        persist();
        navigate("catalog");
        toast(`${items.length} produtos importados.`);
        return true;
      },
      "Importar produtos",
    );
  });
}
function backup() {
  showDialog(
    "Backup e restauração",
    '<p class="dialog-description">Guarde uma cópia de todos os indicadores, pedidos, produtos e configurações. O backup permite transferir seus dados para outro navegador.</p><div class="module-toolbar"><button type="button" class="secondary-button" data-action="download-backup">' +
      icon("download") +
      'Baixar backup JSON</button><button type="button" class="secondary-button" data-action="restore">' +
      icon("upload") +
      'Restaurar backup</button></div><p class="muted">Restaurar substitui os dados atuais. Faça um backup antes de continuar.</p>',
    null,
  );
}
function restore() {
  chooseFile(".json", (text) => {
    let incoming;
    try {
      incoming = normalize(JSON.parse(text));
    } catch {
      throw Error("Backup inválido. Use um JSON exportado por este painel.");
    }
    showDialog(
      "Restaurar backup?",
      `<p class="dialog-description">O backup de <strong>${esc(incoming.name)}</strong> tem ${incoming.products.length} produtos e ${incoming.orders.length} pedidos. Ele substituirá todos os dados deste navegador.</p>`,
      () => {
        state = incoming;
        persist();
        navigate("dashboard");
        toast("Backup restaurado.");
        return true;
      },
      "Substituir e restaurar",
    );
  });
}
function profile() {
  showDialog(
    "Seu perfil",
    `<div class="form-grid">${field("Nome de exibição", "name", state.name, "text", 'required maxlength="60"')}</div><p class="dialog-description" style="margin-top:20px">Este é um perfil local. Nenhuma conta externa ou senha é necessária.</p>`,
    (data) => {
      state.name = String(data.get("name")).trim() || "Tavares";
      persist();
      toast("Perfil atualizado.");
      return true;
    },
  );
}
const actions = {
  "new-product": () => editRecord("products"),
  "new-order": () => editRecord("orders"),
  "new-supplier": () => editRecord("suppliers"),
  "new-transaction": () => editRecord("transactions"),
  "new-integration": () => editRecord("integrations"),
  "new-ticket": () => editRecord("tickets"),
  calculator,
  export: report,
  backup,
  restore,
  "import-csv": importCSV,
  "open-catalog": () => navigate("catalog"),
  "csv-template": () =>
    csv("modelo-produtos.csv", [
      ["nome", "sku", "preco", "estoque"],
      ["Camiseta básica", "CAM-001", "59,90", 20],
    ]),
  "export-products": () =>
    csv("produtos.csv", [
      ["nome", "sku", "preco", "estoque"],
      ...state.products.map((p) => [
        p.name,
        p.sku,
        String(p.price).replace(".", ","),
        p.stock,
      ]),
    ]),
  "export-orders": () =>
    csv("pedidos.csv", [
      ["pedido", "cliente", "data", "quantidade", "valor", "status"],
      ...state.orders.map((o) => [
        o.id,
        o.customer,
        o.date,
        o.quantity,
        o.amount,
        statusName(o.status),
      ]),
    ]),
  "export-finance": () =>
    csv("financeiro.csv", [
      ["descricao", "data", "tipo", "valor"],
      ...state.transactions.map((t) => [
        t.description,
        t.date,
        t.type === "in" ? "Entrada" : "Saída",
        t.amount,
      ]),
    ]),
  "download-backup": () => {
    download(
      `tavares-backup-${day()}.json`,
      JSON.stringify(state, null, 2),
      "application/json",
    );
    toast("Backup exportado.");
  },
  pix: () =>
    showDialog(
      "Minha chave PIX",
      `<p class="dialog-description">Guarde sua chave para copiar quando precisar. Este painel não gera cobranças nem processa pagamentos.</p><div class="form-grid">${field("Chave PIX", "pix", state.pix, "text", 'maxlength="200"')}<button class="secondary-button" type="button" data-action="copy-pix">Copiar chave salva</button></div>`,
      (data) => {
        state.pix = String(data.get("pix")).trim();
        persist();
        toast("Chave salva.");
        return true;
      },
    ),
  "copy-pix": async () => {
    if (!state.pix) {
      toast("Salve uma chave PIX primeiro.");
      return;
    }
    try {
      await navigator.clipboard.writeText(state.pix);
      toast("Chave PIX copiada.");
    } catch {
      toast(
        "Não foi possível copiar automaticamente. Selecione a chave no campo.",
      );
    }
  },
  exit: () =>
    showDialog(
      "Encerrar sessão local",
      '<p class="dialog-description">Não há uma conta conectada. Você pode voltar ao dashboard com os dados preservados ou fechar esta aba. Para guardar uma cópia, exporte um backup em Ferramentas.</p>',
      () => {
        navigate("dashboard");
        return true;
      },
      "Voltar ao dashboard",
    ),
};
document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-navigate]");
  if (nav) {
    navigate(nav.dataset.navigate);
    return;
  }
  const action = e.target.closest("[data-action]");
  if (action) {
    actions[action.dataset.action]?.();
    return;
  }
  const edit = e.target.closest("[data-edit]");
  if (edit) {
    editRecord(edit.dataset.edit, edit.dataset.id);
    return;
  }
  const del = e.target.closest("[data-delete]");
  if (del) deleteRecord(del.dataset.delete, del.dataset.id);
});
$("#dialog-form").onsubmit = (e) => {
  e.preventDefault();
  if (dialogHandler && dialogHandler(new FormData(e.target)) !== false)
    closeDialog();
};
$("#dialog-close").onclick = closeDialog;
$("#dialog-cancel").onclick = closeDialog;
$("#dialog").addEventListener("close", () => {
  $("#dialog-body").oninput = null;
});
$("#dialog").addEventListener("click", (e) => {
  if (e.target === $("#dialog")) {
    const r = e.target.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeDialog();
  }
});
$("#edit-dashboard").onclick = openEditor;
$("#theme-button").onclick = () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  persist();
};
$("#refresh-button").onclick = () => {
  renderDashboard();
  toast("Painel atualizado com os dados salvos neste navegador.");
};
$$("[data-period]").forEach(
  (el) =>
    (el.onclick = () => {
      period = Number(el.dataset.period);
      renderDashboard();
    }),
);
$("#collapse-sidebar").onclick = () => {
  if (innerWidth < 720) {
    $("#sidebar").classList.remove("open");
    $("#sidebar-backdrop").classList.remove("visible");
  } else document.body.classList.toggle("collapsed");
};
$("#mobile-menu").onclick = () => {
  $("#sidebar").classList.add("open");
  $("#sidebar-backdrop").classList.add("visible");
};
$("#sidebar-backdrop").onclick = () => {
  $("#sidebar").classList.remove("open");
  $("#sidebar-backdrop").classList.remove("visible");
};
$("#account-button").onclick = profile;
$("#profile-button").onclick = profile;
$("#notifications-button").onclick = () => {
  const pending = state.orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  ).length;
  showDialog(
    "Notificações",
    `<div class="empty-state">${icon("bell")}<h3>${pending ? `${pending} pedidos em andamento` : "Tudo em dia por aqui"}</h3><p>${pending ? "Veja seus pedidos para acompanhar as próximas etapas." : "Você não tem pedidos pendentes cadastrados."}</p><button type="button" class="secondary-button" id="notification-orders" style="margin-top:20px">Ver pedidos</button></div>`,
    null,
  );
  $("#notification-orders").onclick = () => {
    closeDialog();
    navigate("orders");
  };
};
$("#recharge-button").onclick = () =>
  showDialog(
    "Saldo de controle",
    `<p class="dialog-description">Esse saldo é apenas um registro local para seu planejamento. Não há cobrança, transferência ou recarga real.</p><div class="form-grid">${numField("Saldo (R$)", "wallet", state.wallet, true)}</div>`,
    (data) => {
      state.wallet = numeric(data.get("wallet"));
      persist();
      toast("Saldo de controle atualizado.");
      return true;
    },
  );
$("#support-button").onclick = () =>
  showDialog(
    "Guia & Suporte",
    '<p class="dialog-description">Seu painel, do seu jeito.</p><ol class="help-list"><li>Cadastre seus produtos em <strong>Catálogo</strong>.</li><li>Adicione e acompanhe registros em <strong>Pedidos</strong>.</li><li>Use <strong>Importadores</strong> para trazer seu catálogo em CSV.</li><li>Em <strong>Ferramentas</strong>, calcule margens e exporte relatórios e backups.</li><li>Os dados ficam somente neste navegador. Guarde backups para não perdê-los.</li></ol><p class="dialog-description">Este projeto é independente e não está conectado à Suprify ou a serviços de venda, logística ou pagamento.</p>',
    null,
  );
$("#global-search").addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase(),
    results = $("#search-results");
  if (!query) {
    results.hidden = true;
    return;
  }
  const hits = [
    ...state.products
      .filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(query))
      .slice(0, 5)
      .map((p) => ({
        type: "products",
        item: p,
        label: p.name,
        caption: "Produto · " + money(p.price),
      })),
    ...state.orders
      .filter((o) => `${o.customer} ${o.id}`.toLowerCase().includes(query))
      .slice(0, 5)
      .map((o) => ({
        type: "orders",
        item: o,
        label: o.customer,
        caption: "Pedido · " + money(o.amount),
      })),
  ];
  results.innerHTML = hits.length
    ? hits
        .map(
          (h) =>
            `<button data-search-type="${h.type}" data-id="${esc(h.item.id)}"><span>${esc(h.label)}</span><small>${esc(h.caption)}</small></button>`,
        )
        .join("")
    : '<div class="empty-state">Nenhum produto ou pedido encontrado</div>';
  results.hidden = false;
});
$("#search-results").addEventListener("click", (e) => {
  const b = e.target.closest("[data-search-type]");
  if (b) {
    $("#search-results").hidden = true;
    editRecord(b.dataset.searchType, b.dataset.id);
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) $("#search-results").hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) &&
    !$("#dialog").open
  ) {
    e.preventDefault();
    $("#global-search").focus();
  }
  if (e.key === "Escape") {
    $("#search-results").hidden = true;
    $("#sidebar").classList.remove("open");
    $("#sidebar-backdrop").classList.remove("visible");
  }
});
$("#chart-wrap").addEventListener("pointermove", (e) => {
  const rect = e.currentTarget.getBoundingClientRect(),
    ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left - 46) / (rect.width - 58)),
    ),
    i = Math.round(ratio * (chartData().length - 1)),
    tooltip = $("#chart-tooltip");
  tooltip.innerHTML = `${chartDates()[i]}<br><strong>${money(chartData()[i])}</strong>`;
  tooltip.hidden = false;
  tooltip.style.left =
    Math.max(0, Math.min(rect.width - 140, e.clientX - rect.left + 8)) + "px";
  const line = $("#chart-hover-line"),
    x = 46 + (i / (chartData().length - 1)) * (rect.width - 58);
  line.setAttribute("x1", x);
  line.setAttribute("x2", x);
  line.setAttribute("visibility", "visible");
});
$("#chart-wrap").addEventListener("pointerleave", () => {
  $("#chart-tooltip").hidden = true;
  $("#chart-hover-line")?.setAttribute("visibility", "hidden");
});
window.addEventListener("resize", renderChart);
window.addEventListener("storage", (e) => {
  if (e.key === KEY && !$("#dialog").open) {
    state = load();
    renderDashboard();
    renderModule();
  }
});
hydrate();
renderNav();
renderDashboard();
if (!storageOK) {
  $("#save-status").textContent =
    "Armazenamento indisponível. Exporte um backup.";
  toast(
    "Não foi possível carregar o armazenamento local. Use backups para preservar seus dados.",
  );
}
