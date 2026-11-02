# islamade

The website for **islamade**, a handmade crochet brand. It's a plain HTML, CSS and JavaScript site with no build step, so you can edit files and upload them as they are.

## What's where

```
index.html              Home page (the colorful bento grid)
pages/
  collections.html      All collections
  collection.html       One collection (pages/collection.html?c=tiny-treasures)
  shop.html             All products with filter chips (pages/shop.html?collection=tiny-treasures)
  custom.html           Custom order explainer and request form
  about.html            Behind the studio
css/styles.css          All styling. Colors are at the very top.
js/config.js            Your links, WhatsApp number, email, currency and the "new" badge switch
js/layout.js            Shared header, menu and footer (written once, used on every page)
js/catalog.js           Loads the data files and builds collection and product cards
js/quickview.js         The pop-up that opens when you click a product
js/home.js, collections.js, collection.js, shop.js, custom.js   One small script per page
js/shapes.js            The decorative shapes (leaf, sprig, starburst…) and icons
data/isla_s_catalouge.xlsx   ← your catalog spreadsheet (the source of truth)
data/products.json      Made from the spreadsheet. Don't edit by hand.
data/collections.json   Made from the spreadsheet. Don't edit by hand.
tools/build-data.js     The converter that turns the spreadsheet into the two JSON files
tools/collection-copy.json   Website text and colors for each collection (see below)
assets/images/products/      Product photos
assets/images/collections/   Optional collection cover photos
```

---

## Update the shop after changing the spreadsheet

The spreadsheet `data/isla_s_catalouge.xlsx` (sheets **Products** and **Collections**) is the source of truth. After you change it, or add or rename photos, run this in a terminal from the project folder:

```
node tools/build-data.js
```

This rewrites `data/products.json` and `data/collections.json`, then prints a short report:

- which collections are empty (and therefore hidden)
- which products have no photo yet
- which photos didn't match any product, with a hint when a name looks like a typo
- which photos are large enough to slow the site down

It only needs [Node.js](https://nodejs.org), with nothing else to install. To read a spreadsheet saved somewhere else, add its path: `node tools/build-data.js "C:\path\to\catalog.xlsx"`.

> Save and close the spreadsheet in Excel before running the command. The ID, image and item-count formula columns are worked out by the converter itself, so it doesn't matter whether Excel saved their results.

---

## Name your product photos

Put photos in `assets/images/products/` and name them after the product's **ID**: the item name in lowercase, with spaces replaced by hyphens.

| Item name | Photo file names |
| --- | --- |
| Shell Bag | `shell-bag-1.jpg`, `shell-bag-2.jpg`, `shell-bag-3.jpg` |
| Lily of the Valley Charm | `lily-of-the-valley-charm-1.jpg` |

- Photos are shown in number order. The first one appears on the card, the second swaps in when you hover over the card on a computer, and every photo appears in the product pop-up.
- `.jpg`, `.jpeg`, `.png`, `.webp` and `.avif` all work. Capital letters don't matter, and spaces, hyphens and underscores count as the same thing, so `Shell Bag-1.JPG` matches too.
- Names must otherwise match exactly. Extra words like `turban-model.jpeg` or `mesh-bow-group.jpeg` are not matched; rename them `turban-2.jpeg`, `mesh-bow-4.jpeg` and so on. The converter's report lists any photo that didn't match.
- You can also name one extra photo in the spreadsheet's **Image 2 filename** column.
- A product with no photo shows a soft colored block with its name, so the site never shows a broken image.
- **Keep photos small.** Phone photos are often 4000 px wide and 7–8 MB, which makes the shop slow on mobile data. Aim for about 1200 × 1500 px and under 400 KB; https://squoosh.app does this for free. The converter's report lists the photos that are too big.

## Add a collection cover photo

By default a collection uses the first photo of its first product as its cover. To choose your own, add a photo named after the collection's ID with `-cover` on the end, in `assets/images/collections/`:

```
assets/images/collections/tiny-treasures-cover.jpg     (.jpg, .png or .webp)
```

Then run `node tools/build-data.js`. The home page's tall "collections" tile uses the cover of the collection marked **Featured on home? = yes**. If that collection is empty or has no photo, it uses the first collection that has one.

## Add a product

1. Add a row to the **Products** sheet: Item name, Price (KSh), Collection (the collection's **ID**, e.g. `tiny-treasures`), Description, Short description, Status, and so on.
   - **Status** is `available`, `made to order` or `sold out`. A **Stock qty** of 0 also counts as sold out. Sold-out pieces get a disabled order button and an "ask about a made-to-order version" link.
   - A **Stock qty** of 1–3 shows a small "only N left" note.
   - **New?** = yes shows a "new" badge. To hide every badge, set `SHOW_NEW_BADGE = false` in `js/config.js`.
   - **Colors available**, **Size** and **Materials** only show when they're filled in. Separate colors with commas.
   - Cards show the **Short description**. The pop-up shows the full **Description**.
   - **Image alt text** describes the photo for people using screen readers.
2. Add photos named `<id>-1.jpg`, `<id>-2.jpg`… (see above).
3. Run `node tools/build-data.js`.

## Add a collection

1. Add a row to the **Collections** sheet with an **ID** (lowercase, hyphens, no spaces, e.g. `summer-knits`), a **Name**, and optionally a Tagline, Description, Accent color (`periwinkle`, `lavender`, `pink`, `butter` or `mint`) and **Featured on home?**.
2. Assign products to it with that ID in the Products sheet's **Collection** column.
3. Run `node tools/build-data.js`.

**Empty collections are hidden everywhere** (collections page, shop filters, prev/next links, custom-order dropdown and the home tile) and get no page. They appear automatically once a product is assigned to them.

**Collection text and colors.** `tools/collection-copy.json` holds each collection's tagline, description, accent color and decorative shape for the website. Anything written there **wins over the spreadsheet**. To use the spreadsheet's text for a collection instead, delete that line from `collection-copy.json`. For a new collection, add a block there to pick its shape (`fan`, `sprig`, `circle`, `palm`, `starburst`, `arch` or `leaf`); otherwise one is chosen for you.

---

## Change links, WhatsApp number and email

Everything lives in **`js/config.js`**:

```js
instagram: "https://www.instagram.com/yourname/",
youtube: "https://www.youtube.com/@yourname",
whatsappNumber: "254712345678",   // digits only, with country code, no + or spaces
email: "you@example.com",
currency: "KSh",                  // prices show as "KSh 1,800"
```

The home tiles, footer, order buttons and custom form all read from this file. WhatsApp order messages include the product name, its price and its collection.

## Change colors and fonts

Open **`css/styles.css`**. The first block (`:root`) holds every color:

```css
--periwinkle: #AF99FF;
--lavender:   #CAADFF;
--pink:       #FFC2E2;
--butter:     #F4EEA9;
--mint:       #E5F4E3;
--ink:        #2E2250;  /* all text */
--paper:      #FFFBF4;  /* page background */
```

Change a value there and it updates across the whole site. Keep text in `--ink`, since light text on pastel colors is hard to read. The `-deep` colors are only for decorative shapes. Fonts are set just below the colors.

## Other placeholders

Search the project for `TODO` to find the rest: social links and contact details in `js/config.js`, the studio photo in `pages/about.html`, and the share image `assets/og-image.png` (1200 × 630).

---

## Preview locally

The pages load their products from the `data/` files. Browsers block that when you just double-click an HTML file, so preview with a small local server. Pick one option:

- **VS Code:** install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.
- **Terminal:** in this folder, run `npx serve`, then open the address it prints (usually http://localhost:3000).

## Deploy for free

Any of these works, and none of them needs a build step. Run `node tools/build-data.js` first so the JSON files are up to date.

**Netlify (easiest)**
1. Go to https://app.netlify.com/drop.
2. Drag this whole `islamade` folder onto the page. You get a live link in seconds.
3. To update the site later, drag the folder onto your site's **Deploys** tab again.

**Vercel**
1. Put the folder in a GitHub repository.
2. At https://vercel.com, choose **Add New → Project**, pick the repository and click **Deploy**. Leave all settings as they are, with no framework.

**GitHub Pages**
1. Put the folder in a GitHub repository.
2. In the repository, open **Settings → Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then save.
3. Your site appears at `https://<your-username>.github.io/<repo-name>/` after a minute or two.

**After going live:** in the `<head>` of each HTML page, change `og:image` and `og:url` to full addresses (for example `https://islamade.netlify.app/assets/og-image.png`). Social apps need full addresses to show the preview image when your link is shared.
