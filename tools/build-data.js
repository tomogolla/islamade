/* ==========================================================================
   Build the shop data from the catalog spreadsheet
   --------------------------------------------------------------------------
   Run this every time you change the spreadsheet or add product photos:

     node tools/build-data.js

   (or, to read a different file:  node tools/build-data.js "path/to/file.xlsx")

   It reads the "Products" and "Collections" sheets, finds each product's
   photos in assets/images/products, and rewrites:
     data/products.json
     data/collections.json
   Then it prints a short report: missing photos, unmatched photos, and
   photos that are large enough to slow the site down.

   Needs only Node (https://nodejs.org) — nothing to install.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { readWorkbook } = require("./read-xlsx");

const ROOT = path.join(__dirname, "..");
const SPREADSHEET = process.argv[2] || path.join(ROOT, "data", "isla_s_catalouge.xlsx");
const PRODUCT_IMAGES = "assets/images/products";
const COLLECTION_IMAGES = "assets/images/collections";
const COLLECTION_COPY = path.join(__dirname, "collection-copy.json");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const COVER_EXTENSIONS = [".jpg", ".png", ".webp"];
const ACCENTS = ["periwinkle", "lavender", "pink", "butter", "mint"];
const SHAPES = ["fan", "sprig", "circle", "palm", "starburst", "arch", "leaf"];
const STATUSES = ["available", "made to order", "sold out"];
const LARGE_FILE_BYTES = 400 * 1024;
const LARGE_WIDTH_PX = 2000;

const warnings = [];
const warn = (message) => warnings.push(message);

/* ---------- Small helpers ---------- */

/* "Lily of the Valley Charm" → "lily-of-the-valley-charm" */
function makeId(name) {
  return String(name).trim().toLowerCase().replace(/\s+/g, "-");
}

/* For matching file names: ignore case, and treat spaces, hyphens and underscores alike */
function normalize(text) {
  return String(text).trim().toLowerCase().replace(/[\s_-]+/g, "-").replace(/^-|-$/g, "");
}

function text(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function yes(value) {
  return ["yes", "y", "true", "1"].includes(text(value).toLowerCase());
}

function list(value) {
  return text(value)
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/* Turns a sheet into objects keyed by its header row, skipping empty rows */
function sheetToObjects(rows, sheetName, requiredHeader) {
  if (!rows) throw new Error(`The spreadsheet has no "${sheetName}" sheet.`);
  const headers = (rows[0] || []).map((cell) => text(cell && cell.value).toLowerCase());
  const objects = [];

  rows.slice(1).forEach((row, i) => {
    if (!row) return;
    const object = { _row: i + 2 };
    headers.forEach((header, col) => {
      if (header) object[header] = row[col] ? row[col].value : null; // unnamed columns are ignored
    });
    if (text(object[requiredHeader])) objects.push(object);
  });
  return objects;
}

/* Reads width/height from the start of a JPEG, PNG or WebP file */
function imageWidth(file) {
  const b = fs.readFileSync(file);
  if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") return b.readUInt32BE(16);
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return 1 + b.readUIntLE(24, 3);
    if (chunk === "VP8L") return 1 + (b.readUInt16LE(21) & 0x3fff);
    if (chunk === "VP8 ") return b.readUInt16LE(26) & 0x3fff;
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return b.readUInt16BE(i + 7);
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null; // unknown (e.g. AVIF)
}

/* Classic edit distance, used only to spot likely typos */
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

/* ---------- Image files on disk ---------- */

function listImages(folder, extensions) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => extensions.includes(path.extname(file).toLowerCase()))
    .map((file) => ({
      file,
      webPath: `${folder}/${file}`,
      key: normalize(path.basename(file, path.extname(file))),
      fullPath: path.join(dir, file),
    }));
}

/* Photos for a product: <id>.<ext>, then <id>-1, <id>-2 … in number order */
function imagesFor(id, images, used) {
  const pattern = new RegExp(`^${normalize(id).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-(\\d+))?$`);
  return images
    .map((image) => ({ image, match: image.key.match(pattern) }))
    .filter(({ match }) => match)
    .sort((a, b) => Number(a.match[1] || 0) - Number(b.match[1] || 0))
    .map(({ image }) => {
      used.add(image.file);
      return image.webPath;
    });
}

/* ---------- Build ---------- */

function build() {
  if (!fs.existsSync(SPREADSHEET)) {
    throw new Error(`Can't find the spreadsheet at ${SPREADSHEET}`);
  }

  const workbook = readWorkbook(SPREADSHEET);
  const productRows = sheetToObjects(workbook.Products, "Products", "item name");
  const collectionRows = sheetToObjects(workbook.Collections, "Collections", "id");
  const copy = fs.existsSync(COLLECTION_COPY) ? JSON.parse(fs.readFileSync(COLLECTION_COPY, "utf8")) : {};

  const productImages = listImages(PRODUCT_IMAGES, IMAGE_EXTENSIONS);
  const coverImages = listImages(COLLECTION_IMAGES, COVER_EXTENSIONS);
  const usedImages = new Set();

  /* Products */
  const seenIds = new Set();
  const products = productRows.map((row) => {
    const name = text(row["item name"]);
    const id = text(row["id (auto)"]) || makeId(name); // the formula may have no saved value
    if (seenIds.has(id)) warn(`Products row ${row._row}: the id "${id}" is used twice. Give one of the items a different name.`);
    seenIds.add(id);

    const price = Number(row["price (ksh)"]);
    if (!Number.isFinite(price)) warn(`Products row ${row._row} (${name}): price "${text(row["price (ksh)"])}" isn't a number.`);

    let status = text(row["status"]).toLowerCase() || "available";
    if (!STATUSES.includes(status)) {
      warn(`Products row ${row._row} (${name}): status "${status}" should be one of: ${STATUSES.join(", ")}. Using "available".`);
      status = "available";
    }

    const stockText = text(row["stock qty"]);
    const stock = stockText === "" ? null : Number(stockText);

    const images = imagesFor(id, productImages, usedImages);

    // Optional extra photo named in the "Image 2 filename" column
    const extra = text(row["image 2 filename"]);
    if (extra) {
      const key = normalize(path.basename(extra, path.extname(extra)));
      const found = productImages.find((image) => image.key === key);
      if (!found) warn(`Products row ${row._row} (${name}): "Image 2 filename" is "${extra}", but there's no such file in ${PRODUCT_IMAGES}.`);
      else if (!images.includes(found.webPath)) {
        images.splice(1, 0, found.webPath);
        usedImages.add(found.file);
      }
    }

    return {
      id,
      name,
      price: Number.isFinite(price) ? price : null,
      collection: text(row["collection"]),
      shortDescription: text(row["short description"]),
      description: text(row["description"]),
      status,
      new: yes(row["new?"]),
      featured: yes(row["featured?"]),
      colors: list(row["colors available"]),
      size: text(row["size"]),
      materials: text(row["materials"]),
      stock: Number.isFinite(stock) ? stock : null,
      images,
      alt: text(row["image alt text"]) || `${name}, handmade crochet`,
    };
  });

  /* Collections */
  const collections = collectionRows.map((row, index) => {
    const id = text(row["id"]);
    const override = copy[id] || {};
    const pick = (field, sheetValue) => (override[field] !== undefined ? override[field] : sheetValue);

    const accent = pick("accent", text(row["accent color"]).toLowerCase());
    const shape = pick("shape", SHAPES[index % SHAPES.length]);
    if (!ACCENTS.includes(accent)) warn(`Collection "${id}": accent "${accent}" should be one of: ${ACCENTS.join(", ")}.`);

    const inCollection = products.filter((p) => p.collection === id);
    const cover = coverImages.find((image) => image.key === normalize(`${id}-cover`));
    const firstPhoto = inCollection.find((p) => p.images.length);

    return {
      id,
      name: pick("name", text(row["name"])),
      tagline: pick("tagline", text(row["tagline"])),
      description: pick("description", text(row["description"])),
      accent: ACCENTS.includes(accent) ? accent : "butter",
      shape: SHAPES.includes(shape) ? shape : "sprig",
      featured: yes(row["featured on home?"]),
      cover: cover ? cover.webPath : firstPhoto ? firstPhoto.images[0] : "",
      items: inCollection.length,
    };
  });

  const collectionIds = new Set(collections.map((c) => c.id));
  products.forEach((p) => {
    if (!collectionIds.has(p.collection)) {
      warn(`Product "${p.name}" is in collection "${p.collection}", which isn't on the Collections sheet.`);
    }
  });

  /* Write the JSON files */
  const note = "Made automatically from the catalog spreadsheet by tools/build-data.js. Don't edit this file by hand: change the spreadsheet (or tools/collection-copy.json) and run `node tools/build-data.js` again.";
  fs.writeFileSync(path.join(ROOT, "data", "products.json"), JSON.stringify({ _help: note, products }, null, 2) + "\n");
  fs.writeFileSync(path.join(ROOT, "data", "collections.json"), JSON.stringify({ _help: note, collections }, null, 2) + "\n");

  /* Report */
  const line = (s = "") => console.log(s);
  line(`✔ Read ${path.relative(ROOT, SPREADSHEET)}`);
  line(`✔ Wrote data/products.json (${products.length} products) and data/collections.json (${collections.length} collections)`);
  line();

  line("Collections:");
  collections.forEach((c) => {
    const state = c.items ? `${c.items} ${c.items === 1 ? "product" : "products"}` : "EMPTY: hidden on the site until a product is added";
    line(`  ${c.featured ? "★" : "·"} ${c.name.padEnd(18)} ${state}${c.cover ? "" : c.items ? " (no cover photo yet)" : ""}`);
  });
  line();

  const noImage = products.filter((p) => !p.images.length);
  line(`Products with no photo (${noImage.length}):`);
  noImage.forEach((p) => line(`  - ${p.name}  → add ${PRODUCT_IMAGES}/${p.id}-1.jpg`));
  line();

  const unmatched = productImages.filter((image) => !usedImages.has(image.file));
  line(`Photos that didn't match any product (${unmatched.length}):`);
  unmatched.forEach((image) => {
    const base = image.key.replace(/-\d+$/, "");
    const near = products.find((p) => image.key.startsWith(`${normalize(p.id)}-`) || distance(base, normalize(p.id)) <= 2);
    line(`  - ${image.file}${near ? `   (maybe "${near.name}"? rename to ${near.id}-N${path.extname(image.file)} if so)` : ""}`);
  });
  line();

  const large = productImages
    .map((image) => ({ ...image, bytes: fs.statSync(image.fullPath).size, width: imageWidth(image.fullPath) }))
    .filter((image) => image.bytes > LARGE_FILE_BYTES || image.width > LARGE_WIDTH_PX);
  line(`Large photos that may slow the site down (over ${LARGE_FILE_BYTES / 1024} KB or ${LARGE_WIDTH_PX} px wide) (${large.length}):`);
  large.forEach((image) => line(`  - ${image.file}  ${Math.round(image.bytes / 1024)} KB${image.width ? `, ${image.width} px wide` : ""}`));

  if (warnings.length) {
    line();
    line(`⚠ Please check (${warnings.length}):`);
    warnings.forEach((w) => line(`  - ${w}`));
  }
}

try {
  build();
} catch (error) {
  console.error(`✖ ${error.message}`);
  process.exit(1);
}
