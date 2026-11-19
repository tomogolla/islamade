<script lang="ts">import type { Collection } from '#lib/data/catalog'; import CollectionCard from './CollectionCard.svelte'; export let collections: Collection[];</script>
<div class="collection-grid">{#each collections as collection (collection.id)}<CollectionCard {collection}/>{/each}</div>
