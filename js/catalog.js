/* ==========================================================================
   Catalog: loads collections & products from /data and builds their cards
   --------------------------------------------------------------------------
   You normally don't need to edit this file. The data comes from the catalog
   spreadsheet: change it, then run `node tools/build-data.js` (see README).
   ========================================================================== */

/* The palette colors a collection can use as its "accent" */
const ACCENTS = ["periwinkle", "lavender", "pink", "butter", "mint"];

/* Placeholder picture for collections that don't have a photo yet */
const PLACEHOLDER_IMAGE = "assets/images/placeholders/yarn-lavender.svg";

/* Used when a product points to a collection that doesn't exist */
const FALLBACK_COLLECTION = {
  id: "",
  name: "more handmade pieces",
  tagline: "",
  description: "",
  cover: "",
  accent: "butter",
  shape: "circle",
  featured: false,
  missing: true,
};

/* Words shown for each product status */
const STATUS_LABELS = {
  "available": "available",
  "made to order": "made to order",
  "sold out": "sold out",
};

/* "only N left" is shown when stock is this low (but not zero) */
const LOW_STOCK = 3;

/* ---------- Small helpers ---------- */

/* Makes text safe to put inside HTML */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Turns a path from the JSON files into a working URL from this page.
   File names may contain spaces, so they're URL-encoded. */
function assetURL(path) {
  if (!path) return ROOT + PLACEHOLDER_IMAGE;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return ROOT + encodeURI(path.replace(/^\//, ""));
}

/* 1800 → "KSh 1,800" */
function formatPrice(price) {
  const amount = Number(price);
  if (price === null || price === "" || !Number.isFinite(amount)) return "";
  return `${SITE.currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function pageURL(page, params = "") {
  return `${ROOT}pages/${page}${params}`;
}

function piecesLabel(count) {
  return `${count} ${count === 1 ? "piece" : "pieces"}`;
}

/* A stock of 0 counts as sold out, whatever the status says */
function statusOf(product) {
  return product.stock === 0 ? "sold out" : product.status;
}

/* "only 2 left" when stock is 1–3, otherwise nothing */
function stockNoteHTML(product) {
  const { stock } = product;
  if (statusOf(product) === "sold out" || stock === null || stock < 1 || stock > LOW_STOCK) return "";
  return `<span class="stock-note">only ${stock} left</span>`;
}

/* ---------- Loading the data ---------- */

async function fetchJSON(path) {
  const response = await fetch(ROOT + path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}

function cleanCollection(raw) {
  const collection = { ...FALLBACK_COLLECTION, ...raw, missing: false };
  if (!ACCENTS.includes(collection.accent)) {
    console.warn(`[islamade] Collection "${collection.id}" has accent "${raw.accent}". Use one of: ${ACCENTS.join(", ")}. Using "butter" for now.`);
    collection.accent = "butter";
  }
  if (!SHAPE_NAMES.includes(collection.shape)) collection.shape = "sprig";
  return collection;
}

function cleanProduct(raw) {
  return {
    shortDescription: "",
    description: "",
    images: [],
    colors: [],
    size: "",
    materials: "",
    stock: null,
    status: "available",
    new: false,
    alt: "",
    ...raw,
  };
}

let catalogPromise = null;

/* Loads both JSON files once and returns the catalog:
   - collections:        every collection, in spreadsheet order
   - visibleCollections: only collections that have at least one product
   - products:           every product, in spreadsheet order */
function loadCatalog() {
  if (catalogPromise) return catalogPromise;

  catalogPromise = Promise.all([fetchJSON("data/collections.json"), fetchJSON("data/products.json")]).then(
    ([collectionData, productData]) => {
      const collections = (collectionData.collections || []).map(cleanCollection);
      const products = (productData.products || []).map(cleanProduct);
      const byId = new Map(collections.map((c) => [c.id, c]));
      const productsIn = (id) => products.filter((p) => p.collection === id);

      // Every product must belong to exactly one existing collection
      products.forEach((product) => {
        if (!byId.has(product.collection)) {
          console.warn(
            `[islamade] Product "${product.id}" belongs to collection "${product.collection}", which isn't in data/collections.json. ` +
              `It will be shown under "${FALLBACK_COLLECTION.name}" until you fix its collection in the spreadsheet.`
          );
        }
        if (!STATUS_LABELS[product.status]) {
          console.warn(`[islamade] Product "${product.id}" has status "${product.status}". Use "available", "made to order" or "sold out".`);
          product.status = "available";
        }
      });

      // Empty collections stay hidden until a product is added to them
      const visibleCollections = collections.filter((c) => productsIn(c.id).length > 0);
      const visibleIds = new Set(visibleCollections.map((c) => c.id));

      return {
        collections,
        visibleCollections,
        products,
        collectionById: (id) => byId.get(id),
        isVisible: (id) => visibleIds.has(id),
        collectionOf: (product) => byId.get(product.collection) || FALLBACK_COLLECTION,
        productsIn,
        productById: (id) => products.find((p) => p.id === id),
      };
    }
  );

  return catalogPromise;
}

/* Friendly message when the data files can't be loaded */
function showLoadError(container, error) {
  console.error(error);
  const offline = window.location.protocol === "file:";
  container.innerHTML = `
    <div class="notice" role="alert">
      <h2>oops, the yarn got tangled</h2>
      <p>${
        offline
          ? "The shop data can't load when this page is opened straight from your computer. Preview the site with a local server instead (see “Preview locally” in README.md)."
          : "We couldn't load the shop right now. Please refresh the page, or come back in a little while."
      }</p>
    </div>`;
}

/* ---------- Pictures ---------- */

/* An <img> that hides itself if the file is missing, uncovering the
   soft colored block with the product name that sits behind it. */
function photoHTML(src, alt, className) {
  return `<img class="${className}" src="${escapeHTML(assetURL(src))}" alt="${escapeHTML(alt)}" width="800" height="1000" loading="lazy" decoding="async" onerror="this.hidden = true">`;
}

/* Product photo area: soft block with the name (shown when there's no photo),
   the first photo, and — on desktop — the second photo, shown on hover */
function productMediaHTML(product) {
  const [first, second] = product.images;
  return `
    <div class="product-media__fallback" aria-hidden="true"><span>${escapeHTML(product.name)}</span></div>
    ${first ? photoHTML(first, product.alt, "product-media__img") : ""}
    ${second ? photoHTML(second, "", "product-media__img product-media__img--hover") : ""}`;
}

/* A collection cover, masked into the blob shape. Falls back to a placeholder. */
function coverHTML(collection, alt = "") {
  const fallback = ROOT + PLACEHOLDER_IMAGE;
  return `<img class="blob-mask" src="${escapeHTML(assetURL(collection.cover))}" alt="${escapeHTML(alt)}" width="600" height="600" loading="lazy" decoding="async"
    onerror="if (!this.dataset.failed) { this.dataset.failed = '1'; this.src = '${fallback}'; }">`;
}

/* ---------- Ordering ---------- */

/* WhatsApp button (or sold-out alternative) for a product */
function orderActionsHTML(product, collection) {
  const name = escapeHTML(product.name);
  const price = formatPrice(product.price);
  const pricePart = price ? ` (${price})` : "";
  const fromCollection = collection.missing ? "" : ` from the ${collection.name} collection`;

  if (statusOf(product) === "sold out") {
    const message = `Hi islamade! I saw that the "${product.name}"${pricePart}${fromCollection} is sold out. Could you make one to order for me?`;
    return `
      <button class="btn" type="button" disabled>${shapeSVG("whatsapp", "")}order via whatsapp</button>
      <a class="text-link" href="${whatsappLink(message)}" target="_blank" rel="noopener noreferrer">ask about a made-to-order version<span class="sr-only"> of ${name} (opens WhatsApp)</span></a>`;
  }

  const question = statusOf(product) === "made to order" ? "Could you make one for me?" : "Is it still available?";
  const message = `Hi islamade! I'd love to order the "${product.name}"${pricePart}${fromCollection}. ${question}`;
  return `
    <a class="btn" href="${whatsappLink(message)}" target="_blank" rel="noopener noreferrer">${shapeSVG("whatsapp", "")}order via whatsapp<span class="sr-only">: ${name} (opens WhatsApp)</span></a>`;
}

/* ---------- Cards ---------- */

function collectionTagHTML(collection) {
  return collection.missing
    ? `<span class="tag">${escapeHTML(collection.name)}</span>`
    : `<a class="tag" href="${pageURL("collection.html", `?c=${encodeURIComponent(collection.id)}`)}">${escapeHTML(collection.name)}<span class="sr-only"> collection</span></a>`;
}

function statusHTML(product) {
  const status = statusOf(product);
  return `<span class="status status--${status.replace(/\s+/g, "-")}">${STATUS_LABELS[status]}</span>`;
}

function collectionCardHTML(collection, count) {
  return `
    <a class="collection-card playful accent-${collection.accent}" href="${pageURL("collection.html", `?c=${encodeURIComponent(collection.id)}`)}">
      <span class="plus" aria-hidden="true">${shapeSVG("plus", "")}</span>
      ${collection.featured ? '<span class="badge">featured</span>' : ""}
      <div class="collection-card__media">${coverHTML(collection)}</div>
      ${shapeSVG(collection.shape)}
      <h2 class="collection-card__name">${escapeHTML(collection.name)}</h2>
      <p class="collection-card__tagline">${escapeHTML(collection.tagline)}</p>
      <p class="collection-card__count">${piecesLabel(count)}</p>
    </a>`;
}

/* Product card. Clicking the card (or its name) opens the quick view. */
function productCardHTML(product, collection) {
  const showNew = SHOW_NEW_BADGE && product.new;
  return `
    <article class="product-card accent-${collection.accent}" data-product="${escapeHTML(product.id)}">
      <div class="product-card__media product-media">
        ${productMediaHTML(product)}
        ${showNew ? '<span class="badge badge--new">new</span>' : ""}
      </div>
      <div class="product-card__body">
        <div class="product-card__row">
          ${collectionTagHTML(collection)}
          <span class="product-card__status">${statusHTML(product)}${stockNoteHTML(product)}</span>
        </div>
        <div class="product-card__row product-card__row--top">
          <h3 class="product-card__name">
            <button class="product-card__open" type="button" data-quickview="${escapeHTML(product.id)}" aria-haspopup="dialog">${escapeHTML(product.name)}</button>
          </h3>
          <span class="price">${formatPrice(product.price)}</span>
        </div>
        ${product.shortDescription ? `<p class="product-card__desc">${escapeHTML(product.shortDescription)}</p>` : ""}
        ${product.colors.length ? `<p class="product-card__colors"><strong>colors:</strong> ${product.colors.map(escapeHTML).join(", ")}</p>` : ""}
        <div class="product-card__actions">${orderActionsHTML(product, collection)}</div>
      </div>
    </article>`;
}
