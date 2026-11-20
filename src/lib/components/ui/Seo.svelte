<script lang="ts">
  import { page } from '$app/state'; import { asset } from '$app/paths'; import { site } from '#lib/data/config';
  export let title: string; export let description: string; export let image = asset('og-image.png');
  const canonical = `${site.origin}${page.url.pathname}`;
  const socialImage = new URL(image, canonical).href;
</script>
<svelte:head><title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={canonical}/><meta property="og:type" content="website"/><meta property="og:site_name" content="islamade"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={canonical}/><meta property="og:image" content={socialImage}/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><meta name="twitter:image" content={socialImage}/><meta name="theme-color" content="#fbf7f1"/></svelte:head>
