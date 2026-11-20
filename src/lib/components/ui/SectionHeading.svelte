<script lang="ts">export let eyebrow = ''; export let title: string; export let href = ''; export let linkLabel = '';</script>
<div class="section-heading"><div>{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}<h2>{title}</h2></div>{#if href}<a class="text-link" {href}>{linkLabel}</a>{/if}</div>
