/* ===== Divya Pooja Store · app logic ===== */
(function () {
  "use strict";

  const DELIVERY_FEE = 25;
  const FREE_DELIVERY_OVER = 499;
  const DISCOUNT_RATE = 0.05; // 5% festive discount

  // State
  let cart = loadCart();
  let activeCategory = "All";
  let searchTerm = "";

  // Elements
  const el = (id) => document.getElementById(id);
  const productGrid = el("productGrid");
  const categoryBar = el("categoryBar");
  const searchInput = el("searchInput");
  const catalogTitle = el("catalogTitle");
  const catalogCount = el("catalogCount");
  const emptyState = el("emptyState");

  const cartBar = el("cartBar");
  const overlay = el("overlay");
  const drawer = el("cartDrawer");

  const fmt = (n) => "₹" + n.toLocaleString("en-IN");

  /* ---------- Persistence ---------- */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem("dps_cart")) || {}; }
    catch { return {}; }
  }
  function saveCart() {
    localStorage.setItem("dps_cart", JSON.stringify(cart));
  }

  /* ---------- Categories ---------- */
  function renderCategories() {
    categoryBar.innerHTML = CATEGORIES.map((c) => `
      <button class="cat-chip ${c.name === activeCategory ? "active" : ""}" data-cat="${c.name}">
        <span class="cat-icon">${c.icon}</span>
        <span>${c.name}</span>
      </button>
    `).join("");
    categoryBar.querySelectorAll(".cat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeCategory = chip.dataset.cat;
        renderCategories();
        renderProducts();
      });
    });
  }

  /* ---------- Products ---------- */
  function filteredProducts() {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }

  function renderProducts() {
    const list = filteredProducts();
    catalogTitle.textContent = activeCategory === "All" ? "All Products" : activeCategory;
    catalogCount.textContent = list.length ? `${list.length} items` : "";
    emptyState.hidden = list.length > 0;

    productGrid.innerHTML = list.map((p) => {
      const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return `
      <article class="card" data-id="${p.id}">
        <div class="card-img-wrap">
          ${p.tag ? `<span class="card-tag ${p.tag}">${p.tag}</span>` : ""}
          ${off > 0 ? `<span class="off-badge">${off}% OFF</span>` : ""}
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <span class="card-rating">★ ${p.rating}</span>
        <h4 class="card-name">${p.name}</h4>
        <p class="card-desc">${p.desc}</p>
        <span class="card-unit">${p.unit}</span>
        <div class="card-foot">
          <div class="price-block">
            <span class="price-now">${fmt(p.price)}</span>
            <span class="price-mrp">${fmt(p.mrp)}</span>
          </div>
          <div class="action-slot" data-slot="${p.id}"></div>
        </div>
      </article>`;
    }).join("");

    list.forEach((p) => renderAction(p.id));
  }

  function renderAction(id) {
    const slot = productGrid.querySelector(`[data-slot="${id}"]`);
    if (!slot) return;
    const qty = cart[id]?.qty || 0;
    if (qty === 0) {
      slot.innerHTML = `<button class="add-btn">Add</button>`;
      slot.querySelector(".add-btn").addEventListener("click", () => updateQty(id, 1));
    } else {
      slot.innerHTML = `
        <div class="stepper">
          <button data-act="dec">−</button>
          <span class="qty">${qty}</span>
          <button data-act="inc">+</button>
        </div>`;
      slot.querySelector('[data-act="dec"]').addEventListener("click", () => updateQty(id, -1));
      slot.querySelector('[data-act="inc"]').addEventListener("click", () => updateQty(id, 1));
    }
  }

  /* ---------- Cart operations ---------- */
  function updateQty(id, delta) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const current = cart[id]?.qty || 0;
    const next = current + delta;
    if (next <= 0) {
      delete cart[id];
    } else {
      cart[id] = { qty: next, product };
    }
    saveCart();
    renderAction(id);
    refreshCartUI();
    if (delta > 0 && current === 0) toast(`${product.name} added 🛒`);
  }

  function cartEntries() { return Object.values(cart); }
  function cartCount() { return cartEntries().reduce((s, e) => s + e.qty, 0); }
  function itemTotal() { return cartEntries().reduce((s, e) => s + e.qty * e.product.price, 0); }
  function deliveryFee() { return itemTotal() >= FREE_DELIVERY_OVER || itemTotal() === 0 ? 0 : DELIVERY_FEE; }
  function discount() { return Math.round(itemTotal() * DISCOUNT_RATE); }
  function grandTotal() { return Math.max(0, itemTotal() - discount() + deliveryFee()); }

  /* ---------- Cart bar + drawer UI ---------- */
  function refreshCartUI() {
    const count = cartCount();
    const total = grandTotal();

    cartBar.hidden = count === 0;
    el("cartBarCount").textContent = `${count} item${count !== 1 ? "s" : ""}`;
    el("cartBarTotal").textContent = fmt(total);

    el("headerCartLabel").textContent = count > 0 ? `${count} item${count !== 1 ? "s" : ""}` : "My Cart";

    renderCartItems();
    renderBill();
  }

  function renderCartItems() {
    const items = cartEntries();
    const wrap = el("cartItems");
    const emptyCart = el("emptyCart");
    const bill = el("billSection");
    const foot = document.querySelector(".drawer-foot");
    const dn = document.querySelector(".delivery-note");

    if (items.length === 0) {
      wrap.innerHTML = "";
      emptyCart.classList.add("show");
      bill.style.display = "none";
      foot.style.display = "none";
      dn.style.display = "none";
      return;
    }
    emptyCart.classList.remove("show");
    bill.style.display = "";
    foot.style.display = "";
    dn.style.display = "";

    wrap.innerHTML = items.map((e) => `
      <div class="cart-item" data-id="${e.product.id}">
        <div class="cart-item-img"><img src="${e.product.image}" alt="${e.product.name}" /></div>
        <div class="cart-item-info">
          <h5>${e.product.name}</h5>
          <span class="ci-unit">${e.product.unit}</span>
          <div class="ci-price">${fmt(e.product.price * e.qty)}</div>
        </div>
        <div class="stepper">
          <button data-act="dec">−</button>
          <span class="qty">${e.qty}</span>
          <button data-act="inc">+</button>
        </div>
      </div>`).join("");

    wrap.querySelectorAll(".cart-item").forEach((row) => {
      const id = row.dataset.id;
      row.querySelector('[data-act="dec"]').addEventListener("click", () => updateQty(id, -1));
      row.querySelector('[data-act="inc"]').addEventListener("click", () => updateQty(id, 1));
    });
  }

  function renderBill() {
    el("billItems").textContent = fmt(itemTotal());
    el("billDelivery").textContent = deliveryFee() === 0 ? "FREE" : fmt(deliveryFee());
    el("billDiscount").textContent = "– " + fmt(discount());
    el("billTotal").textContent = fmt(grandTotal());
    el("checkoutTotal").textContent = fmt(grandTotal());
    el("confirmTotal").textContent = fmt(grandTotal());
  }

  /* ---------- Drawer open/close ---------- */
  function openDrawer() {
    overlay.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    if (cartCount() === 0) { toast("Your cart is empty"); return; }
    el("checkoutOverlay").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCheckout() {
    el("checkoutOverlay").hidden = true;
    if (!drawer.classList.contains("open")) document.body.style.overflow = "";
  }

  function placeOrder(e) {
    e.preventDefault();

    // Capture the order summary BEFORE clearing the cart.
    const items = cartEntries();
    const orderId = "#DPS" + String(Math.floor(1000 + Math.random() * 9000));
    const total = grandTotal();
    const count = cartCount();

    el("orderId").textContent = orderId;
    el("successSummary").innerHTML =
      `<span>${count} item${count !== 1 ? "s" : ""}</span>` +
      `<strong>${fmt(total)}</strong>`;

    // Persist a lightweight order history (handy for a real demo).
    try {
      const history = JSON.parse(localStorage.getItem("dps_orders") || "[]");
      history.unshift({ id: orderId, total, count, at: Date.now() });
      localStorage.setItem("dps_orders", JSON.stringify(history.slice(0, 20)));
    } catch (_) { /* ignore */ }

    // Reset cart & UI.
    cart = {};
    saveCart();
    refreshCartUI();
    renderProducts();

    // Close every other layer FIRST so nothing can stack behind success.
    closeCheckout();
    closeDrawer();
    el("checkoutForm").reset();

    // Show success on top of everything.
    el("successOverlay").hidden = false;
    document.body.style.overflow = "hidden";
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = el("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 1800);
  }

  /* ---------- Wire up ---------- */
  function init() {
    el("year").textContent = new Date().getFullYear();
    renderCategories();
    renderProducts();
    refreshCartUI();

    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });

    el("cartBarBtn").addEventListener("click", openDrawer);
    el("headerCartBtn").addEventListener("click", openDrawer);
    el("closeCart").addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    el("checkoutBtn").addEventListener("click", openCheckout);
    el("closeCheckout").addEventListener("click", closeCheckout);
    el("checkoutOverlay").addEventListener("click", (e) => {
      if (e.target === el("checkoutOverlay")) closeCheckout();
    });
    el("checkoutForm").addEventListener("submit", placeOrder);

    el("doneBtn").addEventListener("click", () => {
      el("successOverlay").hidden = true;
      document.body.style.overflow = "";
    });

    el("locationBtn").addEventListener("click", () => toast("📍 Delivering to MG Road, Bengaluru"));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!el("successOverlay").hidden) { el("successOverlay").hidden = true; document.body.style.overflow = ""; }
        else if (!el("checkoutOverlay").hidden) closeCheckout();
        else if (drawer.classList.contains("open")) closeDrawer();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
