/* =========================================================
   nuit. — Interacciones de la tienda
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Configuración ---------- */
  // Número de WhatsApp de la tienda (formato internacional, sin +)
  var WHATSAPP = "595993491203";

  var C = {
    verde: "#4E684B", crema: "#EFECE8", noche: "#1E2A1F",
    tierra: "#B05434", lapacho: "#D7899E", oro: "#C9A45C", plata: "#A9A9A4"
  };

  /* ---------- Catálogo ---------- */
  var PRODUCTS = [
    { id: "remera-nande-verde", desc: "Remera oversize de algodón 100% peinado, con el isotipo bordado en el pecho. La de todos los días.", name: "Remera Ñande", meta: "Oversize · Verde", price: 180000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.verde, print: "iso-chest", ink: "crema" }, badge: "Ao Po'i" },
    { id: "remera-nanduti-noche", desc: "Corte boxy en negro noche con el círculo del ñandutí estampado al frente. Para salir y que se note.", name: "Remera Ñandutí", meta: "Boxy · Negro noche", price: 195000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.noche, print: "nanduti", ink: "crema" } },
    { id: "hoodie-aopoi", desc: "Hoodie pesado en crudo con el logo en puff print. Abriga, cae bien y dura.", name: "Hoodie Ao Po'i", meta: "Puff print · Crudo", price: 320000, cat: "ropa",
      bg: "verde", art: { type: "hoodie", color: C.crema, print: "logo", ink: "verde" }, badge: "Nuevo", badgeTone: "tierra" },
    { id: "gorra-n-verde", desc: "Gorra verde yerba con la n. bordada en crema. Ajustable atrás.", name: "Gorra n.", meta: "Bordado crema · Verde", price: 120000, cat: "ropa",
      bg: "crema", art: { type: "cap", color: C.verde, ink: "crema" } },
    { id: "remera-pyhare-tierra", desc: "Oversize en terracota, el color de nuestra tierra colorada. Logo al pecho.", name: "Remera Pyhare", meta: "Oversize · Terracota", price: 180000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.tierra, print: "logo", ink: "crema" }, badge: "Yvy Pytã" },
    { id: "hoodie-noche", desc: "Algodón pesado en negro noche, capucha amplia y bolsillo canguro. Tu abrigo de la previa.", name: "Hoodie Noche", meta: "Algodón pesado · Negro", price: 320000, cat: "ropa",
      bg: "tierra", art: { type: "hoodie", color: C.noche, print: "logo", ink: "crema" } },
    { id: "anillo-punto", desc: "Anillo de plata 925 con una bolita de metal como firma. Grabado interno con la n.", name: "Anillo Punto", meta: "Plata 925", price: 260000, cat: "joyeria",
      bg: "noche", art: { type: "ring", metal: "plata" }, badge: "925", badgeTone: "oro" },
    { id: "medalla-nanduti", desc: "Medalla de oro 18k con calado radial inspirado en el ñandutí. Va con certificado de autenticidad.", name: "Medalla Ñandutí", meta: "Oro 18k · Calado radial", price: 1450000, cat: "joyeria",
      bg: "noche", art: { type: "medal", metal: "oro" }, badge: "18k", badgeTone: "oro" },
    { id: "argollas", desc: "Par de argollas con bolita: una en plata, una en oro. Para usar juntas o mezclar.", name: "Argollas Punto", meta: "Plata y oro", price: 340000, cat: "joyeria",
      bg: "noche", art: { type: "hoops" } },
    { id: "remera-tajy", desc: "Cápsula de primavera en rosa lapacho, con el isotipo en el pecho. Pocas piezas por talle.", name: "Remera Tajy", meta: "Cápsula primavera · Lapacho", price: 185000, cat: "ropa",
      bg: "crema", art: { type: "tee", color: C.lapacho, print: "iso-chest", ink: "noche" }, badge: "Tajy" },
    { id: "gorra-n-noche", desc: "Gorra negra con la n. bordada en oro. Ajustable atrás.", name: "Gorra n. Noche", meta: "Bordado oro · Negro", price: 125000, cat: "ropa",
      bg: "verde", art: { type: "cap", color: C.noche, ink: "oro" } },
    { id: "anillo-nanduti", desc: "Anillo de plata 925 con calado de ñandutí. Hecho a mano, en edición corta.", name: "Anillo Ñandutí", meta: "Plata 925 · Calado", price: 290000, cat: "joyeria",
      bg: "noche", art: { type: "ring", metal: "plata", nanduti: true } }
  ];

  // Talles: remeras y hoodies S–XL; gorras talle único; joyería sin talle
  var SIZES = ["S", "M", "L", "XL"];
  PRODUCTS.forEach(function (p) {
    var t = p.art.type;
    if (t === "tee" || t === "hoodie") {
      p.sizes = SIZES;
      p.note = "Corte oversize: si te gusta más ajustado, pedí un talle menos.";
    } else if (t === "cap") {
      p.note = "Talle único, ajustable.";
    } else if (t === "ring") {
      p.note = "La medida la vemos juntos por WhatsApp.";
    } else {
      p.note = "Hecho a mano en Paraguay, en edición corta.";
    }
  });

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
  function badgeHTML(p) {
    return p.badge ? '<span class="product__badge' + (p.badgeTone ? " product__badge--" + p.badgeTone : "") + '">' + p.badge + "</span>" : "";
  }
  function renderProducts(filter) {
    grid.innerHTML = PRODUCTS.filter(function (p) {
      return filter === "todo" || p.cat === filter;
    }).map(function (p, i) {
      return '<article class="product" style="animation-delay:' + (i * 50) + 'ms">' +
        '<div class="product__media bg-' + p.bg + '">' +
          badgeHTML(p) +
          art(p.art) +
          (p.sizes
            ? '<button type="button" class="product__add" data-open="' + p.id + '" aria-label="Elegí tu talle: ' + p.name + '">Ver talles</button>'
            : '<button type="button" class="product__add" data-add="' + p.id + '" aria-label="Agregar ' + p.name + ' al pedido">+ Agregar</button>') +
        "</div>" +
        '<h3 class="product__name"><button type="button" class="product__open" data-open="' + p.id + '" aria-haspopup="dialog">' + p.name + "</button></h3>" +
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
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderProducts(f);
  }
  $$(".filter").forEach(function (b) {
    b.addEventListener("click", function () { setFilter(b.dataset.filter); });
  });
  $$("[data-goto-filter]").forEach(function (a) {
    a.addEventListener("click", function () { setFilter(a.dataset.gotoFilter); });
  });

  /* ---------- Capas (pedido y vista rápida): foco y scroll ---------- */
  var layers = [];   // pila de capas abiertas: { el, close, back }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  function focusables(el) {
    return $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
  }
  function pushLayer(el, close) {
    layers.push({ el: el, close: close, back: document.activeElement });
    document.body.style.overflow = "hidden";
    el.focus();
  }
  function popLayer(el) {
    for (var i = layers.length - 1; i >= 0; i--) {
      if (layers[i].el === el) {
        var back = layers[i].back;
        layers.splice(i, 1);
        if (back && document.contains(back) && back.focus) back.focus();
        break;
      }
    }
    if (!layers.length) document.body.style.overflow = "";
  }
  document.addEventListener("keydown", function (e) {
    var top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === "Escape") { e.preventDefault(); top.close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(top.el);
    if (!f.length) { e.preventDefault(); top.el.focus(); return; }
    var first = f[0], last = f[f.length - 1], cur = document.activeElement;
    if (!top.el.contains(cur) || cur === top.el) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Carrito ---------- */
  // Clave del carrito: "id" o "id::talle" para distinguir talles
  var SEP = "::";
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("nuit-cart")) || {}; } catch (e) { cart = {}; }
  if (typeof cart !== "object" || Array.isArray(cart)) cart = {};
  function save() { try { localStorage.setItem("nuit-cart", JSON.stringify(cart)); } catch (e) { /* sin almacenamiento */ } }
  function find(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; }
  function keyOf(id, size) { return size ? id + SEP + size : id; }
  function parseKey(key) {
    var parts = key.split(SEP), p = find(parts[0]);
    var q = Math.floor(Number(cart[key]));
    if (!p || !(q > 0)) return null;
    var size = parts[1] && p.sizes && p.sizes.indexOf(parts[1]) > -1 ? parts[1] : "";
    if (key !== keyOf(p.id, size)) return null;   // descarta claves raras guardadas
    return { key: key, p: p, size: size, q: q };
  }
  function entries() { return Object.keys(cart).map(parseKey).filter(Boolean); }
  function addToCart(id, size, q) {
    var k = keyOf(id, size);
    cart[k] = (Math.floor(Number(cart[k])) || 0) + (q || 1);
    save(); renderCart();
  }

  var cartEl = $("#cart"), overlay = $("#overlay");
  function openCart() {
    if (cartEl.classList.contains("is-open")) return;
    cartEl.classList.add("is-open"); cartEl.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    pushLayer(cartEl, closeCart);
  }
  function closeCart() {
    if (!cartEl.classList.contains("is-open")) return;
    cartEl.classList.remove("is-open"); cartEl.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    popLayer(cartEl);
  }
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  function sizeLabel(it) {
    if (it.size) return "Talle " + it.size;
    return it.p.sizes ? "Talle a confirmar" : "";
  }
  function orderMessage(list) {
    var total = 0;
    var lines = list.map(function (it) {
      total += it.p.price * it.q;
      var talle = sizeLabel(it);
      return "• " + it.q + " × " + it.p.name + " (" + it.p.meta + ")" + (talle ? " · " + talle : "") + " — " + gs(it.p.price * it.q);
    });
    return "¡Hola nuit.! Quiero hacer este pedido:\n\n" + lines.join("\n") + "\n\nTotal: " + gs(total);
  }

  var checkout = $("#checkout");
  function renderCart() {
    var list = entries(), total = 0, count = 0;
    var body = $("#cartItems");
    if (!list.length) {
      body.innerHTML = '<div class="cart__empty"><img src="assets/isotipo-n-verde.png" alt=""><span class="lora">Todavía está vacío.</span>Elegí algo para tu noche.</div>';
    } else {
      body.innerHTML = list.map(function (it) {
        var p = it.p, talle = sizeLabel(it), full = p.name + (talle ? ", " + talle.toLowerCase() : "");
        total += p.price * it.q; count += it.q;
        return '<div class="cart-item">' +
          '<div class="cart-item__thumb bg-' + p.bg + '">' + art(p.art) + "</div>" +
          '<div><p class="cart-item__name">' + p.name + "</p>" +
            (talle ? '<p class="cart-item__size">' + talle + "</p>" : "") +
            '<p class="cart-item__price">' + gs(p.price) + "</p></div>" +
          '<div class="qty" role="group" aria-label="Cantidad de ' + full + '">' +
            '<button type="button" data-dec="' + it.key + '" aria-label="Quitar uno de ' + full + '">−</button><span>' + it.q + "</span>" +
            '<button type="button" data-inc="' + it.key + '" aria-label="Sumar uno de ' + full + '">+</button></div>' +
        "</div>";
      }).join("");
    }
    $("#cartTotal").textContent = gs(total);
    checkout.href = "https://wa.me/" + WHATSAPP + (list.length ? "?text=" + encodeURIComponent(orderMessage(list)) : "");
    checkout.classList.toggle("is-disabled", !list.length);
    var badge = $("#cartCount");
    badge.textContent = count;
    $("#cartOpen").setAttribute("aria-label", "Abrir tu pedido (" + count + (count === 1 ? " producto)" : " productos)"));
    badge.classList.add("bump");
    setTimeout(function () { badge.classList.remove("bump"); }, 250);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec],[data-open]");
    if (!t) return;
    if (t.dataset.open) { openModal(t.dataset.open, t); return; }
    if (t.dataset.add) {
      addToCart(t.dataset.add, "", 1);
      toast(find(t.dataset.add).name + " · agregado al pedido");
      return;
    }
    var k = t.dataset.inc || t.dataset.dec;
    if (!(k in cart)) return;
    var q = (Math.floor(Number(cart[k])) || 0) + (t.dataset.inc ? 1 : -1);
    if (q <= 0) delete cart[k]; else cart[k] = q;
    save(); renderCart();
    // el re-render reemplaza los botones: devolvemos el foco al mismo control
    var again = $('[data-' + (t.dataset.inc ? "inc" : "dec") + '="' + k + '"]', cartEl);
    (again || $("#cartClose")).focus();
  });

  checkout.addEventListener("click", function (e) {
    if (!entries().length) { e.preventDefault(); toast("Tu pedido está vacío."); }
  });

  $("#whatsappLink").href = "https://wa.me/" + WHATSAPP;
  renderCart();

  /* ---------- Vista rápida de producto ---------- */
  var modal = $("#modal"), modalDialog = $("#modalDialog"), modalForm = $("#modalForm");
  var current = null, modalQty = 1;
  function setQty(n) {
    modalQty = Math.max(1, Math.min(10, n));
    $("#modalQty").textContent = modalQty;
    $("#modalSubmit").textContent = "Sumalo al pedido · " + gs(current.price * modalQty);
  }
  function openModal(id) {
    var p = find(id);
    if (!p) return;
    current = p;
    $("#modalMedia").className = "modal__media bg-" + p.bg;
    $("#modalMedia").innerHTML = badgeHTML(p) + art(p.art);
    $("#modalCat").textContent = p.cat === "joyeria" ? "Joyería" : "Ropa";
    $("#modalName").textContent = p.name;
    $("#modalMeta").textContent = p.meta;
    $("#modalPrice").textContent = gs(p.price);
    $("#modalDesc").textContent = p.desc;
    $("#modalNote").textContent = p.note || "";
    $("#modalError").textContent = "";
    $("#modalSizes").hidden = !p.sizes;
    $("#modalSizeRow").innerHTML = (p.sizes || []).map(function (s) {
      return '<label class="size"><input type="radio" name="talle" value="' + s + '"><span>' + s + "</span></label>";
    }).join("");
    $("#modalAsk").href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("¡Hola nuit.! Tengo una consulta sobre " + p.name + " (" + p.meta + ").");
    setQty(1);
    if (!modal.hidden) return;
    modal.hidden = false;
    modalDialog.scrollTop = 0;
    pushLayer(modalDialog, closeModal);
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    popLayer(modalDialog);
  }
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  modalForm.addEventListener("click", function (e) {
    var b = e.target.closest("[data-mq]");
    if (b) setQty(modalQty + Number(b.dataset.mq));
  });
  modalForm.addEventListener("change", function () { $("#modalError").textContent = ""; });
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!current) return;
    var size = "";
    if (current.sizes) {
      var picked = $('input[name="talle"]:checked', modalForm);
      if (!picked) {
        $("#modalError").textContent = "Elegí tu talle para sumarlo.";
        $('input[name="talle"]', modalForm).focus();
        return;
      }
      size = picked.value;
    }
    var name = current.name, q = modalQty;
    addToCart(current.id, size, q);
    closeModal();
    toast((q > 1 ? q + " × " : "") + name + (size ? " · talle " + size : "") + " · agregado al pedido");
  });

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(text) {
    var el = $("#toast");
    el.textContent = text;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2400);
  }

  /* ---------- Ayuda: abrir la pregunta enlazada ---------- */
  function openFaq(id) {
    var d = id && document.getElementById(id);
    if (d && d.tagName === "DETAILS") d.open = true;
  }
  $$("[data-faq]").forEach(function (a) {
    a.addEventListener("click", function () { openFaq(a.dataset.faq); });
  });
  openFaq(location.hash.slice(1));

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
  var revealEls = $$(".drop__text, .drop__visual, .section-head, .jewel__text, .jewel__cards, .step, .coll, .manifesto__inner, .faq__intro, .faq__list, .about__text, .values, .community__feed, .community__text");
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
