<script lang="ts">
  import Seo from '#lib/components/ui/Seo.svelte';
  import { assetUrl } from '#lib/data/catalog';
</script>

<Seo title="Behind the studio · islamade" description="Meet the maker and discover how Islamade's handmade crochet pieces began."/>

<section class="section shell story-grid">
  <div class="organic-photo">
    <img src={assetUrl('assets/images/products/turban-model.jpeg')} alt="A model wearing an Islamade crochet turban"/>
  </div>
  <div class="story-panel">
    <p class="eyebrow">The maker</p>
    <h1 class="title">Behind the studio</h1>
    <p>It all started at home with a hook, a ball of yarn and a spark of curiosity. The moment I finished my first stitch, I was hooked. Later, I found an old crochet piece at home and fell even more in love.</p>
    <p>After creating countless handmade pieces, I’m excited to share this passion with the world. Welcome to my small corner of the internet, made entirely by hand, with love.</p>
    <span class="signature">islamade</span>
  </div>
</section>

<section class="section about-band" id="care">
  <div class="shell">
    <p class="eyebrow">Made to last</p>
    <h2 class="title">Care for handmade things.</h2>
    <p class="lede">Treat crochet gently: spot clean when possible, hand wash in cool water when needed, reshape while damp and dry flat. Ask us if your piece needs special care.</p>
    <div class="about-actions">
      <a class="button" href="/collections">Browse collections</a>
      <a class="text-link" href="/custom">Request a custom piece</a>
    </div>
  </div>
</section>

<style>
  .signature { display: block; margin-top: 1rem; font-family: var(--script); font-size: 3rem; }
  .about-band { background: var(--lilac); }
  .about-actions { display: flex; align-items: center; gap: 1.5rem; margin-top: 1.5rem; }
</style>
