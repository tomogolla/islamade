/* ==========================================================================
   Decorative shapes & icons
   --------------------------------------------------------------------------
   Each shape is drawn once here and added to the page as a hidden SVG
   "sprite". Anywhere on the site you can then show a shape with:

     <svg class="shape" aria-hidden="true"><use href="#shape-sprig"></use></svg>

   Shapes are drawn in "currentColor", so their color is set with CSS.
   Shapes:  fan, sprig, circle, palm, starburst, arch, leaf, dashes
   Icons:   plus, menu, close, instagram, youtube, whatsapp, mail, arrow-left, arrow-right
   ========================================================================== */

/* Small helpers that build repeating parts of a few shapes */
function fanPetals() {
  const lengths = [52, 66, 74, 64, 50];
  return [-58, -29, 0, 29, 58]
    .map((angle, i) => {
      const L = lengths[i];
      const tip = 90 - L;
      return `<path d="M50 90C40 ${90 - L * 0.35} 42 ${90 - L * 0.8} 50 ${tip}C58 ${90 - L * 0.8} 60 ${90 - L * 0.35} 50 90Z" transform="rotate(${angle} 50 90)"/>`;
    })
    .join("");
}

function leafPath(x, y, rotate, scale) {
  return `<path d="M0-26C12-12 12 12 0 26C-12 12-12-12 0-26Z" transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})"/>`;
}

function starRays() {
  let rays = "";
  for (let i = 0; i < 18; i++) {
    const a = (i * 20 * Math.PI) / 180;
    const r = i % 2 ? 33 : 44;
    const x1 = (50 + 7 * Math.cos(a)).toFixed(1);
    const y1 = (50 + 7 * Math.sin(a)).toFixed(1);
    const x2 = (50 + r * Math.cos(a)).toFixed(1);
    const y2 = (50 + r * Math.sin(a)).toFixed(1);
    rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  return rays;
}

const SHAPES = {
  // Big decorative shapes (viewBox 0 0 100 100)
  fan: `<g fill="currentColor">${fanPetals()}</g>`,

  sprig: `<g fill="currentColor">${leafPath(37, 30, -16, 1)}${leafPath(68, 46, 24, 0.82)}${leafPath(38, 74, -60, 0.92)}</g>`,

  circle: `<path d="M52 11C75 11 90 28 89 51C88 74 71 90 49 89C26 88 10 72 11 49C12 27 29 12 55 13" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>`,

  palm: `<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
      <path d="M28 94Q46 52 76 8"/>
      <path d="M34 80Q22 74 14 64M39 69Q26 60 19 48M45 57Q33 46 28 33M52 45Q42 33 39 20M59 33Q52 22 51 10"/>
      <path d="M34 80Q46 84 56 82M39 69Q53 71 63 66M45 57Q59 56 69 50M52 45Q65 42 74 34M59 33Q70 29 77 21"/>
    </g>`,

  starburst: `<g stroke="currentColor" stroke-width="5" stroke-linecap="round">${starRays()}</g>`,

  arch: `<path d="M25 94L27 52C28 26 40 13 52 12C66 11 75 24 75 44L77 94" fill="none" stroke="currentColor" stroke-width="12" stroke-linejoin="round"/>`,

  leaf: `<g fill="currentColor">${leafPath(50, 50, 35, 1.6)}</g>`,

  dashes: `<g stroke="currentColor" stroke-width="8" stroke-linecap="round">
      <path d="M10 34l9-9M36 34l9-9M62 34l9-9M23 62l9-9M49 62l9-9M75 62l9-9"/>
    </g>`,

  // Small icons (viewBox 0 0 24 24)
  plus: { viewBox: "0 0 24 24", body: `<path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>` },
  menu: { viewBox: "0 0 24 24", body: `<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>` },
  close: { viewBox: "0 0 24 24", body: `<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>` },
  instagram: { viewBox: "0 0 24 24", body: `<g fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></g><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/>` },
  youtube: { viewBox: "0 0 24 24", body: `<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor"/>` },
  whatsapp: { viewBox: "0 0 24 24", body: `<path d="M4.5 20l1.2-3.8A8.5 8.5 0 1 1 9 19.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8.5c0 3.2 2.8 6.3 6 6.5l1.2-1.6-2-1-1 .9c-1-.4-2.1-1.5-2.5-2.5l.9-1-1-2z" fill="currentColor"/>` },
  mail: { viewBox: "0 0 24 24", body: `<rect x="3" y="5.5" width="18" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 7.5l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>` },
  "arrow-left": { viewBox: "0 0 24 24", body: `<path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` },
  "arrow-right": { viewBox: "0 0 24 24", body: `<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` },
};

/* Names a collection may use for its "shape" in data/collections.json */
const SHAPE_NAMES = ["fan", "sprig", "circle", "palm", "starburst", "arch", "leaf"];

/* Adds the hidden sprite with every shape to the page (runs once, on load). */
function injectShapeSprite() {
  const symbols = Object.entries(SHAPES)
    .map(([name, def]) => {
      const viewBox = typeof def === "string" ? "0 0 100 100" : def.viewBox;
      const body = typeof def === "string" ? def : def.body;
      return `<symbol id="shape-${name}" viewBox="${viewBox}">${body}</symbol>`;
    })
    .join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>`
  );
}

/* Returns the markup for one shape or icon, e.g. shapeSVG("sprig") */
function shapeSVG(name, className = "shape") {
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="#shape-${name}"></use></svg>`;
}

injectShapeSprite();
