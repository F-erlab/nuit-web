/* =========================================================
   nuit. — Tienda de relojes · Lógica de la tienda
   ========================================================= */

// ---------- Configuración ----------
const CONFIG = {
  moneda: "Gs.",
  envioGratisDesde: 500000,
  costoEnvio: 20000,
  costoExpress: 30000,
  cuotas: 12,
  descuentoTransferencia: 0.05,
  whatsapp: "595993491203", // ej: "59170000000" (código de país + número, sin +)
};

const CUPONES = {
  NUIT10: { tipo: "porcentaje", valor: 0.10, texto: "10% de descuento aplicado" },
  BIENVENIDA: { tipo: "porcentaje", valor: 0.15, texto: "15% de bienvenida aplicado" },
  ENVIOGRATIS: { tipo: "envio", valor: 0, texto: "Envío gratis aplicado" },
};

// ---------- Catálogo ----------
const PRODUCTOS = [
  {
    id: "vintage-plata", nombre: "Casio Vintage A168WA Plateado", cats: ["digital", "vintage"],
    precio: 320000, antes: null, stock: 14, img: "img/a168-plata.png", tag: "Destacado",
    desc: "El digital retro por excelencia. Caja y malla de acero, luz electroluminiscente, alarma diaria y cronómetro. Liviano, cómodo y con estilo atemporal.",
    specs: { Movimiento: "Digital cuarzo", Caja: "36 mm · resina", Malla: "Acero inoxidable", Agua: "Water resist" },
  },
  {
    id: "clasico-azul", nombre: "Casio Clásico Azul Day-Date", cats: ["analogico"],
    precio: 520000, antes: 590000, stock: 6, img: "img/mtp1381-azul.png", tag: null,
    desc: "Esfera azul con textura radial, calendario de día y fecha. Elegante para la oficina y lo suficientemente robusto para el fin de semana.",
    specs: { Movimiento: "Analógico cuarzo", Caja: "42 mm · acero", Malla: "Acero inoxidable", Agua: "50 m" },
  },
  {
    id: "vintage-rosa", nombre: "Casio Vintage B650 Oro Rosa", cats: ["digital", "vintage"],
    precio: 450000, antes: null, stock: 3, img: "img/b650-rosa.png", tag: "Nuevo",
    desc: "Caja amplia de estética retro en tono oro rosa. Pantalla grande, alarma, cronógrafo y luz LED. Un statement en la muñeca.",
    specs: { Movimiento: "Digital cuarzo", Caja: "41 mm · resina", Malla: "Acero IP oro rosa", Agua: "50 m" },
  },
  {
    id: "clasico-dorado", nombre: "Casio Clásico Dorado", cats: ["analogico"],
    precio: 390000, antes: null, stock: 11, img: "img/mtp1170-dorado.png", tag: null,
    desc: "Minimalismo dorado con fechador a las 3. Índices de barra y acabado satinado que combina con todo, de jeans a traje.",
    specs: { Movimiento: "Analógico cuarzo", Caja: "38 mm · acero IP", Malla: "Acero IP dorado", Agua: "Water resist" },
  },
  {
    id: "gshock-camo", nombre: "G-Shock Camo Negro & Oro", cats: ["deportivo", "digital"],
    precio: 725000, antes: 850000, stock: 8, img: "img/gshock-negro.png", tag: "Oferta",
    desc: "Resistencia a golpes, 200 m de resistencia al agua, luz LED, triple gráfico y esfera con camuflaje. Construido para todo terreno.",
    specs: { Movimiento: "Digital cuarzo", Caja: "50 mm · resina", Malla: "Resina", Agua: "200 m" },
  },
  {
    id: "cuero-azul", nombre: "Casio Field Cuero Marrón", cats: ["analogico", "vintage"],
    precio: 450000, antes: 495000, stock: 19, img: "img/cuero-azul.png", tag: null,
    desc: "Esfera azul noche con números arábigos y malla de cuero marrón con costura contrastante. El reloj de campo para el día a día.",
    specs: { Movimiento: "Analógico cuarzo", Caja: "40 mm · acero", Malla: "Cuero genuino", Agua: "50 m" },
  },
];

const CAT_NOMBRE = { digital: "Digital", analogico: "Analógico", deportivo: "Deportivo", vintage: "Vintage" };

// ---------- Estado ----------
const LS = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};
// Lo guardado en el navegador puede estar alterado: se valida antes de usarlo.
const existe = id => PRODUCTOS.some(p => p.id === id);
function cargarCarrito() {
  const raw = LS.get("nuit_cart", []);
  if (!Array.isArray(raw)) return [];
  const vistos = new Set();
  return raw.flatMap(l => {
    if (!l || typeof l.id !== "string" || !existe(l.id) || vistos.has(l.id)) return [];
    vistos.add(l.id);
    const stock = PRODUCTOS.find(p => p.id === l.id).stock;
    const qty = Math.min(stock, Math.max(1, Math.floor(Number(l.qty)) || 1));
    return [{ id: l.id, qty }];
  });
}
function cargarFavoritos() {
  const raw = LS.get("nuit_favs", []);
  return Array.isArray(raw) ? [...new Set(raw.filter(id => typeof id === "string" && existe(id)))] : [];
}
function cargarCupon() {
  const raw = LS.get("nuit_coupon", null);
  return typeof raw === "string" && Object.hasOwn(CUPONES, raw) ? raw : null;
}
// Versiones anteriores guardaban los datos personales de cada pedido en el navegador: se borran.
try { localStorage.removeItem("nuit_orders"); } catch {}

const state = {
  carrito: cargarCarrito(),     // [{id, qty}]
  favoritos: cargarFavoritos(), // [id]
  cupon: cargarCupon(),
  filtro: "todos",
  busqueda: "",
  orden: "relevancia",
  maxPrecio: 900000,
};
const save = () => { LS.set("nuit_cart", state.carrito); LS.set("nuit_favs", state.favoritos); LS.set("nuit_coupon", state.cupon); };

// ---------- Utilidades ----------
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = n => CONFIG.moneda + " " + Math.round(n).toLocaleString("es-PY", { maximumFractionDigits: 0 }).replace(/,/g, ".");
const byId = id => PRODUCTOS.find(p => p.id === id);
const off = p => p.antes ? Math.round((1 - p.precio / p.antes) * 100) : 0;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg, icon = "✓") {
  const t = document.createElement("div");
  t.className = "toast";
  const ico = document.createElement("span");
  ico.textContent = icon;
  t.append(ico, document.createTextNode(msg));
  const cont = $("#toasts");
  while (cont.children.length >= 2) cont.firstElementChild.remove();
  cont.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 2400);
}

// ---------- Catálogo / grilla ----------
function filtrar() {
  let lista = PRODUCTOS.filter(p => {
    if (state.filtro === "oferta" && !p.antes) return false;
    if (state.filtro === "favoritos" && !state.favoritos.includes(p.id)) return false;
    if (!["todos", "oferta", "favoritos"].includes(state.filtro) && !p.cats.includes(state.filtro)) return false;
    if (p.precio > state.maxPrecio) return false;
    if (state.busqueda) {
      const q = state.busqueda.toLowerCase();
      const texto = (p.nombre + " " + p.desc + " " + p.cats.join(" ") + " " + Object.values(p.specs).join(" ")).toLowerCase();
      if (!q.split(/\s+/).every(w => texto.includes(w))) return false;
    }
    return true;
  });
  const ord = {
    "precio-asc": (a, b) => a.precio - b.precio,
    "precio-desc": (a, b) => b.precio - a.precio,
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
  }[state.orden];
  return ord ? [...lista].sort(ord) : lista;
}

function renderGrid() {
  const lista = filtrar();
  const grid = $("#grid");
  let etiqueta = state.filtro === "favoritos" ? " en tus favoritos" : "";
  if (state.busqueda) etiqueta += ` para “${esc(state.busqueda)}”`;
  $("#resultCount").innerHTML = `${lista.length} ${lista.length === 1 ? "reloj" : "relojes"}${etiqueta}`;

  if (!lista.length) {
    grid.innerHTML = `<div class="empty"><strong>No encontramos relojes</strong>Probá con otro filtro o búsqueda.<br><br><button class="btn btn-outline" id="resetFilters">Ver todos</button></div>`;
    $("#resetFilters").onclick = resetFiltros;
    return;
  }
  grid.innerHTML = lista.map((p, i) => {
    const fav = state.favoritos.includes(p.id);
    const tags = [
      p.antes ? `<span class="tag sale">-${off(p)}%</span>` : "",
      p.tag && p.tag !== "Oferta" ? `<span class="tag">${p.tag}</span>` : "",
      p.stock <= 5 ? `<span class="tag low">¡Últimas ${p.stock}!</span>` : "",
    ].join("");
    return `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card-media" data-quick="${p.id}">
        <img src="${p.img}" alt="${esc(p.nombre)}" loading="lazy" />
        <div class="tags">${tags}</div>
        <button class="fav ${fav ? "on" : ""}" data-fav="${p.id}" aria-label="${fav ? "Quitar de" : "Agregar a"} favoritos" aria-pressed="${fav}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        <button class="quick" data-quick="${p.id}">Vista rápida</button>
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cats.map(c => CAT_NOMBRE[c]).join(" · ")}</span>
        <h3 class="card-title" data-quick="${p.id}">${esc(p.nombre)}</h3>
        <div class="price-row"><span class="price">${money(p.precio)}</span>${p.antes ? `<span class="old">${money(p.antes)}</span>` : ""}</div>
        <span class="installments">${CONFIG.cuotas} cuotas sin interés de ${money(p.precio / CONFIG.cuotas)}</span>
        <button class="btn btn-primary" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </article>`;
  }).join("");
}

function setFiltro(f, scroll = false) {
  state.filtro = f;
  $$(".chip").forEach(c => c.classList.toggle("active", c.dataset.filter === f));
  renderGrid();
  if (scroll) $("#tienda").scrollIntoView({ behavior: "smooth" });
}
function resetFiltros() {
  state.busqueda = ""; $("#searchInput").value = "";
  state.maxPrecio = 900000; $("#maxPrice").value = 900000; $("#maxPriceLabel").textContent = money(900000);
  setFiltro("todos");
}

// ---------- Favoritos ----------
function toggleFav(id) {
  const i = state.favoritos.indexOf(id);
  if (i > -1) { state.favoritos.splice(i, 1); toast("Quitado de favoritos", "♡"); }
  else { state.favoritos.push(id); toast("Guardado en favoritos", "♥"); }
  save(); renderGrid(); updateBadges();
  if ($("#qvModal").classList.contains("open")) openQuick(id);
}

// ---------- Carrito ----------
const cantidadTotal = () => state.carrito.reduce((s, l) => s + l.qty, 0);

function addToCart(id, qty = 1) {
  const p = byId(id);
  const linea = state.carrito.find(l => l.id === id);
  const actual = linea ? linea.qty : 0;
  if (actual + qty > p.stock) {
    toast(`Solo quedan ${p.stock} unidades`, "!");
    qty = p.stock - actual;
    if (qty <= 0) return;
  }
  linea ? (linea.qty += qty) : state.carrito.push({ id, qty });
  save(); renderCart(); updateBadges(true);
  toast(`${p.nombre} agregado al carrito`);
}
function setQty(id, qty) {
  const linea = state.carrito.find(l => l.id === id);
  if (!linea) return;
  const max = byId(id).stock;
  if (qty > max) { toast(`Stock máximo: ${max}`, "!"); qty = max; }
  if (qty <= 0) state.carrito = state.carrito.filter(l => l.id !== id);
  else linea.qty = qty;
  save(); renderCart(); updateBadges();
}
function removeLine(id) {
  const p = byId(id);
  const prev = [...state.carrito];
  state.carrito = state.carrito.filter(l => l.id !== id);
  save(); renderCart(); updateBadges();
  toast(`${p.nombre} eliminado`, "×");
  window.__undo = prev;
}

function calcular(metodoEnvio = "estandar", metodoPago = null) {
  const subtotal = state.carrito.reduce((s, l) => s + byId(l.id).precio * l.qty, 0);
  const ahorro = state.carrito.reduce((s, l) => { const p = byId(l.id); return s + (p.antes ? (p.antes - p.precio) * l.qty : 0); }, 0);
  const c = state.cupon && CUPONES[state.cupon];
  const descuento = c && c.tipo === "porcentaje" ? Math.round(subtotal * c.valor) : 0;
  const envioGratis = subtotal >= CONFIG.envioGratisDesde || (c && c.tipo === "envio");
  let envio = subtotal === 0 ? 0 : envioGratis ? 0 : CONFIG.costoEnvio;
  if (metodoEnvio === "express" && subtotal > 0) envio += CONFIG.costoExpress;
  if (metodoEnvio === "retiro") envio = 0;
  const base = subtotal - descuento;
  const descTransf = metodoPago === "transferencia" ? Math.round(base * CONFIG.descuentoTransferencia) : 0;
  const total = Math.round(base - descTransf + envio);
  return { subtotal, ahorro, descuento, envio, envioGratis, descTransf, total };
}

function renderCart() {
  const body = $("#cartBody"), foot = $("#cartFoot"), prog = $("#shipProgress");
  const n = cantidadTotal();
  $("#cartItemsLabel").textContent = n ? `(${n} ${n === 1 ? "artículo" : "artículos"})` : "";

  if (!state.carrito.length) {
    body.innerHTML = `<div class="cart-empty"><img src="img/icono-n.png" alt="" /><h4>Tu carrito está vacío</h4><p>Descubrí nuestros relojes y encontrá el tuyo.</p><button class="btn btn-primary" data-close data-goto="tienda">Ir a la tienda</button></div>`;
    foot.style.display = "none"; prog.style.display = "none";
    return;
  }
  foot.style.display = ""; prog.style.display = "";
  const t = calcular();
  const falta = CONFIG.envioGratisDesde - t.subtotal;
  prog.innerHTML = t.envioGratis
    ? `🎉 <strong>¡Tenés envío gratis!</strong><div class="bar"><i style="width:100%"></i></div>`
    : `Te faltan <strong>${money(falta)}</strong> para el envío gratis<div class="bar"><i style="width:${Math.min(100, t.subtotal / CONFIG.envioGratisDesde * 100)}%"></i></div>`;

  body.innerHTML = state.carrito.map(l => {
    const p = byId(l.id);
    return `<div class="line">
      <img src="${p.img}" alt="" />
      <div>
        <h4>${esc(p.nombre)}</h4>
        <small>${money(p.precio)} c/u${p.stock <= 5 ? " · ¡últimas unidades!" : ""}</small><br>
        <div class="qty" role="group" aria-label="Cantidad">
          <button data-dec="${p.id}" aria-label="Restar uno">−</button><span>${Number(l.qty)}</span><button data-inc="${p.id}" aria-label="Sumar uno">+</button>
        </div>
      </div>
      <div class="line-right"><strong>${money(p.precio * l.qty)}</strong><button class="remove" data-remove="${p.id}">Eliminar</button></div>
    </div>`;
  }).join("");

  const c = state.cupon && CUPONES[state.cupon];
  $("#totals").innerHTML = `
    <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    ${t.ahorro ? `<div class="discount"><span>Ahorrás en ofertas</span><span>${money(t.ahorro)}</span></div>` : ""}
    ${t.descuento ? `<div class="discount"><span>Cupón ${esc(state.cupon)}</span><span>−${money(t.descuento)}</span></div>` : ""}
    <div><span>Envío</span><span>${t.envio ? money(t.envio) : "Gratis"}</span></div>
    <div class="grand"><span>Total</span><span>${money(t.total)}</span></div>
    <div style="font-size:.78rem;color:var(--gris)"><span>o ${CONFIG.cuotas} cuotas sin interés de ${money(t.total / CONFIG.cuotas)}</span></div>`;
  $("#couponInput").value = state.cupon || "";
  const msg = $("#couponMsg");
  if (c) { msg.textContent = `✓ ${c.texto}`; msg.className = "coupon-msg ok"; $("#couponBtn").textContent = "Quitar"; }
  else { $("#couponBtn").textContent = "Aplicar"; if (msg.classList.contains("ok")) { msg.textContent = ""; msg.className = "coupon-msg"; } }
}

function aplicarCupon() {
  const msg = $("#couponMsg");
  if (state.cupon) { state.cupon = null; save(); msg.textContent = "Cupón eliminado"; msg.className = "coupon-msg"; renderCart(); return; }
  const code = $("#couponInput").value.trim().toUpperCase();
  if (!code) { msg.textContent = "Ingresá un código"; msg.className = "coupon-msg err"; return; }
  if (!Object.hasOwn(CUPONES, code)) { msg.textContent = "Código inválido o vencido"; msg.className = "coupon-msg err"; return; }
  state.cupon = code; save(); renderCart(); toast("Cupón aplicado", "🏷");
}

function updateBadges(bump = false) {
  const cc = $("#cartCount"), fc = $("#favCount");
  const n = cantidadTotal();
  cc.textContent = n; cc.classList.toggle("show", n > 0);
  fc.textContent = state.favoritos.length; fc.classList.toggle("show", state.favoritos.length > 0);
  if (bump) { cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump"); }
}

// ---------- Paneles ----------
let lastFocus = null;
function openPanel(el) {
  lastFocus = document.activeElement;
  closeAll(false);
  el.classList.add(el.classList.contains("drawer") ? "open" : "open");
  el.setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
  setTimeout(() => (el.querySelector("[data-close]") || el).focus(), 50);
}
function closeAll(restore = true) {
  $$(".drawer.open, .modal.open, .mobile-nav.open").forEach(e => { e.classList.remove("open"); e.setAttribute("aria-hidden", "true"); });
  $("#overlay").classList.remove("show");
  document.body.style.overflow = "";
  if (restore && lastFocus) lastFocus.focus?.();
}
const openCart = () => { renderCart(); openPanel($("#cartDrawer")); };

// ---------- Vista rápida ----------
function openQuick(id) {
  const p = byId(id);
  if (!p) return;
  const fav = state.favoritos.includes(id);
  let qty = 1;
  $("#qvContent").innerHTML = `
    <div class="qv">
      <div class="qv-media"><img src="${p.img}" alt="${esc(p.nombre)}" /></div>
      <div class="qv-info">
        <span class="card-cat">${p.cats.map(c => CAT_NOMBRE[c]).join(" · ")}</span>
        <h3>${esc(p.nombre)}</h3>
        <div class="price-row" style="padding:0"><span class="price">${money(p.precio)}</span>${p.antes ? `<span class="old">${money(p.antes)}</span><span class="tag sale">-${off(p)}%</span>` : ""}</div>
        <span class="installments">${CONFIG.cuotas} cuotas sin interés de ${money(p.precio / CONFIG.cuotas)} · 5% OFF por transferencia</span>
        <p class="qv-desc">${esc(p.desc)}</p>
        <div class="specs">${Object.entries(p.specs).map(([k, v]) => `<div><small>${k}</small>${v}</div>`).join("")}</div>
        <span class="stock ${p.stock <= 5 ? "low" : ""}">${p.stock <= 5 ? `¡Solo quedan ${p.stock} unidades!` : "En stock · Envío en 24 h"}</span>
        <div class="qv-actions">
          <div class="qty"><button id="qvDec" aria-label="Restar">−</button><span id="qvQty">1</span><button id="qvInc" aria-label="Sumar">+</button></div>
          <button class="btn btn-primary" id="qvAdd">Agregar al carrito</button>
          <button class="fav ${fav ? "on" : ""}" data-fav="${p.id}" style="position:static;width:46px;height:46px" aria-label="Favorito"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z"/></svg></button>
        </div>
        <button class="btn btn-outline" id="qvBuy">Comprar ahora</button>
        <div class="qv-extra">
          <span>🚚 Envío gratis desde ${money(CONFIG.envioGratisDesde)} · Llega en 2-5 días hábiles</span>
          <span>↺ 30 días para cambios y devoluciones</span>
        </div>
      </div>
    </div>`;
  const upd = () => ($("#qvQty").textContent = qty);
  $("#qvDec").onclick = () => { qty = Math.max(1, qty - 1); upd(); };
  $("#qvInc").onclick = () => { if (qty < p.stock) qty++; else toast(`Stock máximo: ${p.stock}`, "!"); upd(); };
  $("#qvAdd").onclick = () => { addToCart(id, qty); closeAll(); };
  $("#qvBuy").onclick = () => { addToCart(id, qty); closeAll(false); openCheckout(); };
  if (!$("#qvModal").classList.contains("open")) openPanel($("#qvModal"));
}

// ---------- Checkout ----------
const co = { paso: 1, datos: {} };

function openCheckout() {
  if (!state.carrito.length) return toast("Tu carrito está vacío", "!");
  co.paso = 1;
  renderCheckout();
  openPanel($("#coModal"));
}

function resumenHTML() {
  const t = calcular(co.datos.envio || "estandar", co.datos.pago || null);
  return `<aside class="summary">
    <h4>Resumen del pedido</h4>
    ${state.carrito.map(l => { const p = byId(l.id); return `<div class="sum-line"><img src="${p.img}" alt=""><span>${esc(p.nombre)} × ${Number(l.qty)}</span><strong>${money(p.precio * l.qty)}</strong></div>`; }).join("")}
    <div class="totals" style="margin-top:1rem">
      <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${t.descuento ? `<div class="discount"><span>Cupón ${esc(state.cupon)}</span><span>−${money(t.descuento)}</span></div>` : ""}
      ${t.descTransf ? `<div class="discount"><span>Transferencia 5%</span><span>−${money(t.descTransf)}</span></div>` : ""}
      <div><span>Envío</span><span>${t.envio ? money(t.envio) : "Gratis"}</span></div>
      <div class="grand"><span>Total</span><span>${money(t.total)}</span></div>
    </div>
  </aside>`;
}

function field(id, label, type = "text", extra = "", max = 120) {
  const v = co.datos[id] ?? "";
  return `<div class="field"><label for="f-${id}">${label}</label><input id="f-${id}" name="${id}" type="${type}" value="${esc(v)}" maxlength="${max}" ${extra} /><span class="msg"></span></div>`;
}

function renderCheckout() {
  const d = co.datos;
  const pasos = ["Contacto", "Envío", "Pago"];
  let form = "";
  if (co.paso === 1) form = `
    <div class="form-step active" data-step="1">
      ${field("nombre", "Nombre y apellido", "text", 'autocomplete="name" required')}
      <div class="row">${field("email", "Email", "email", 'autocomplete="email" required')}${field("telefono", "Teléfono / WhatsApp", "tel", 'autocomplete="tel" required', 20)}</div>
    </div>`;
  if (co.paso === 2) form = `
    <div class="form-step active" data-step="2">
      ${["estandar", "express", "retiro"].map(m => {
        const info = { estandar: ["Envío estándar", "2 a 5 días hábiles", calcular("estandar").envio], express: ["Envío express", "24 a 48 h", calcular("express").envio], retiro: ["Retiro en tienda", "Listo en 24 h", 0] }[m];
        return `<label class="radio-card"><input type="radio" name="envio" value="${m}" ${(d.envio || "estandar") === m ? "checked" : ""}><div>${info[0]}<small>${info[1]}</small></div><strong>${info[2] ? money(info[2]) : "Gratis"}</strong></label>`;
      }).join("")}
      <div id="addrFields" style="display:${d.envio === "retiro" ? "none" : "grid"};gap:1rem">
        ${field("direccion", "Dirección", "text", 'autocomplete="street-address"')}
        <div class="row">${field("ciudad", "Ciudad", "text", 'autocomplete="address-level2"')}${field("cp", "Código postal", "text", 'autocomplete="postal-code"')}</div>
        ${field("notas", "Notas (opcional) — ej: medida de muñeca para ajustar la malla", "text", "", 300)}
      </div>
    </div>`;
  if (co.paso === 3) form = `
    <div class="form-step active" data-step="3">
      ${[["tarjeta", "Tarjeta de crédito / débito", `Hasta ${CONFIG.cuotas} cuotas sin interés`],
         ["transferencia", "Transferencia bancaria", "5% de descuento extra"],
         ["contraentrega", "Pago contra entrega", "Efectivo o QR al recibir"]].map(([v, t, s]) =>
        `<label class="radio-card"><input type="radio" name="pago" value="${v}" ${(d.pago || "tarjeta") === v ? "checked" : ""}><div>${t}<small>${s}</small></div></label>`).join("")}
      <p class="notice">🔒 Al confirmar, enviás el pedido a nuestro WhatsApp y ahí coordinamos el pago. Nunca te vamos a pedir el número, el código ni el PIN de tu tarjeta por chat.</p>
      <label class="radio-card"><input type="checkbox" name="terminos" ${d.terminos ? "checked" : ""}><div>Acepto los términos y condiciones y la política de privacidad</div></label>
      <span class="msg" id="termsMsg" style="color:var(--alerta);font-size:.78rem"></span>
    </div>`;

  $("#coContent").innerHTML = `
    <div class="checkout">
      <h3>Finalizar compra</h3>
      <div class="steps">${pasos.map((p, i) => `<span class="${i < co.paso ? "active" : ""}">${i + 1}. ${p}</span>`).join("")}</div>
      <div class="co-grid">
        <form id="coForm" novalidate>
          ${form}
          <div class="form-nav">
            ${co.paso > 1 ? `<button type="button" class="btn btn-outline" id="coBack">← Volver</button>` : `<span></span>`}
            <button type="submit" class="btn btn-primary">${co.paso < 3 ? "Continuar →" : `Confirmar pedido · ${money(calcular(d.envio, d.pago || "tarjeta").total)}`}</button>
          </div>
        </form>
        ${resumenHTML()}
      </div>
    </div>`;

  const formEl = $("#coForm");
  formEl.addEventListener("change", e => {
    guardarForm();
    if (e.target.name === "envio" || e.target.name === "pago") renderCheckout();
  });
  formEl.addEventListener("submit", e => { e.preventDefault(); siguientePaso(); });
  $("#coBack")?.addEventListener("click", () => { guardarForm(); co.paso--; renderCheckout(); });
}

function guardarForm() {
  const f = $("#coForm");
  if (!f) return;
  $$("input", f).forEach(i => {
    if (i.type === "radio") { if (i.checked) co.datos[i.name] = i.value; }
    else if (i.type === "checkbox") co.datos[i.name] = i.checked;
    else co.datos[i.name] = i.value.trim();
  });
}

function validar() {
  const f = $("#coForm");
  let ok = true;
  const reglas = {
    nombre: v => v.length >= 3 || "Ingresá tu nombre completo",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Email inválido",
    telefono: v => (/^[+\d\s()-]+$/.test(v) && v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15) || "Teléfono inválido",
    direccion: v => co.datos.envio === "retiro" || v.length >= 5 || "Ingresá tu dirección",
    ciudad: v => co.datos.envio === "retiro" || v.length >= 2 || "Ingresá tu ciudad",
    cp: v => co.datos.envio === "retiro" || v.length >= 3 || "Código postal inválido",
  };
  $$(".field", f).forEach(fd => {
    const inp = $("input", fd);
    const r = reglas[inp.name];
    const res = r ? r(inp.value.trim()) : true;
    fd.classList.toggle("error", res !== true);
    $(".msg", fd).textContent = res === true ? "" : res;
    if (res !== true && ok) { inp.focus(); ok = false; }
  });
  if (co.paso === 3 && !co.datos.terminos) { $("#termsMsg").textContent = "Debés aceptar los términos para continuar"; ok = false; }
  return ok;
}

const ENVIOS = { estandar: "Envío estándar", express: "Envío express", retiro: "Retiro en tienda" };
const PAGOS = { tarjeta: "Tarjeta de crédito / débito", transferencia: "Transferencia bancaria", contraentrega: "Pago contra entrega" };

function siguientePaso() {
  guardarForm();
  if (!Object.hasOwn(ENVIOS, co.datos.envio)) co.datos.envio = "estandar";
  if (!Object.hasOwn(PAGOS, co.datos.pago)) co.datos.pago = "tarjeta";
  if (!validar()) return;
  if (co.paso < 3) { co.paso++; renderCheckout(); $("#coModal .modal-box").scrollTop = 0; return; }
  confirmarPedido();
}

// El pedido se envía al WhatsApp de la tienda. No se guarda ningún dato personal en el navegador.
function mensajePedido(nro, t) {
  const d = co.datos;
  const lineas = [
    `Hola nuit.! Quiero hacer este pedido (${nro}):`,
    "",
    ...state.carrito.map(l => { const p = byId(l.id); return `• ${p.nombre} × ${l.qty} = ${money(p.precio * l.qty)}`; }),
    "",
    `Subtotal: ${money(t.subtotal)}`,
    t.descuento ? `Cupón ${state.cupon}: −${money(t.descuento)}` : null,
    t.descTransf ? `Descuento transferencia: −${money(t.descTransf)}` : null,
    `Envío (${ENVIOS[d.envio]}): ${t.envio ? money(t.envio) : "Gratis"}`,
    `Total: ${money(t.total)}`,
    `Pago: ${PAGOS[d.pago]}`,
    "",
    `Nombre: ${d.nombre}`,
    `Teléfono: ${d.telefono}`,
    `Email: ${d.email}`,
    d.envio !== "retiro" ? `Dirección: ${d.direccion}, ${d.ciudad} (CP ${d.cp})` : null,
    d.notas ? `Notas: ${d.notas}` : null,
  ];
  return lineas.filter(l => l !== null).join("\n");
}

function confirmarPedido() {
  const t = calcular(co.datos.envio, co.datos.pago);
  const nro = "NU-" + Date.now().toString().slice(-6);
  const url = `https://wa.me/${encodeURIComponent(CONFIG.whatsapp)}?text=${encodeURIComponent(mensajePedido(nro, t))}`;
  $("#coContent").innerHTML = `
    <div class="success">
      <div class="success-ico">✓</div>
      <h3>Último paso, ${esc(co.datos.nombre.split(" ")[0])}</h3>
      <p>Tu pedido <strong>${nro}</strong> por <strong>${money(t.total)}</strong> está listo. Envialo por WhatsApp para confirmarlo: ahí te respondemos con la disponibilidad y cómo pagar.</p>
      <a class="btn btn-primary" id="sendOrder" target="_blank" rel="noopener noreferrer">Enviar pedido por WhatsApp</a>
    </div>`;
  const btn = $("#sendOrder");
  btn.href = url;
  btn.addEventListener("click", () => {
    co.datos = {}; co.paso = 1;
    state.carrito = []; state.cupon = null; save(); renderCart(); updateBadges(); renderGrid();
    setTimeout(() => closeAll(), 300);
  }, { once: true });
}

// ---------- Cuenta regresiva ----------
function countdown() {
  let fin = Number(LS.get("nuit_offer_end", 0));
  if (!Number.isFinite(fin) || fin < Date.now() || fin > Date.now() + 4 * 864e5) { fin = Date.now() + 3 * 864e5 + 7 * 36e5; LS.set("nuit_offer_end", fin); }
  const pad = n => String(n).padStart(2, "0");
  const tick = () => {
    const ms = Math.max(0, fin - Date.now());
    $("#cd-d").textContent = pad(Math.floor(ms / 864e5));
    $("#cd-h").textContent = pad(Math.floor(ms / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(ms / 6e4) % 60);
    $("#cd-s").textContent = pad(Math.floor(ms / 1e3) % 60);
  };
  tick(); setInterval(tick, 1000);
}

// ---------- Eventos ----------
document.addEventListener("click", e => {
  const t = e.target;
  const q = t.closest("[data-quick]"); const fav = t.closest("[data-fav]"); const add = t.closest("[data-add]");
  if (fav) { e.stopPropagation(); return toggleFav(fav.dataset.fav); }
  if (add) return addToCart(add.dataset.add);
  if (q) return openQuick(q.dataset.quick);
  const inc = t.closest("[data-inc]"), dec = t.closest("[data-dec]"), rem = t.closest("[data-remove]");
  if (inc) { const l = state.carrito.find(x => x.id === inc.dataset.inc); return setQty(l.id, l.qty + 1); }
  if (dec) { const l = state.carrito.find(x => x.id === dec.dataset.dec); return setQty(l.id, l.qty - 1); }
  if (rem) return removeLine(rem.dataset.remove);
  const cl = t.closest("[data-close]");
  if (cl) { closeAll(); if (cl.dataset.goto) $("#" + cl.dataset.goto).scrollIntoView({ behavior: "smooth" }); return; }
  const cat = t.closest("[data-cat]"); if (cat) return setFiltro(cat.dataset.cat, true);
  const foot = t.closest("[data-foot]"); if (foot) return setFiltro(foot.dataset.foot);
  const mob = t.closest("[data-close-mobile]"); if (mob) return closeAll(false);
});

$("#chips").addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) setFiltro(c.dataset.filter); });
$("#sort").addEventListener("change", e => { state.orden = e.target.value; renderGrid(); });
$("#maxPrice").addEventListener("input", e => { state.maxPrecio = +e.target.value; $("#maxPriceLabel").textContent = money(state.maxPrecio); renderGrid(); });
$("#cartBtn").addEventListener("click", openCart);
$("#favBtn").addEventListener("click", () => {
  if (!state.favoritos.length) return toast("Aún no tenés favoritos", "♡");
  setFiltro("favoritos", true);
});
$("#overlay").addEventListener("click", () => closeAll());
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
$("#checkoutBtn").addEventListener("click", () => { closeAll(false); openCheckout(); });
$("#couponBtn").addEventListener("click", aplicarCupon);
$("#couponInput").addEventListener("keydown", e => { if (e.key === "Enter") aplicarCupon(); });

$("#searchToggle").addEventListener("click", () => {
  const bar = $("#searchBar"); bar.classList.toggle("open");
  if (bar.classList.contains("open")) setTimeout(() => $("#searchInput").focus(), 200);
});
$("#searchInput").addEventListener("input", e => { state.busqueda = e.target.value.trim(); renderGrid(); });
$("#searchForm").addEventListener("submit", e => { e.preventDefault(); $("#tienda").scrollIntoView({ behavior: "smooth" }); });

$("#menuToggle").addEventListener("click", () => { $("#mobileNav").classList.add("open"); $("#overlay").classList.add("show"); });

$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("#nlEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return toast("Ingresá un email válido", "!");
  $("#nlEmail").value = "";
  // No hay servidor que guarde suscripciones: la alta se pide por WhatsApp.
  window.open(`https://wa.me/${encodeURIComponent(CONFIG.whatsapp)}?text=${encodeURIComponent(`Hola nuit.! Quiero sumarme al club nuit. Mi email: ${v}`)}`, "_blank", "noopener,noreferrer");
});

$("#waBtn").addEventListener("click", e => {
  e.preventDefault();
  if (!CONFIG.whatsapp) return toast("Configurá tu número de WhatsApp en app.js", "i");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Hola nuit.! Quiero consultar por un reloj")}`, "_blank", "noopener");
});

window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 10), { passive: true });

// ---------- Init ----------
["digital", "analogico", "deportivo", "vintage"].forEach(c => { $("#c-" + c).textContent = PRODUCTOS.filter(p => p.cats.includes(c)).length; });
$("#year").textContent = new Date().getFullYear();
// Limpiar productos inexistentes del carrito guardado
state.carrito = state.carrito.filter(l => byId(l.id));
renderGrid(); renderCart(); updateBadges(); countdown();
