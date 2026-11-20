<script lang="ts">
  export let name: 'instagram' | 'youtube' | 'whatsapp';
</script>

{#if name === 'instagram'}
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" stroke-width="2.2" />
    <circle cx="12" cy="12" r="4.15" fill="none" stroke="currentColor" stroke-width="2.2" />
    <circle cx="17.45" cy="6.65" r="1.25" fill="currentColor" />
  </svg>
{:else if name === 'youtube'}
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.6 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 8.6.5 8.6.5s6.8 0 8.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.4-4.8Z" fill="currentColor" />
    <path d="m9.8 15.3 5.7-3.3-5.7-3.3v6.6Z" fill="var(--icon-cutout, white)" />
  </svg>
{:else}
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.25a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l5.08-1.26A9.5 9.5 0 1 0 12 2.25Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
    <path d="M8.15 7.55c.22-.48.45-.49.67-.5h.56c.18 0 .38.07.48.37l.72 1.77c.08.22.04.4-.1.59l-.56.7c-.17.2-.13.38.04.62.7 1.03 1.54 1.82 2.66 2.43.27.15.45.13.63-.08l.82-1c.2-.24.4-.28.66-.17l1.9.9c.28.13.45.2.5.33.06.12.06.73-.16 1.42-.22.7-1.28 1.34-1.77 1.42-.48.08-1.1.12-1.78-.1-.41-.14-.94-.3-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.2-1.16-1.55-1.16-2.95 0-1.4.73-2.1 1-2.38.25-.27.56-.34.75-.34h.6Z" fill="currentColor" />
  </svg>
{/if}

<style>
  svg { display: block; width: 1.2rem; height: 1.2rem; }
</style>
