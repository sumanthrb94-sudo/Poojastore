/* ===== Checkout page · delivery details → place order → success ===== */
(function () {
  "use strict";
  Store.initChrome({ active: "", cartBar: false });

  const root = document.getElementById("checkoutRoot");

  function renderEmpty() {
    root.innerHTML = `
      <div class="empty-state big">
        <div class="empty-emoji">🛒</div>
        <h3>Nothing to check out</h3>
        <p>Your cart is empty.</p>
        <a class="btn-primary" href="index.html">Start Shopping →</a>
      </div>`;
  }

  function renderForm() {
    const items = Store.entries();
    if (items.length === 0) { renderEmpty(); return; }

    root.innerHTML = `
      <h1 class="page-title">Checkout</h1>
      <div class="checkout-layout">
        <form class="checkout-card" id="checkoutForm">
          <h3>Delivery Details</h3>
          <label>Full Name<input name="name" required placeholder="e.g. Lakshmi Narayan" /></label>
          <label>Phone Number<input name="phone" required pattern="[0-9]{10}" placeholder="10-digit mobile" /></label>
          <label>Delivery Address<textarea name="address" required rows="2" placeholder="Flat / House no, Street, Landmark"></textarea></label>
          <div class="two-col">
            <label>City<input name="city" required placeholder="Bengaluru" /></label>
            <label>PIN Code<input name="pin" required pattern="[0-9]{6}" placeholder="560001" /></label>
          </div>
          <div class="pay-options">
            <span class="pay-label">Payment Method</span>
            <label class="pay-opt"><input type="radio" name="pay" value="UPI" checked /> UPI</label>
            <label class="pay-opt"><input type="radio" name="pay" value="Card" /> Card</label>
            <label class="pay-opt"><input type="radio" name="pay" value="COD" /> Cash on Delivery</label>
          </div>
          <button type="submit" class="btn-primary block">Place Order · <span id="confirmTotal"></span></button>
        </form>

        <aside class="checkout-summary">
          <h3>Order Summary</h3>
          <div class="summary-items" id="summaryItems"></div>
          <div class="bill">
            <div class="bill-row"><span>Item total</span><span id="billItems"></span></div>
            <div class="bill-row"><span>Delivery fee</span><span id="billDelivery"></span></div>
            <div class="bill-row discount"><span>Festive discount (5%)</span><span id="billDiscount"></span></div>
            <div class="bill-row total"><span>To Pay</span><span id="billTotal"></span></div>
          </div>
          <a class="link-back" href="cart.html">← Back to cart</a>
        </aside>
      </div>`;

    document.getElementById("summaryItems").innerHTML = items.map((e) => `
      <div class="summary-row">
        <span class="sr-qty">${e.qty}×</span>
        <span class="sr-name">${e.product.name}</span>
        <span class="sr-price">${Store.fmt(e.product.price * e.qty)}</span>
      </div>`).join("");

    const d = Store.deliveryFee();
    document.getElementById("billItems").textContent = Store.fmt(Store.itemTotal());
    document.getElementById("billDelivery").textContent = d === 0 ? "FREE" : Store.fmt(d);
    document.getElementById("billDiscount").textContent = "– " + Store.fmt(Store.discount());
    document.getElementById("billTotal").textContent = Store.fmt(Store.grandTotal());
    document.getElementById("confirmTotal").textContent = Store.fmt(Store.grandTotal());

    document.getElementById("checkoutForm").addEventListener("submit", placeOrder);
  }

  function placeOrder(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const items = Store.entries();
    const orderId = "#DPS" + String(Math.floor(1000 + Math.random() * 9000));
    const total = Store.grandTotal();
    const count = Store.count();

    Store.saveOrder({ id: orderId, total, count, pay: data.pay, name: data.name, at: Date.now() });
    Store.clearCart();
    renderSuccess({ orderId, total, count, name: data.name, pay: data.pay });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderSuccess(o) {
    root.innerHTML = `
      <div class="success-card">
        <div class="success-check">✓</div>
        <h2>Order Placed! 🎉</h2>
        <p>Thank you${o.name ? ", " + o.name.split(" ")[0] : ""}! Your pooja essentials are on the way.</p>
        <div class="success-meta">
          <div><span>Order ID</span><b>${o.orderId}</b></div>
          <div><span>Items</span><b>${o.count}</b></div>
          <div><span>Total paid</span><b>${Store.fmt(o.total)}</b></div>
          <div><span>Arriving in</span><b>12 mins</b></div>
        </div>
        <p class="success-pay">Payment: <b>${o.pay}</b></p>
        <a class="btn-primary block" href="index.html">Continue Shopping</a>
      </div>`;
  }

  renderForm();
})();
