<script lang="ts">
  import SearchBar from './SearchBar.svelte';
  import MobileNav from './MobileNav.svelte';
  let menuOpen = false;
</script>
<header class="header">
  <div class="header-top shell">
    <a class="wordmark" href="/" aria-label="Islamade home">islamade</a>
    <SearchBar />
    <a class="button header-cta" href="/shop">Shop now</a>
    <button class="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-nav" on:click={() => menuOpen = !menuOpen}>{menuOpen ? 'Close' : 'Menu'}</button>
  </div>
  <MobileNav bind:open={menuOpen} />
</header>
