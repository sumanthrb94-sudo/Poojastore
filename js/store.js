/* ===== Divya Pooja Store · shared data + cart + chrome (nav/footer/cart-bar) =====
 * Depends on products.js (PRODUCTS, CATEGORIES). Exposes a global `Store`.
 * Cart is persisted in localStorage so it is shared across every page.
 */
const Store = (function () {
  "use strict";

  const FEE = 25;
  const FREE_OVER = 499;
  const DISCOUNT_RATE = 0.05;
  const CART_KEY = "dps_cart";
  const ORDERS_KEY = "dps_orders";

  /* ---------- helpers ---------- */
  const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const product = (id) => PRODUCTS.find((p) => p.id === id);

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function qtyOf(id) { return getCart()[id]?.qty || 0; }

  function setQty(id, qty) {
    const c = getCart();
    const p = product(id);
    if (!p) return 0;
    if (qty <= 0) delete c[id];
    else c[id] = { qty, price: p.price, name: p.name };
    saveCart(c);
    refresh();
    return qty <= 0 ? 0 : qty;
  }
  function changeQty(id, delta) { return setQty(id, qtyOf(id) + delta); }

  function entries() {
    const c = getCart();
    return Object.keys(c).map((id) => ({ id, qty: c[id].qty, product: product(id) }))
      .filter((e) => e.product);
  }
  const count = () => entries().reduce((s, e) => s + e.qty, 0);
  const itemTotal = () => entries().reduce((s, e) => s + e.qty * e.product.price, 0);
  const deliveryFee = () => (itemTotal() === 0 || itemTotal() >= FREE_OVER ? 0 : FEE);
  const discount = () => Math.round(itemTotal() * DISCOUNT_RATE);
  const grandTotal = () => Math.max(0, itemTotal() - discount() + deliveryFee());

  function related(id, n = 4) {
    const p = product(id);
    if (!p) return PRODUCTS.slice(0, n);
    const same = PRODUCTS.filter((x) => x.id !== id && x.category === p.category);
    const rest = PRODUCTS.filter((x) => x.id !== id && x.category !== p.category);
    return [...same, ...rest].slice(0, n);
  }

  function saveOrder(order) {
    try {
      const h = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      h.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(h.slice(0, 20)));
    } catch (_) { /* ignore */ }
  }
  function clearCart() { localStorage.removeItem(CART_KEY); refresh(); }

  /* ---------- product card + add/stepper ---------- */
  function cardHTML(p) {
    const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    return `
      <article class="card" data-id="${p.id}">
        <a class="card-link" href="product.html?id=${p.id}">
          <div class="card-img-wrap">
            ${p.tag ? `<span class="card-tag ${p.tag}">${p.tag}</span>` : ""}
            ${off > 0 ? `<span class="off-badge">${off}% OFF</span>` : ""}
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </div>
          <span class="card-rating">★ ${p.rating}</span>
          <h4 class="card-name">${p.name}</h4>
          <p class="card-desc">${p.desc}</p>
          <span class="card-unit">${p.unit}</span>
        </a>
        <div class="card-foot">
          <div class="price-block">
            <span class="price-now">${fmt(p.price)}</span>
            <span class="price-mrp">${fmt(p.mrp)}</span>
          </div>
          <div class="action-slot" data-slot="${p.id}"></div>
        </div>
      </article>`;
  }

  // Render Add button / qty stepper into a slot and keep it in sync.
  function mountAction(slot, id, opts = {}) {
    if (!slot) return;
    const draw = () => {
      const q = qtyOf(id);
      if (q === 0) {
        slot.innerHTML = `<button class="add-btn" type="button">Add</button>`;
        slot.querySelector(".add-btn").addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          changeQty(id, 1);
          toast(`${product(id).name} added 🛒`);
          draw(); opts.onChange && opts.onChange();
        });
      } else {
        slot.innerHTML = `
          <div class="stepper">
            <button type="button" data-act="dec">−</button>
            <span class="qty">${q}</span>
            <button type="button" data-act="inc">+</button>
          </div>`;
        slot.querySelector('[data-act="dec"]').addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation(); changeQty(id, -1); draw(); opts.onChange && opts.onChange();
        });
        slot.querySelector('[data-act="inc"]').addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation(); changeQty(id, 1); draw(); opts.onChange && opts.onChange();
        });
      }
    };
    draw();
  }

  /* ---------- chrome: nav header, footer, sticky cart bar ---------- */
  function navHTML(active) {
    const link = (href, key, label) =>
      `<a href="${href}" class="${active === key ? "active" : ""}">${label}</a>`;
    return `
      <header class="nav">
        <div class="nav-inner">
          <a class="brand" href="index.html">
            <span class="brand-logo">ॐ</span>
            <span class="brand-text"><b>Divya Pooja</b><small>Pooja essentials in minutes</small></span>
          </a>
          <form class="nav-search" action="index.html" method="get" role="search">
            <span class="search-ico">🔍</span>
            <input type="search" name="q" placeholder="Search diyas, kalash, kumkum…" autocomplete="off" />
          </form>
          <nav class="nav-links">
            ${link("index.html", "home", "Home")}
            ${link("about.html", "about", "About")}
            ${link("contact.html", "contact", "Contact")}
          </nav>
          <a class="nav-cart" href="cart.html" aria-label="Cart">
            <span class="nav-cart-ico">🛒</span>
            <span class="nav-cart-badge" id="navBadge">0</span>
          </a>
        </div>
      </header>`;
  }

  function footerHTML() {
    return `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><span class="brand-logo">ॐ</span><b>Divya Pooja Store</b></div>
            <p>Authentic brass &amp; copper pooja essentials, delivered to your door in minutes.</p>
          </div>
          <div>
            <h5>Shop</h5>
            <a href="index.html">All Products</a>
            <a href="index.html#categories">Categories</a>
            <a href="cart.html">Your Cart</a>
          </div>
          <div>
            <h5>Company</h5>
            <a href="about.html">About Us</a>
            <a href="contact.html">Contact</a>
          </div>
          <div>
            <h5>Promise</h5>
            <p>🚚 Free delivery over ₹499<br/>🔁 7-day easy returns<br/>🛡️ 100% authentic</p>
          </div>
        </div>
        <div class="footer-base">© <span id="year"></span> Divya Pooja Store · Demo storefront</div>
      </footer>`;
  }

  function cartBarHTML() {
    return `
      <a class="cart-bar" href="cart.html" id="cartBar" hidden>
        <div class="cart-bar-info"><span id="cartBarCount">0 items</span><strong id="cartBarTotal">₹0</strong></div>
        <span class="cart-bar-btn">View Cart <span class="arrow">→</span></span>
      </a>`;
  }

  function initChrome(opts = {}) {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const barSlot = document.getElementById("cart-bar-slot");
    if (header) header.innerHTML = navHTML(opts.active);
    if (footer) footer.innerHTML = footerHTML();
    if (barSlot && opts.cartBar !== false) barSlot.innerHTML = cartBarHTML();
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
    refresh();
  }

  function refresh() {
    const c = count(), t = grandTotal();
    const badge = document.getElementById("navBadge");
    if (badge) { badge.textContent = c; badge.classList.toggle("show", c > 0); }
    const bar = document.getElementById("cartBar");
    if (bar) {
      bar.hidden = c === 0;
      const cc = document.getElementById("cartBarCount");
      const ct = document.getElementById("cartBarTotal");
      if (cc) cc.textContent = `${c} item${c !== 1 ? "s" : ""}`;
      if (ct) ct.textContent = fmt(t);
    }
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast"; t.className = "toast"; t.hidden = true;
      document.body.appendChild(t);
    }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
  }

  return {
    fmt, product, related, entries, count,
    itemTotal, deliveryFee, discount, grandTotal,
    qtyOf, setQty, changeQty, clearCart, saveOrder,
    cardHTML, mountAction, initChrome, refresh, toast,
    PRODUCTS: () => PRODUCTS, CATEGORIES: () => CATEGORIES,
  };
})();
