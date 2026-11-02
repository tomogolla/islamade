/* Single collection page: pages/collection.html?c=<collection-id>
   One template that shows any collection from data/collections.json.
   Collections with no products are treated as "not found" until a product
   is added, so there are never empty pages. */

(function () {
  const root = document.getElementById("collection-root");
  const id = getParam("c");

  /* Updates the <title> and description so shared links look right */
  function setPageInfo(title, description) {
    document.title = `${title} · ${SITE.name}`;
    const set = (selector, value) => document.querySelector(selector)?.setAttribute("content", value);
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', document.title);
    set('meta[property="og:description"]', description);
  }

  function renderNotFound() {
    setPageInfo("collection not found", "This collection couldn't be found. Browse all islamade crochet collections.");
    root.innerHTML = `
      <div class="notice">
        <h1>hmm, that collection slipped off the hook</h1>
        <p>We couldn't find ${id ? `a collection called “${escapeHTML(id)}”` : "that collection"}. It may be waiting for new pieces, or it may have been renamed.</p>
        <a class="btn" href="${pageURL("collections.html")}">see all collections</a>
      </div>`;
  }

  function pagerLinkHTML(collection, direction) {
    const isNext = direction === "next";
    return `
      <a class="pager__link pager__link--${direction} playful accent-${collection.accent}" href="${pageURL("collection.html", `?c=${encodeURIComponent(collection.id)}`)}">
        <span class="pager__label">${isNext ? "next collection →" : "← previous collection"}</span>
        <span class="pager__name">${escapeHTML(collection.name)}</span>
      </a>`;
  }

  loadCatalog()
    .then((catalog) => {
      // Only collections with products can be shown (and linked to with prev / next)
      const list = catalog.visibleCollections;
      const index = list.findIndex((c) => c.id === id);

      if (index === -1) {
        if (id && catalog.collectionById(id)) console.info(`[islamade] Collection "${id}" has no products yet, so it's hidden.`);
        else if (id) console.warn(`[islamade] No collection with id "${id}" in data/collections.json.`);
        renderNotFound();
        return;
      }

      const collection = list[index];
      const products = catalog.productsIn(collection.id);
      setPageInfo(collection.name, collection.tagline || collection.description);

      // Previous / next wrap around, so the last collection links back to the first
      let pager = "";
      if (list.length > 1) {
        const prev = list[(index - 1 + list.length) % list.length];
        const next = list[(index + 1) % list.length];
        pager = `
          <nav class="section" aria-label="More collections">
            <div class="pager">
              ${pagerLinkHTML(prev, "prev")}
              ${next !== prev ? pagerLinkHTML(next, "next") : ""}
            </div>
          </nav>`;
      }

      const productGrid = products.map((p) => productCardHTML(p, collection)).join("");

      root.innerHTML = `
        <p class="breadcrumb"><a class="text-link" href="${pageURL("collections.html")}">collections</a> / ${escapeHTML(collection.name)}</p>

        <section class="collection-hero accent-${collection.accent}" aria-labelledby="collection-title">
          ${shapeSVG(collection.shape)}
          <div class="collection-hero__text">
            <span class="eyebrow">collection · ${piecesLabel(products.length)}</span>
            <h1 id="collection-title">${escapeHTML(collection.name)}</h1>
            <p class="collection-hero__tagline">${escapeHTML(collection.tagline)}</p>
            <p>${escapeHTML(collection.description)}</p>
            <div class="collection-hero__actions">
              <a class="btn" href="${pageURL("shop.html", `?collection=${encodeURIComponent(collection.id)}`)}">see it in the shop</a>
              <a class="text-link" href="${pageURL("custom.html", `?inspired=${encodeURIComponent(collection.id)}`)}">request a custom piece like these</a>
            </div>
          </div>
          <div class="collection-hero__media">
            ${coverHTML(collection, `${collection.name} collection`)}
          </div>
        </section>

        <section class="section" aria-labelledby="pieces-title">
          <h2 id="pieces-title">the pieces</h2>
          <div class="product-grid">${productGrid}</div>
        </section>

        ${pager}`;
    })
    .catch((error) => showLoadError(root, error));
})();
