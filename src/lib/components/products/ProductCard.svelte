<script lang="ts">
  import type { Collection, Product } from '#lib/data/catalog';
  import { assetUrl, isLowStock, productStatus } from '#lib/data/catalog';
  import { formatPrice } from '#lib/utils/format'; import { productOrderUrl } from '#lib/utils/whatsapp'; import { site } from '#lib/data/config';
  export let product: Product; export let collection: Collection | undefined; export let onOpen: (product: Product, trigger: HTMLElement) => void;
  function open(event: MouseEvent | KeyboardEvent) { onOpen(product, event.currentTarget as HTMLElement); }
</script>
<article class={`product-card accent-${collection?.accent ?? 'butter'}`}>
  <button class="product-photo" type="button" aria-label={`View ${product.name}`} aria-haspopup="dialog" on:click={open}>
    {#if product.images[0]}
      <img src={assetUrl(product.images[0])} alt={product.alt} loading="lazy" decoding="async" />
    {/if}
    {#if site.showNewBadge && product.new}<span class="badge">New</span>{/if}
  </button>
  <div class="card-body"><div class="card-title-row"><h3 class="card-title">{product.name}</h3><strong>{formatPrice(product.price)}</strong></div><p class="card-description">{product.shortDescription}</p><div class="card-meta"><span class="status">{productStatus(product)}</span>{#if isLowStock(product)}<span>Only {product.stock} left</span>{/if}</div>
    {#if productStatus(product) === 'sold out'}<a class="order-link" href={productOrderUrl(product, collection)} target="_blank" rel="noreferrer">Ask about made to order</a>{:else}<a class="order-link" href={productOrderUrl(product, collection)} target="_blank" rel="noreferrer">Order via WhatsApp</a>{/if}
  </div>
</article>

<style>
  .product-photo { width: 100%; padding: 0; }
  .product-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
</style>
