/* Collections page: shows every collection that has at least one product.
   Featured collections are shown first. Empty collections stay hidden. */

(function () {
  const grid = document.getElementById("collection-grid");

  loadCatalog()
    .then((catalog) => {
      const sorted = [...catalog.visibleCollections].sort((a, b) => Number(b.featured) - Number(a.featured));

      if (!sorted.length) {
        grid.innerHTML = `<p class="empty-state">New collections are on the hook — check back soon!</p>`;
        return;
      }

      grid.innerHTML = sorted.map((c) => collectionCardHTML(c, catalog.productsIn(c.id).length)).join("");
    })
    .catch((error) => showLoadError(grid, error));
})();
