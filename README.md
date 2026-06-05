# 🪔 Sri Sai Pooja Store

A **Zepto-style quick-commerce storefront** for a pooja (puja) essentials shop —
built as a clean, dependency-free demo to show clients. Browse authentic brass &
copper pooja items, add to cart, and place an order with a polished checkout flow.

## ✨ Features

A **multi-page** storefront (shared nav + cart across every page):

- **Home** (`index.html`) — hero, category chips, live search, product grid
- **Product detail** (`product.html?id=…`) — large image, price/savings, quantity stepper, perks, and "You may also like" related products
- **Cart** (`cart.html`) — line items with steppers, live bill breakdown (item total, delivery fee, 5% festive discount, free delivery over ₹499)
- **Checkout** (`checkout.html`) — delivery form, payment options (UPI / Card / COD), order summary, and an animated **Order Placed** confirmation with a generated order ID
- **About** (`about.html`) — brand story, highlights, stats
- **Contact** (`contact.html`) — store info + working message form

Plus:

- **Zepto-inspired UI** — saffron nav, `Add` buttons that turn into +/− steppers, sticky cart bar, cart badge
- **Persistent cart & order history** — saved to `localStorage`, shared across all pages
- **Fully responsive** — mobile and desktop
- **Zero build step** — plain HTML, CSS, and vanilla JS

## 🛍️ Products

13 real catalogue items with photos, including the Mariamman Kamatchi Vilakku,
Gajalakshmi Deepam, Panch Aarti set, engraved Kalash, copper Panchapatra set, and more.

## 🚀 Run locally

No installation needed — just open the site:

```bash
# Option 1: open directly
open index.html        # macOS
xdg-open index.html    # Linux

# Option 2: serve it (recommended, avoids any file:// restrictions)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## ▲ Deploy to Vercel

This is a static site — no build step — so Vercel serves it as-is.

**Option A · Dashboard (easiest)**
1. Push this repo to GitHub (already done).
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** the `Poojastore` repo.
3. Framework Preset: **Other** · Build Command: *(leave empty)* · Output Directory: `.` (root).
4. Click **Deploy** — you'll get a live `*.vercel.app` URL in seconds.

**Option B · Vercel CLI**
```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

The included [`vercel.json`](vercel.json) enables clean URLs and sets cache
headers (immutable caching for images, short cache for css/js).

## 📁 Structure

```
.
├── index.html              # Home (catalog)
├── product.html            # Product detail (reads ?id=)
├── cart.html               # Cart page
├── checkout.html           # Checkout + order confirmation
├── about.html              # About page
├── contact.html            # Contact page
├── css/styles.css          # all styling (theme, nav, cards, pages)
├── js/products.js          # product catalogue + categories (data)
├── js/store.js             # shared cart, totals, nav/footer/cart-bar, toast
├── js/home.js              # home page controller
├── js/product.js           # product detail controller
├── js/cart.js              # cart page controller
├── js/checkout.js          # checkout + place-order controller
├── assets/products/        # product photos
└── vercel.json             # Vercel static-hosting config
```

## 🎨 Customising

- **Add/edit products** → edit `js/products.js` (set `name`, `price`, `mrp`, `image`, `category`, `tag`)
- **Theme colours** → tweak the CSS variables at the top of `css/styles.css`
- **Delivery fee / discount** → constants at the top of `js/store.js`

---

> Demo storefront · prices and delivery times are illustrative.
