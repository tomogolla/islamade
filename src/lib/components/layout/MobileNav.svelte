<script lang="ts">
  import { page } from '$app/state';
  import { navItems } from '#lib/data/config';
  export let open = false;
  const active = (href: string) => href.startsWith('/') && (page.url.pathname === href || page.url.pathname.startsWith(`${href}/`));
</script>
<nav class:open class="nav-row shell" aria-label="Main navigation" id="main-nav">
  {#each navItems as item}
    <a href={item.href} aria-current={active(item.href) ? 'page' : undefined} on:click={() => open = false}>{item.label}</a>
  {/each}
</nav>
