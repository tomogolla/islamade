<script lang="ts">
  import { goto } from '$app/navigation';
  let query = '';
  function submit(event: SubmitEvent) {
    event.preventDefault();
    goto(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }
</script>
<form class="searchbar" role="search" on:submit={submit}>
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
  <input bind:value={query} type="search" placeholder="Search the shop" aria-label="Search the shop" />
</form>
