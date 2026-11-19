<script lang="ts">import '#lib/styles/global.css'; import Header from '#lib/components/layout/Header.svelte'; import Footer from '#lib/components/layout/Footer.svelte'; let { children } = $props();</script>
<a class="skip-link" href="#main">Skip to content</a><Header/><main id="main">{@render children()}</main><Footer/>
