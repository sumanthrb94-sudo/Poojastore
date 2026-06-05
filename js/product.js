/* ===== Product detail page ===== */
(function () {
  "use strict";
  Store.initChrome({ active: "" });

  const root = document.getElementById("detailRoot");
  const id = new URLSearchParams(location.search).get("id");
  const p = Store.product(id);

  if (!p) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">🔍</div>
        <p>Product not found.</p>
        <a class="btn-primary" href="index.html">Back to shop</a>
      </div>`;
    return;
  }

  document.title = `${p.name} · Sri Sai Pooja Store`;
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const save = p.mrp - p.price;

  root.innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">Home</a> ›
      <a href="index.html?q=${encodeURIComponent(p.category)}">${p.category}</a> ›
      <span>${p.name}</span>
    </nav>

    <div class="detail-grid">
      <div class="detail-media">
        ${p.tag ? `<span class="card-tag ${p.tag}">${p.tag}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" />
      </div>

      <div class="detail-info">
        <span class="card-rating">★ ${p.rating} · Top rated</span>
        <h1>${p.name}</h1>
        <p class="detail-desc">${p.desc}</p>
        <p class="detail-unit">Pack: <b>${p.unit}</b></p>

        <div class="detail-price">
          <span class="price-now">${Store.fmt(p.price)}</span>
          <span class="price-mrp">${Store.fmt(p.mrp)}</span>
          ${off > 0 ? `<span class="detail-off">${off}% OFF</span>` : ""}
        </div>
        ${save > 0 ? `<p class="detail-save">You save ${Store.fmt(save)} on this item</p>` : ""}

        <div class="detail-actions">
          <div class="action-slot" id="detailAction"></div>
          <a class="btn-primary" href="cart.html" id="buyNow">Go to Cart →</a>
        </div>

        <ul class="detail-perks">
          <li>🚚 Delivery in 12 minutes</li>
          <li>🛡️ 100% authentic brass / copper</li>
          <li>🔁 7-day easy returns</li>
        </ul>
      </div>
    </div>

    <section class="related">
      <h3>You may also like</h3>
      <div class="product-grid" id="relatedGrid"></div>
    </section>`;

  // Add / stepper
  Store.mountAction(document.getElementById("detailAction"), p.id);

  // Related products
  const rel = Store.related(p.id, 4);
  const relGrid = document.getElementById("relatedGrid");
  relGrid.innerHTML = rel.map(Store.cardHTML).join("");
  rel.forEach((rp) => Store.mountAction(relGrid.querySelector(`[data-slot="${rp.id}"]`), rp.id));
})();
