/* ==========================================================================
   Quick view: a pop-up with a product's photos, full description and order
   button. Opens when a product card (or its name) is clicked.
   Closes with Esc, the close button, or a click outside it. While open,
   keyboard focus stays inside it.
   ========================================================================== */

(function () {
  let dialog = null;
  let opener = null; // the element to return focus to

  /* Details like colors/size/materials — only the ones that are filled in */
  function detailsHTML(product) {
    const rows = [
      ["colors", product.colors.join(", ")],
      ["size", product.size],
      ["materials", product.materials],
    ].filter(([, value]) => value);
    if (!rows.length) return "";
    return `<dl class="quickview__facts">${rows
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`)
      .join("")}</dl>`;
  }

  function thumbsHTML(product) {
    if (product.images.length < 2) return "";
    return `<div class="quickview__thumbs" role="group" aria-label="Photos">${product.images
      .map(
        (src, i) => `
          <button class="quickview__thumb" type="button" data-photo="${i}" aria-pressed="${i === 0}" aria-label="show photo ${i + 1} of ${product.images.length}">
            <img src="${escapeHTML(assetURL(src))}" alt="" width="160" height="200" loading="lazy" decoding="async" onerror="this.hidden = true">
          </button>`
      )
      .join("")}</div>`;
  }

  function render(product, collection) {
    const showNew = SHOW_NEW_BADGE && product.new;
    const [first] = product.images;

    dialog.className = `quickview accent-${collection.accent}`;
    dialog.innerHTML = `
      <div class="quickview__inner">
        <button class="quickview__close" type="button" aria-label="Close">${shapeSVG("close", "")}</button>

        <div class="quickview__gallery">
          <div class="quickview__main product-media">
            <div class="product-media__fallback" aria-hidden="true"><span>${escapeHTML(product.name)}</span></div>
            ${first ? `<img class="product-media__img" src="${escapeHTML(assetURL(first))}" alt="${escapeHTML(product.alt)}" width="800" height="1000" decoding="async" onerror="this.hidden = true">` : ""}
            ${showNew ? '<span class="badge badge--new">new</span>' : ""}
          </div>
          ${thumbsHTML(product)}
        </div>

        <div class="quickview__details">
          <div class="product-card__row">
            ${collectionTagHTML(collection)}
            <span class="product-card__status">${statusHTML(product)}${stockNoteHTML(product)}</span>
          </div>
          <h2 class="quickview__name" id="quickview-title">${escapeHTML(product.name)}</h2>
          <p class="price">${formatPrice(product.price)}</p>
          ${product.description ? `<p>${escapeHTML(product.description)}</p>` : ""}
          ${detailsHTML(product)}
          <div class="product-card__actions">${orderActionsHTML(product, collection)}</div>
        </div>
      </div>`;
  }

  function focusable() {
    return [...dialog.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")].filter(
      (el) => !el.hidden && el.offsetParent !== null
    );
  }

  function close() {
    if (!dialog.open) return;
    dialog.close();
  }

  function createDialog() {
    dialog = document.createElement("dialog");
    dialog.setAttribute("aria-labelledby", "quickview-title");
    document.body.appendChild(dialog);

    dialog.addEventListener("click", (event) => {
      // A click on the dim area outside the box lands on the <dialog> itself
      if (event.target === dialog || event.target.closest(".quickview__close")) {
        close();
        return;
      }

      // Thumbnails switch the main photo
      const thumb = event.target.closest("[data-photo]");
      if (thumb) {
        const product = dialog.product;
        const img = dialog.querySelector(".quickview__main .product-media__img");
        img.hidden = false;
        img.src = assetURL(product.images[Number(thumb.dataset.photo)]);
        dialog.querySelectorAll("[data-photo]").forEach((t) => t.setAttribute("aria-pressed", String(t === thumb)));
      }
    });

    // Keep Tab / Shift+Tab inside the pop-up
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });

    // Esc closes the dialog by itself; tidy up whichever way it closes
    const unlockScroll = () => document.documentElement.classList.remove("has-dialog");
    dialog.addEventListener("cancel", unlockScroll);
    dialog.addEventListener("close", () => {
      unlockScroll();
      if (opener && document.contains(opener)) opener.focus();
    });
  }

  function open(productId, trigger) {
    loadCatalog().then((catalog) => {
      const product = catalog.productById(productId);
      if (!product) return;
      if (!dialog) createDialog();

      opener = trigger;
      dialog.product = product;
      render(product, catalog.collectionOf(product));
      document.documentElement.classList.add("has-dialog");
      dialog.showModal();
      dialog.querySelector(".quickview__close").focus();
    });
  }

  // Open from the product name button, or from a click anywhere else on the card
  document.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card[data-product]");
    if (!card) return;
    const button = event.target.closest("[data-quickview]");
    // Let links and other buttons on the card (order, collection tag) do their own thing
    if (!button && event.target.closest("a, button")) return;
    open(card.dataset.product, card.querySelector("[data-quickview]"));
  });
})();
