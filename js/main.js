/* =========================================================
   nuit. — Interacciones de la tienda
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Configuración ---------- */
  // Reemplazá por el número real de WhatsApp de la tienda (formato internacional, sin +)
  var WHATSAPP = "595993491203";

  var C = {
    verde: "#4E684B", crema: "#EFECE8", noche: "#1E2A1F",
    tierra: "#B05434", lapacho: "#D7899E", oro: "#C9A45C", plata: "#A9A9A4"
  };

  /* ---------- Catálogo ---------- */
  var PRODUCTS = [
    { id: "remera-nande-verde", name: "Remera Ñande", meta: "Oversize · Verde", price: 180000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.verde, print: "iso-chest", ink: "crema" }, badge: "Ao Po'i" },
    { id: "remera-nanduti-noche", name: "Remera Ñandutí", meta: "Boxy · Negro noche", price: 195000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.noche, print: "nanduti", ink: "crema" } },
    { id: "hoodie-aopoi", name: "Hoodie Ao Po'i", meta: "Puff print · Crudo", price: 320000, cat: "ropa",
      bg: "verde", art: { type: "hoodie", color: C.crema, print: "logo", ink: "verde" }, badge: "Nuevo", badgeTone: "tierra" },
    { id: "gorra-n-verde", name: "Gorra n.", meta: "Bordado crema · Verde", price: 120000, cat: "ropa",
      bg: "crema", art: { type: "cap", color: C.verde, ink: "crema" } },
    { id: "remera-pyhare-tierra", name: "Remera Pyhare", meta: "Oversize · Terracota", price: 180000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.tierra, print: "logo", ink: "crema" }, badge: "Yvy Pytã" },
    { id: "hoodie-noche", name: "Hoodie Noche", meta: "Algodón pesado · Negro", price: 320000, cat: "ropa",
      bg: "tierra", art: { type: "hoodie", color: C.noche, print: "logo", ink: "crema" } },
    { id: "anillo-punto", name: "Anillo Punto", meta: "Plata 925", price: 260000, cat: "joyeria",
      bg: "noche", art: { type: "ring", metal: "plata" }, badge: "925", badgeTone: "oro" },
    { id: "medalla-nanduti", name: "Medalla Ñandutí", meta: "Oro 18k · Calado radial", price: 1450000, cat: "joyeria",
      bg: "noche", art: { type: "medal", metal: "oro" }, badge: "18k", badgeTone: "oro" },
    { id: "argollas", name: "Argollas Punto", meta: "Plata y oro", price: 340000, cat: "joyeria",
      bg: "noche", art: { type: "hoops" } },
    { id: "remera-tajy", name: "Remera Tajy", meta: "Cápsula primavera · Lapacho", price: 185000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.lapacho, print: "iso-chest", ink: "noche" }, badge: "Tajy" },
    { id: "gorra-n-noche", name: "Gorra n. Noche", meta: "Bordado oro · Negro", price: 125000, cat: "ropa",
      bg: "verde", art: { type: "cap", color: C.noche, ink: "oro" } },
    { id: "anillo-nanduti", name: "Anillo Ñandutí", meta: "Plata 925 · Calado", price: 290000, cat: "joyeria",
      bg: "noche", art: { type: "ring", metal: "plata", nanduti: true } }
  ];

  /* ---------- Utilidades ---------- */
  function gs(n) { return "Gs. " + n.toLocaleString("es-PY").replace(/,/g, "."); }
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $$(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }
  var uid = 0;

  /* ---------- Patrón ñandutí (SVG generado) ---------- */
  function nandutiSVG() {
    var cx = 300, cy = 300, out = [];
    [290, 250, 175, 115, 62, 22].forEach(function (r) {
      out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>');
    });
    var spokes = 32;
    for (var i = 0; i < spokes; i++) {
      var a = (i / spokes) * Math.PI * 2;
      out.push('<line x1="' + (cx + Math.cos(a) * 22) + '" y1="' + (cy + Math.sin(a) * 22) +
        '" x2="' + (cx + Math.cos(a) * 290) + '" y2="' + (cy + Math.sin(a) * 290) + '"/>');
    }
    // pétalos entre anillos
    for (var j = 0; j < 16; j++) {
      var deg = (j / 16) * 360 + 11.25;
      out.push('<ellipse cx="' + cx + '" cy="' + (cy - 212) + '" rx="13" ry="30" transform="rotate(' + deg + ' 300 300)"/>');
      out.push('<ellipse cx="' + cx + '" cy="' + (cy - 145) + '" rx="9" ry="20" transform="rotate(' + (deg + 11.25) + ' 300 300)"/>');
    }
    // festón exterior
    for (var k = 0; k < 32; k++) {
      var d2 = (k / 32) * 360;
      out.push('<path d="M 285 52 Q 300 72 315 52" transform="rotate(' + d2 + ' 300 300)"/>');
    }
    // centro radial
    for (var m = 0; m < 24; m++) {
      var d3 = (m / 24) * 360;
      out.push('<path d="M 300 278 L 296 250 L 304 250 Z" transform="rotate(' + d3 + ' 300 300)"/>');
    }
    return '<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">' + out.join("") + "</svg>";
  }
  var NANDUTI = nandutiSVG();
  $$(".nanduti").forEach(function (el) { el.innerHTML = NANDUTI; });

  /* ---------- Ilustraciones de producto ---------- */
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, (n >> 16) + amt));
    var g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    var b = Math.max(0, Math.min(255, (n & 255) + amt));
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function miniNanduti(cx, cy, r, stroke) {
    var s = '<g fill="none" stroke="' + stroke + '" stroke-width="1">';
    [1, .78, .52, .26].forEach(function (f) { s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * f) + '"/>'; });
    for (var i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2;
      s += '<line x1="' + (cx + Math.cos(a) * r * .1) + '" y1="' + (cy + Math.sin(a) * r * .1) +
        '" x2="' + (cx + Math.cos(a) * r) + '" y2="' + (cy + Math.sin(a) * r) + '"/>';
    }
    for (var j = 0; j < 12; j++) {
      var d = (j / 12) * 360;
      s += '<ellipse cx="' + cx + '" cy="' + (cy - r * .65) + '" rx="' + r * .06 + '" ry="' + r * .13 + '" transform="rotate(' + d + ' ' + cx + ' ' + cy + ')"/>';
    }
    return s + "</g>";
  }

  function metalGrad(id, metal) {
    var stops = metal === "oro"
      ? ["#F1D79A", "#C9A45C", "#9E7B3A"]
      : ["#F2F2EF", "#B9B9B4", "#7F7F7A"];
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + stops[0] + '"/><stop offset=".5" stop-color="' + stops[1] + '"/>' +
      '<stop offset="1" stop-color="' + stops[2] + '"/></linearGradient>';
  }

  function art(a) {
    var id = "g" + (++uid);
    var inkSrc = function (kind) { return "assets/" + kind + "-" + (a.ink || "crema") + ".png"; };
    var svg = "";

    if (a.type === "tee") {
      var dark = shade(a.color, -18);
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true">' +
        '<path d="M62 22 L30 36 L8 74 L36 88 L46 72 L46 186 L154 186 L154 72 L164 88 L192 74 L170 36 L138 22 Q100 44 62 22 Z" fill="' + a.color + '"/>' +
        '<path d="M62 22 Q100 44 138 22 Q100 34 62 22 Z" fill="' + dark + '"/>' +
        '<path d="M46 72 L46 92" stroke="' + dark + '" stroke-width="2"/><path d="M154 72 L154 92" stroke="' + dark + '" stroke-width="2"/>';
      if (a.print === "iso-chest") svg += '<image href="' + inkSrc("isotipo-n") + '" x="112" y="58" width="24" height="15"/>';
      if (a.print === "logo") svg += '<image href="' + inkSrc("logo-nuit") + '" x="62" y="88" width="76" height="27"/>';
      if (a.print === "nanduti") {
        svg += miniNanduti(100, 104, 38, "rgba(239,236,232,.75)");
        svg += '<image href="' + inkSrc("logo-nuit") + '" x="66" y="146" width="68" height="24"/>';
      }
      return svg + "</svg>";
    }

    if (a.type === "hoodie") {
      var d = shade(a.color, -22);
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true">' +
        '<path d="M70 26 Q100 4 130 26 L168 42 L192 150 L170 156 L156 92 L156 188 L44 188 L44 92 L30 156 L8 150 L32 42 Z" fill="' + a.color + '"/>' +
        '<path d="M70 26 Q100 4 130 26 Q124 50 100 52 Q76 50 70 26 Z" fill="' + d + '"/>' +
        '<path d="M92 50 L90 76 M108 50 L110 76" stroke="' + d + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
        '<path d="M66 142 L134 142 L140 180 L60 180 Z" fill="none" stroke="' + d + '" stroke-width="2.4" stroke-linejoin="round"/>';
      if (a.print === "logo") svg += '<image href="' + inkSrc("logo-nuit") + '" x="62" y="90" width="76" height="27"/>';
      return svg + "</svg>";
    }

    if (a.type === "cap") {
      var dc = shade(a.color, -20);
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true">' +
        '<path d="M34 128 Q34 62 100 58 Q166 62 166 128 Z" fill="' + a.color + '"/>' +
        '<path d="M100 58 L100 128" stroke="' + dc + '" stroke-width="1.6"/>' +
        '<circle cx="100" cy="58" r="5" fill="' + dc + '"/>' +
        '<path d="M30 128 L166 128 Q190 130 196 146 Q150 136 100 140 Q60 142 30 136 Z" fill="' + dc + '"/>' +
        '<image href="' + inkSrc("isotipo-n") + '" x="84" y="86" width="34" height="21"/>' +
        "</svg>";
      return svg;
    }

    if (a.type === "ring") {
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true"><defs>' + metalGrad(id, a.metal) + "</defs>" +
        '<circle cx="100" cy="108" r="62" fill="none" stroke="url(#' + id + ')" stroke-width="18"/>' +
        '<circle cx="100" cy="40" r="14" fill="url(#' + id + ')"/>';
      if (a.nanduti) svg += miniNanduti(100, 108, 44, "rgba(201,201,196,.55)");
      else svg += '<text x="100" y="112" text-anchor="middle" font-family="Poppins, sans-serif" font-size="9" letter-spacing="3" fill="#8f8f8a">n. 925</text>';
      return svg + "</svg>";
    }

    if (a.type === "medal") {
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true"><defs>' + metalGrad(id, a.metal) + "</defs>" +
        '<path d="M62 8 Q100 70 138 8" fill="none" stroke="#C9A45C" stroke-width="2.5"/>' +
        '<circle cx="100" cy="122" r="66" fill="url(#' + id + ')"/>' +
        miniNanduti(100, 122, 58, "rgba(120,88,30,.55)") +
        '<circle cx="100" cy="122" r="6" fill="#F1D79A"/>' +
        "</svg>";
      return svg;
    }

    if (a.type === "hoops") {
      var id2 = id + "b";
      svg = '<svg viewBox="0 0 200 200" class="art" aria-hidden="true"><defs>' + metalGrad(id, "plata") + metalGrad(id2, "oro") + "</defs>" +
        '<circle cx="72" cy="100" r="40" fill="none" stroke="url(#' + id + ')" stroke-width="10"/>' +
        '<circle cx="72" cy="146" r="7" fill="url(#' + id + ')"/>' +
        '<circle cx="128" cy="100" r="40" fill="none" stroke="url(#' + id2 + ')" stroke-width="10"/>' +
        '<circle cx="128" cy="146" r="7" fill="url(#' + id2 + ')"/>' +
        "</svg>";
      return svg;
    }
    return "";
  }

  // Ilustraciones estáticas en el HTML (drop y joyería)
  $$("[data-art]").forEach(function (el) {
    el.innerHTML = art({
      type: el.dataset.art,
      color: el.dataset.color,
      print: el.dataset.print ? "logo" : null,
      ink: el.dataset.print,
      metal: el.dataset.metal
    });
  });

  /* ---------- Render de productos ---------- */
  var grid = $("#products");
  function renderProducts(filter) {
    grid.innerHTML = PRODUCTS.filter(function (p) {
      return filter === "todo" || p.cat === filter;
    }).map(function (p, i) {
      return '<article class="product" style="animation-delay:' + (i * 50) + 'ms">' +
        '<div class="product__media bg-' + p.bg + '">' +
          (p.badge ? '<span class="product__badge' + (p.badgeTone ? " product__badge--" + p.badgeTone : "") + '">' + p.badge + "</span>" : "") +
          art(p.art) +
          '<button class="product__add" data-add="' + p.id + '" aria-label="Agregar ' + p.name + ' al carrito">+ Agregar</button>' +
        "</div>" +
        '<h3 class="product__name">' + p.name + "</h3>" +
        '<p class="product__meta">' + p.meta + "</p>" +
        '<p class="product__price">' + gs(p.price) + "</p>" +
      "</article>";
    }).join("");
  }
  renderProducts("todo");

  function setFilter(f) {
    $$(".filter").forEach(function (b) {
      var on = b.dataset.filter === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    renderProducts(f);
  }
  $$(".filter").forEach(function (b) {
    b.addEventListener("click", function () { setFilter(b.dataset.filter); });
  });
  $$("[data-goto-filter]").forEach(function (a) {
    a.addEventListener("click", function () { setFilter(a.dataset.gotoFilter); });
  });

  /* ---------- Carrito ---------- */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("nuit-cart")) || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem("nuit-cart", JSON.stringify(cart)); } catch (e) { /* sin almacenamiento */ } }
  function find(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; }

  var cartEl = $("#cart"), overlay = $("#overlay");
  function openCart() {
    cartEl.classList.add("is-open"); cartEl.setAttribute("aria-hidden", "false");
    overlay.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartEl.classList.remove("is-open"); cartEl.setAttribute("aria-hidden", "true");
    overlay.hidden = true; document.body.style.overflow = "";
  }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

  function renderCart() {
    var ids = Object.keys(cart).filter(find), total = 0, count = 0;
    var body = $("#cartItems");
    if (!ids.length) {
      body.innerHTML = '<div class="cart__empty"><img src="assets/isotipo-n-verde.png" alt=""><span class="lora">Todavía está vacío.</span>Elegí algo para tu noche.</div>';
    } else {
      body.innerHTML = ids.map(function (id) {
        var p = find(id), q = cart[id];
        total += p.price * q; count += q;
        return '<div class="cart-item">' +
          '<div class="cart-item__thumb bg-' + p.bg + '">' + art(p.art) + "</div>" +
          '<div><p class="cart-item__name">' + p.name + '</p><p class="cart-item__price">' + gs(p.price) + "</p></div>" +
          '<div class="qty"><button data-dec="' + id + '" aria-label="Quitar uno">−</button><span>' + q + '</span><button data-inc="' + id + '" aria-label="Sumar uno">+</button></div>' +
        "</div>";
      }).join("");
    }
    $("#cartTotal").textContent = gs(total);
    var badge = $("#cartCount");
    badge.textContent = count;
    badge.classList.add("bump");
    setTimeout(function () { badge.classList.remove("bump"); }, 250);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec]");
    if (!t) return;
    if (t.dataset.add) {
      cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1;
      toast(find(t.dataset.add).name + " · agregado al pedido");
    } else if (t.dataset.inc) {
      cart[t.dataset.inc]++;
    } else if (t.dataset.dec) {
      cart[t.dataset.dec]--;
      if (cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec];
    }
    save(); renderCart();
  });

  $("#checkout").addEventListener("click", function () {
    var ids = Object.keys(cart).filter(find);
    if (!ids.length) { toast("Tu pedido está vacío."); return; }
    var total = 0;
    var lines = ids.map(function (id) {
      var p = find(id); total += p.price * cart[id];
      return "• " + cart[id] + " × " + p.name + " (" + p.meta + ") — " + gs(p.price * cart[id]);
    });
    var msg = "¡Hola nuit.! Quiero hacer este pedido:\n\n" + lines.join("\n") + "\n\nTotal: " + gs(total);
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  $("#whatsappLink").href = "https://wa.me/" + WHATSAPP;
  renderCart();

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(text) {
    var el = $("#toast");
    el.textContent = text;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2400);
  }

  /* ---------- Info de ayuda ---------- */
  var INFO = {
    envios: "Envíos a todo el país. Gran Asunción en 24–48 h.",
    talles: "Corte oversize: si te gusta más ajustado, pedí un talle menos.",
    cuidado: "Lavá a mano o en frío, del revés. Cuidala y te dura años."
  };
  $$("[data-info]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); toast(INFO[a.dataset.info]); });
  });

  /* ---------- Menú móvil ---------- */
  var menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("a", nav).forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Newsletter ---------- */
  $("#newsletter").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#email"), msg = $("#newsletterMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      msg.textContent = "Revisá tu correo, parece que falta algo.";
      msg.classList.add("is-error");
      return;
    }
    msg.classList.remove("is-error");
    msg.textContent = "¡Listo! Ya sos parte. Te llega tu 10% al correo. Ñande pyhare.";
    input.value = "";
  });

  /* ---------- Revelado al hacer scroll ---------- */
  var revealEls = $$(".drop__text, .drop__visual, .section-head, .jewel__text, .jewel__cards, .coll, .manifesto__inner, .about__text, .values, .community__feed, .community__text");
  if ("IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  $("#year").textContent = new Date().getFullYear();
})();
