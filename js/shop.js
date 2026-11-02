/* Shop page: every product in one grid, with a filter chip per collection.
   Link to pages/shop.html?collection=<id> to open with a filter selected.
   Collections with no products don't get a chip. */

(function () {
  const chipsEl = document.getElementById("filter-chips");
  const summaryEl = document.getElementById("results-summary");
  const grid = document.getElementById("product-grid");

  loadCatalog()
    .then((catalog) => {
      let active = "all";

      // Pre-select a collection from the URL, e.g. ?collection=tiny-treasures
      const requested = getParam("collection");
      if (requested && catalog.isVisible(requested)) {
        active = requested;
      } else if (requested) {
        console.warn(`[islamade] ?collection=${requested} doesn't match a collection with products. Showing everything.`);
      }

      // One chip for "all", plus one per collection that has products, with counts
      chipsEl.innerHTML = [
        `<button class="chip" type="button" data-filter="all">all (${catalog.products.length})</button>`,
        ...catalog.visibleCollections.map(
          (c) =>
            `<button class="chip accent-${c.accent}" type="button" data-filter="${escapeHTML(c.id)}">${escapeHTML(c.name)} (${catalog.productsIn(c.id).length})</button>`
        ),
      ].join("");

      function render() {
        chipsEl.querySelectorAll("[data-filter]").forEach((chip) => {
          chip.setAttribute("aria-pressed", String(chip.dataset.filter === active));
        });

        const products = active === "all" ? catalog.products : catalog.productsIn(active);
        const collection = catalog.collectionById(active);

        summaryEl.textContent =
          active === "all"
            ? `showing all ${piecesLabel(products.length)}`
            : `showing ${piecesLabel(products.length)} from ${collection.name}`;

        grid.innerHTML = products.map((p) => productCardHTML(p, catalog.collectionOf(p))).join("");
      }

      chipsEl.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-filter]");
        if (!chip) return;
        active = chip.dataset.filter;

        // Keep the URL in sync so filtered views can be shared
        const url = new URL(window.location.href);
        if (active === "all") url.searchParams.delete("collection");
        else url.searchParams.set("collection", active);
        history.replaceState(null, "", url);

        render();
      });

      render();
    })
    .catch((error) => {
      chipsEl.innerHTML = "";
      summaryEl.textContent = "";
      showLoadError(grid, error);
    });
})();
