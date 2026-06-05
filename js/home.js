/* ===== Home page · catalog, categories, search ===== */
(function () {
  "use strict";
  Store.initChrome({ active: "home" });

  let activeCategory = "All";
  let searchTerm = new URLSearchParams(location.search).get("q") || "";

  const grid = document.getElementById("productGrid");
  const catBar = document.getElementById("categoryBar");
  const title = document.getElementById("catalogTitle");
  const countEl = document.getElementById("catalogCount");
  const empty = document.getElementById("emptyState");

  // Reflect any ?q= into the nav search box.
  const navSearch = document.querySelector(".nav-search input");
  if (navSearch && searchTerm) navSearch.value = searchTerm;
  if (navSearch) {
    navSearch.addEventListener("input", (e) => { searchTerm = e.target.value; renderProducts(); });
    // keep it on-page instead of submitting/reloading
    navSearch.closest("form").addEventListener("submit", (e) => { e.preventDefault(); renderProducts(); });
  }

  function renderCategories() {
    catBar.innerHTML = Store.CATEGORIES().map((c) => `
      <button class="cat-chip ${c.name === activeCategory ? "active" : ""}" data-cat="${c.name}">
        <span class="cat-icon">${c.icon}</span><span>${c.name}</span>
      </button>`).join("");
    catBar.querySelectorAll(".cat-chip").forEach((chip) =>
      chip.addEventListener("click", () => {
        activeCategory = chip.dataset.cat;
        renderCategories(); renderProducts();
        window.scrollTo({ top: catBar.offsetTop - 70, behavior: "smooth" });
      }));
  }

  function filtered() {
    const q = searchTerm.trim().toLowerCase();
    return Store.PRODUCTS().filter((p) => {
      const okCat = activeCategory === "All" || p.category === activeCategory;
      const okQ = !q || p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }

  function renderProducts() {
    const list = filtered();
    title.textContent = searchTerm.trim()
      ? `Results for “${searchTerm.trim()}”`
      : (activeCategory === "All" ? "All Products" : activeCategory);
    countEl.textContent = list.length ? `${list.length} items` : "";
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(Store.cardHTML).join("");
    list.forEach((p) => {
      const slot = grid.querySelector(`[data-slot="${p.id}"]`);
      Store.mountAction(slot, p.id);
    });
  }

  renderCategories();
  renderProducts();
})();
