<script lang="ts">
  import { page } from '$app/state'; import { site } from '#lib/data/config';
  export let title: string; export let description: string; export let image = '/assets/og-image.png';
  const canonical = `${site.origin}${page.url.pathname}`;
</script>
<svelte:head><title>{title}</title><meta name="description" content={description}/><link rel="canonical" href={canonical}/><meta property="og:type" content="website"/><meta property="og:site_name" content="islamade"/><meta property="og:title" content={title}/><meta property="og:description" content={description}/><meta property="og:url" content={canonical}/><meta property="og:image" content={`${site.origin}${image}`}/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><meta name="twitter:image" content={`${site.origin}${image}`}/><meta name="theme-color" content="#fbf7f1"/></svelte:head>
