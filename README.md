# 🪔 Divya Pooja Store

A **Zepto-style quick-commerce storefront** for a pooja (puja) essentials shop —
built as a clean, dependency-free demo to show clients. Browse authentic brass &
copper pooja items, add to cart, and place an order with a polished checkout flow.

## ✨ Features

- **Zepto-inspired UI** — sticky saffron header with delivery-time pill, location, and live search
- **Category chips** — filter by Lamps & Diyas, Aarti Sets, Kalash & Lota, Thali, Kumkum, Ritual Essentials
- **Product cards** — real product photos, ratings, MRP/discount badges, and an `Add` button that turns into a +/− quantity stepper
- **Cart** — sliding cart drawer, bill breakdown (item total, delivery fee, festive discount, free delivery over ₹499), and a sticky bottom cart bar
- **Checkout & Place Order** — delivery details form, payment options (UPI / Card / COD), and an animated order-success confirmation with a generated order ID
- **Persistent cart** — saved to `localStorage`, survives page reloads
- **Fully responsive** — looks great on mobile and desktop
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
├── index.html              # markup & layout
├── css/styles.css          # all styling (theme, cards, drawer, modals)
├── js/products.js          # product catalogue + categories
├── js/app.js               # cart, filtering, checkout & order logic
├── assets/products/        # product photos
└── vercel.json             # Vercel static-hosting config
```

## 🎨 Customising

- **Add/edit products** → edit `js/products.js` (set `name`, `price`, `mrp`, `image`, `category`, `tag`)
- **Theme colours** → tweak the CSS variables at the top of `css/styles.css`
- **Delivery fee / discount** → constants at the top of `js/app.js`

---

> Demo storefront · prices and delivery times are illustrative.
