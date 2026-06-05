/* ===== Cart page ===== */
(function () {
  "use strict";
  Store.initChrome({ active: "", cartBar: false });

  const root = document.getElementById("cartRoot");

  function render() {
    const items = Store.entries();

    if (items.length === 0) {
      root.innerHTML = `
        <div class="empty-state big">
          <div class="empty-emoji">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some pooja essentials to get started.</p>
          <a class="btn-primary" href="index.html">Start Shopping →</a>
        </div>`;
      return;
    }

    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-main">
          <div class="delivery-note">
            <span class="dn-ico">🚚</span>
            <div><b>Delivery in 12 minutes</b><small>Shipment of your pooja essentials</small></div>
          </div>
          <div class="cart-items" id="cartItems"></div>
        </div>

        <aside class="cart-side">
          <div class="bill">
            <h4>Bill Details</h4>
            <div class="bill-row"><span>Item total</span><span id="billItems"></span></div>
            <div class="bill-row"><span>Delivery fee</span><span id="billDelivery"></span></div>
            <div class="bill-row discount"><span>Festive discount (5%)</span><span id="billDiscount"></span></div>
            <div class="bill-row total"><span>To Pay</span><span id="billTotal"></span></div>
          </div>
          <a class="btn-primary block" href="checkout.html">Proceed to Checkout →</a>
          <a class="link-back" href="index.html">← Continue shopping</a>
        </aside>
      </div>`;

    const wrap = document.getElementById("cartItems");
    wrap.innerHTML = items.map((e) => `
      <div class="cart-item" data-id="${e.product.id}">
        <a class="cart-item-img" href="product.html?id=${e.product.id}">
          <img src="${e.product.image}" alt="${e.product.name}" />
        </a>
        <div class="cart-item-info">
          <a href="product.html?id=${e.product.id}"><h5>${e.product.name}</h5></a>
          <span class="ci-unit">${e.product.unit}</span>
          <div class="ci-price">${Store.fmt(e.product.price)} <span class="ci-mrp">${Store.fmt(e.product.mrp)}</span></div>
        </div>
        <div class="cart-item-right">
          <div class="action-slot" data-slot="${e.product.id}"></div>
          <div class="ci-line">${Store.fmt(e.product.price * e.qty)}</div>
        </div>
      </div>`).join("");

    items.forEach((e) => {
      const slot = wrap.querySelector(`[data-slot="${e.product.id}"]`);
      Store.mountAction(slot, e.product.id, { onChange: render });
    });

    renderBill();
  }

  function renderBill() {
    const d = Store.deliveryFee();
    document.getElementById("billItems").textContent = Store.fmt(Store.itemTotal());
    document.getElementById("billDelivery").textContent = d === 0 ? "FREE" : Store.fmt(d);
    document.getElementById("billDiscount").textContent = "– " + Store.fmt(Store.discount());
    document.getElementById("billTotal").textContent = Store.fmt(Store.grandTotal());
  }

  render();
})();
