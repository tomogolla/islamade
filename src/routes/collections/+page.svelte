<script lang="ts">
    import Seo from "#lib/components/ui/Seo.svelte";
    import CollectionGrid from "#lib/components/collections/CollectionGrid.svelte";
    import { visibleCollections } from "#lib/data/catalog";
</script>

<Seo
    title="Crochet collections · islamade"
    description="Browse Islamade crochet collections, from bags and tiny treasures to sea friends and handmade decor."
/>
<header class="page-hero shell">
    <h1 class="title">Find your favorite world</h1>
    
</header>
<section class="section shell">
    <CollectionGrid collections={visibleCollections} />
</section>
