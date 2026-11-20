<script lang="ts">
  import Seo from "#lib/components/ui/Seo.svelte";
  import SectionHeading from "#lib/components/ui/SectionHeading.svelte";
  import ProductGrid from "#lib/components/products/ProductGrid.svelte";
  import ProductQuickView from "#lib/components/products/ProductQuickView.svelte";
  import type { Product } from "#lib/data/catalog";
  import { products, visibleCollections, assetUrl } from "#lib/data/catalog";
  const preferred = ["shell-bag", "mesh-bandana", "jellyfish", "wisteria"];
  const featured = preferred
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p?.images.length))
    .concat(
      products.filter((p) => p.images.length && !preferred.includes(p.id)),
    )
    .slice(0, 4);
  let selected: Product | null = null;
  let opener: HTMLElement | null = null;
  function open(product: Product, trigger: HTMLElement) {
    selected = product;
    opener = trigger;
  }
</script>

<Seo
  title="islamade · handmade crochet, made with love"
  description="Playful crochet pieces, stitched slowly by hand in Nairobi."
/>
<section class="home-hero shell">
  <div>
    <h1 class="display">A little softness<br />for everyday life.</h1>
    <p class="lede">
      Playful bags, tiny charms and cozy pieces, stitched slowly by hand and
      made to stay with you.
    </p>
    <div class="hero-actions">
      <a class="button" href="/shop">Explore the shop</a><a
        class="text-link"
        href="/custom">Request something custom</a
      >
    </div>
  </div>
  <div class="hero-art">
    <div class="hero-blob">
      <img
        src={assetUrl("assets/images/products/coin-pouches-model.jpeg")}
        alt="Model holding handmade crochet coin pouches"
      />
    </div>
    <span class="hero-tag one"><b>100%</b><small>made by hand</small></span
    ><span class="hero-tag two"
      ><b>one of one</b><small>little variations</small></span
    >
  </div>
</section>
<section class="facts shell" aria-label="Studio facts">
  <div><strong>{products.length}+</strong><span>playful pieces</span></div>
  <div>
    <strong>{visibleCollections.length}</strong><span>happy collections</span>
  </div>
  <div><strong>100%</strong><span>handmade with care</span></div>
  <!-- <div><strong>Nairobi</strong><span>made locally</span></div> -->
</section>
<section class="section shell">
  <SectionHeading
    eyebrow="Fresh from the hook"
    title="Pieces we love"
    href="/shop"
    linkLabel="View all pieces"
  /><ProductGrid products={featured} onOpen={open} />
</section>
<!-- <section class="benefits">
  <div class="shell benefit-grid">
    <div>
      <span>♥</span>
      <p>
        <b>Made by one pair of hands</b><small
          >Slowly stitched in the studio</small
        >
      </p>
    </div>
    <div>
      <span>✦</span>
      <p>
        <b>Small batches only</b><small>Special pieces, never mass-made</small>
      </p>
    </div>
    <div>
      <span>☺</span>
      <p><b>Made to bring joy</b><small>Color, comfort and character</small></p>
    </div>
  </div>
</section> -->
<section class="section shell">
  <SectionHeading eyebrow="Find your favorite" title="Shop by collection" />
  <div class="home-collections">
    {#each visibleCollections.slice(0, 4) as collection}<a
        class={`home-collection accent-${collection.accent}`}
        href={`/collections/${collection.id}`}
        ><span>{collection.name}</span><b>↗</b></a
      >{/each}
  </div>
</section>
<section class="section shell story-grid">
  <div class="organic-photo">
    <img
      src={assetUrl("assets/images/products/turban-model.jpeg")}
      alt="Model wearing a handmade crochet turban"
    />
  </div>
  <div>
    
    <h2 class="title">Meet the hands<br />behind Islamade.</h2>
    <p class="lede">
      What began as a love for yarn and quiet afternoons became a tiny studio
      filled with color, experiments and happy little objects. Every piece is
      made by hand, from the first loop to the final detail.
    </p>
    <a class="button" href="/about">Our studio story</a>
  </div>
</section>
<section class="section placeholders">
  <div class="shell">
    <SectionHeading title="Made for happy homes" />
    <div class="placeholder-grid">
      <article>
        <div class="review-person">
                            <div><b>Bakhita</b></div>
                        </div>
                        <p class="review-text">“It is even cuter in person. You can feel how much care went into every stitch, and the
                            colors make me smile every time.”</p><span class="stars">★★★★★</span>
      </article>
      <article>
        <h3>From the studio</h3>
        <p>Care guides and studio notes are coming soon.</p>
        <a class="text-link" href="/about">Read our story</a>
      </article>
    </div>
  </div>
</section>
<ProductQuickView
  product={selected}
  {opener}
  onClose={() => (selected = null)}
/>

<style>
  .home-hero {
    display: grid;
    grid-template-columns: 1.02fr 0.98fr;
    align-items: center;
    gap: 3rem;
    min-height: 550px;
    padding-block: 3rem;
  }
  .home-hero .lede {
    margin: 1.4rem 0 1.7rem;
  }
  .hero-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .hero-art {
    position: relative;
    min-height: 440px;
  }
  .hero-blob {
    position: absolute;
    inset: 10px 24px 0 42px;
    border-radius: 48% 48% 49% 51%/48% 42% 58% 52%;
    overflow: hidden;
    transform: rotate(3deg);
    box-shadow: 10px 10px 0 var(--yellow);
  }
  .hero-blob img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: rotate(-3deg) scale(1.08);
  }
  .hero-tag {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: 135px;
    padding: 0.75rem 1rem;
    border: var(--border);
    border-radius: 10px;
    background: var(--yellow);
    box-shadow: 4px 4px 0 var(--navy);
  }
  .hero-tag small {
    font-size: 0.7rem;
  }
  .hero-tag.one {
    top: 80px;
    right: 0;
  }
  .hero-tag.two {
    bottom: 55px;
    left: 0;
    background: #fff;
  }
  .facts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 2rem 0;
    border-block: 1px solid #0d172322;
  }
  .facts div {
    padding-left: 1.5rem;
    border-left: 1px solid #0d172322;
  }
  .facts div:first-child {
    padding: 0;
    border: 0;
  }
  .facts strong,
  .facts span {
    display: block;
  }
  .facts strong {
    font-size: 1.8rem;
  }
  .facts span {
    color: var(--muted);
    font-size: 0.8rem;
  }
  .benefits {
    padding: 1.7rem 0;
    border-block: 1px solid #0d17231a;
    background: #fff;
  }
  .benefit-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .benefit-grid > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }
  .benefit-grid > div + div {
    border-left: 1px solid #ddd;
  }
  .benefit-grid > div > span {
    display: grid;
    width: 2.4rem;
    height: 2.4rem;
    place-items: center;
    border-radius: 50%;
    background: var(--lilac);
  }
  .benefit-grid b,
  .benefit-grid small {
    display: block;
  }
  .benefit-grid small {
    color: var(--muted);
  }
  .home-collections {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .home-collection {
    display: flex;
    align-items: center;
    min-height: 92px;
    padding: 1.2rem;
    border: var(--border);
    border-radius: 8px;
    background: var(--accent);
    font-weight: 700;
    text-decoration: none;
    box-shadow: 4px 4px 0 #0d172330;
  }
  .home-collection b {
    display: grid;
    width: 2rem;
    height: 2rem;
    margin-left: auto;
    place-items: center;
    border: var(--border);
    border-radius: 50%;
    background: var(--yellow);
  }
  .placeholders {
    background: #fff;
  }
  .placeholder-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .placeholder-grid article {
    padding: 2rem;
    border: var(--border);
    border-radius: var(--radius);
    background: var(--yellow);
  }
  .placeholder-grid h3 {
    margin-bottom: 0.6rem;
    font-size: 1.5rem;
  }
  @media (max-width: 800px) {
    .home-hero {
      grid-template-columns: 1fr;
    }
    .home-hero > div:first-child {
      padding-top: 2rem;
    }
    .facts,
    .home-collections {
      grid-template-columns: 1fr 1fr;
    }
    .benefit-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .benefit-grid > div {
      justify-content: flex-start;
    }
    .benefit-grid > div + div {
      padding-top: 1rem;
      border-top: 1px solid #ddd;
      border-left: 0;
    }
  }
  .review-person {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }
  .review-person b {
    font-weight: 700;
  }
  .review-text {
    margin-bottom: 0.5rem;
    font-style: italic;
  }
  @media (max-width: 520px) {
    .hero-art {
      min-height: 370px;
    }
    .hero-actions {
      align-items: flex-start;
      flex-direction: column;
    }
    .facts {
      gap: 1.2rem;
    }
    .facts div:nth-child(3) {
      padding-left: 0;
      border-left: 0;
    }
    .home-collections,
    .placeholder-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
