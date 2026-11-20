<script lang="ts">
  import { onMount, tick } from 'svelte'; import { BROWSER } from 'esm-env'; import type { Product } from '#lib/data/catalog'; import { assetUrl, collectionOf, isLowStock, productStatus } from '#lib/data/catalog'; import { formatPrice } from '#lib/utils/format'; import { productOrderUrl } from '#lib/utils/whatsapp';
  export let product: Product | null = null; export let opener: HTMLElement | null = null; export let onClose: () => void;
  let panel: HTMLElement; let closeButton: HTMLButtonElement; let photoIndex = 0;
  $: if (product && BROWSER) { photoIndex = 0; document.body.classList.add('modal-open'); tick().then(() => closeButton?.focus()); }
  function close(){ document.body.classList.remove('modal-open'); onClose(); tick().then(()=>opener?.focus()); }
  function keydown(event: KeyboardEvent){ if(!product)return; if(event.key==='Escape'){event.preventDefault();close()} if(event.key==='Tab'&&panel){const items=[...panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')];if(!items.length)return;const first=items[0],last=items.at(-1)!;if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}} }
  onMount(()=>()=>document.body.classList.remove('modal-open'));
</script>
<svelte:window on:keydown={keydown}/>
{#if product}
  {@const collection = collectionOf(product)}
  <div class="dialog-backdrop" role="presentation" on:mousedown={(e)=>{if(e.target===e.currentTarget)close()}}>
    <div bind:this={panel} class={`quickview accent-${collection?.accent ?? 'butter'}`} role="dialog" aria-modal="true" aria-labelledby="quick-title">
      <button bind:this={closeButton} class="close-dialog" type="button" aria-label="Close quick view" on:click={close}>×</button>
      <div class="quick-gallery"><div class="quick-main">{#if product.images[photoIndex]}<img src={assetUrl(product.images[photoIndex])} alt={product.alt}/>{/if}</div>{#if product.images.length>1}<div class="thumbs" aria-label="Product photos">{#each product.images as image,index}<button class:active={photoIndex===index} class="thumb" type="button" aria-label={`Show photo ${index+1}`} on:click={()=>photoIndex=index}><img src={assetUrl(image)} alt=""/></button>{/each}</div>{/if}</div>
      <div class="quick-details"><p class="eyebrow">{collection?.name ?? 'Handmade crochet'}</p><h2 id="quick-title">{product.name}</h2><p><strong>{formatPrice(product.price)}</strong></p><p>{product.description || product.shortDescription}</p><p><strong>Status:</strong> {productStatus(product)}{#if isLowStock(product)} · only {product.stock} left{/if}</p>{#if product.colors.length || product.size || product.materials}<dl>{#if product.colors.length}<div><dt>Colors</dt><dd>{product.colors.join(', ')}</dd></div>{/if}{#if product.size}<div><dt>Size</dt><dd>{product.size}</dd></div>{/if}{#if product.materials}<div><dt>Materials</dt><dd>{product.materials}</dd></div>{/if}</dl>{/if}<a class="button" href={productOrderUrl(product,collection)} target="_blank" rel="noreferrer">{productStatus(product)==='sold out'?'Ask about made to order':'Order via WhatsApp'}</a></div>
    </div>
  </div>
{/if}

<style>
  .quick-main img, .thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
</style>
