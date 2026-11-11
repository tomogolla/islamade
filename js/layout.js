/* ==========================================================================
   Shared layout: header, mobile menu, footer and link helpers
   --------------------------------------------------------------------------
   The header and footer are written once here and added to every page, so
   you never have to copy-paste them. Each page only needs:

     <body data-root="../" data-page="shop">     ("./" on the home page)
       <div id="site-header"></div>  …page content…  <div id="site-footer"></div>
   ========================================================================== */

/* Path from the current page back to the site root ("./" or "../") */
const ROOT = document.body.dataset.root || "./";

/* Main navigation — add, remove or rename menu items here */
const NAV_ITEMS = [
  { page: "collections", label: "collections", href: "pages/collections.html" },
  { page: "shop", label: "shop", href: "pages/shop.html" },
  { page: "custom", label: "custom", href: "pages/custom.html" },
  { page: "about", label: "behind the studio", href: "pages/about.html" },
];

/* Footer thank-you note */
const FOOTER_NOTE =
  "Every single item in this shop is handmade by me with intention and care. Thank you so much for stopping by and supporting my creative journey. I hope these pieces bring as much comfort and joy to your life as making them brings to mine!";

/* Builds a WhatsApp link that opens a chat with a prefilled message */
function whatsappLink(message = "Hi islamade! 🧶") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* Builds an email link with a prefilled subject and message */
function mailtoLink(subject, body) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* The URL for a named link from config.js */
function siteLink(name) {
  if (name === "instagram") return SITE.instagram;
  if (name === "youtube") return SITE.youtube;
  if (name === "whatsapp") return whatsappLink();
  if (name === "email") return `mailto:${SITE.email}`;
  return "#";
}

/* Social links shown in the footer */
const SOCIAL_LINKS = [
  { name: "instagram", label: `instagram ${SITE.instagramHandle}` },
  { name: "youtube", label: `youtube ${SITE.youtubeHandle}` },
  { name: "whatsapp", label: `whatsapp ${SITE.whatsappDisplay}` },
  { name: "email", label: SITE.email, icon: "mail" },
];

function renderHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return;

  const current = document.body.dataset.page;
  const isHome = current === "home";
  // A single collection page counts as part of "collections" in the menu
  const activePage = current === "collection" ? "collections" : current;

  const links = NAV_ITEMS.map((item) => {
    const isCurrent = item.page === activePage ? ' aria-current="page"' : "";
    return `<li><a href="${ROOT}${item.href}"${isCurrent}>${item.label}</a></li>`;
  }).join("");

  // On the home page, the big logo sits in the bento grid instead of the header
  const logo = isHome ? "" : `<a class="logo" href="${ROOT}index.html">${SITE.name}<span class="sr-only"> — home</span></a>`;

  slot.outerHTML = `
    <header class="site-header${isHome ? " site-header--home" : ""}">
      <div class="container">
        ${logo}
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          ${shapeSVG("menu", "")}<span>menu</span>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Main">
          <ul>${links}</ul>
        </nav>
      </div>
    </header>`;

  setUpMobileMenu();
}

function setUpMobileMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.innerHTML = `${shapeSVG(open ? "close" : "menu", "")}<span>${open ? "close" : "menu"}</span>`;
  };

  button.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  // Close with the Escape key, or when clicking outside the menu
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });
}

function renderFooter() {
  const slot = document.getElementById("site-footer");
  if (!slot) return;

  const socials = SOCIAL_LINKS.map(
    (link) => {
      const opensNewTab = link.name !== "email";
      return `
      <li>
        <a href="${siteLink(link.name)}"${opensNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""}>
          ${shapeSVG(link.icon || link.name, "")}${link.label}${opensNewTab ? '<span class="sr-only"> (opens in a new tab)</span>' : ""}
        </a>
      </li>`;
    }
  ).join("");

  slot.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-card">
          ${shapeSVG("sprig", "shape footer-shape")}
          <div>
            <a class="logo" href="${ROOT}index.html">${SITE.name}<span class="sr-only"> — home</span></a>
            <p class="footer-note">${FOOTER_NOTE}</p>
          </div>
          <div>
            <h2>say hello</h2>
            <ul class="social-links">${socials}</ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ${SITE.name} · every piece handmade</p>
          <p><a class="text-link" href="${ROOT}pages/custom.html">request a custom piece</a></p>
        </div>
      </div>
    </footer>`;
}

/* Fills in any link written as <a data-link="instagram"> with the URL from config.js */
function fillConfigLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    el.href = siteLink(el.dataset.link);
  });
}

renderHeader();
renderFooter();
fillConfigLinks();
