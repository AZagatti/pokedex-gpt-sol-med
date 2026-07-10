<script lang="ts">
	import { Search, Sprout } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import BerryCard from '$lib/components/BerryCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let query = $state('');
	let results = $derived(data.berries.filter(({ berry }) => berry.name.includes(query.trim().toLowerCase())));
</script>

<svelte:head><title>Berry Garden · Pokédex</title><meta name="description" content="Browse every PokéAPI berry and learn its growth time, firmness, flavor, and size." /></svelte:head>

<main id="main-content" class="page-shell berries-page">
	<header class="page-heading" in:fly={{ y: 15, duration: 450 }}>
		<div><p class="kicker"><Sprout size={14} /> The berry garden</p><h1>Small fruit.<br /><em>Big effects.</em></h1><p class="lede">Browse nature’s pocket-sized power-ups, from flavor profiles to growing conditions.</p></div>
		<label><span class="sr-only">Search berries</span><Search size={18} /><input bind:value={query} type="search" placeholder="Search berries…" aria-label="Search berries" /></label>
	</header>
	<div class="berry-meta"><strong>{results.length}</strong> varieties in the garden</div>
	{#if results.length}<section class="berry-grid" aria-label="Berry results">{#each results as item, index (item.berry.id)}<BerryCard {...item} {index} />{/each}</section>{:else}<div class="empty-state"><Search size={36} /><h2>No berries sprouted</h2><p>Try a different berry name.</p></div>{/if}
</main>

<style>
	.page-heading { display: grid; grid-template-columns: 1fr minmax(16rem, 24rem); align-items: end; gap: 3rem; margin-bottom: 2rem; }
	h1 em { color: #659b64; font-style: normal; }
	.kicker { display: flex; align-items: center; gap: 0.4rem; color: #659b64; }
	.page-heading label { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.5rem; padding: 0.75rem 0.9rem; border: 1px solid var(--line); border-radius: 0.9rem; background: var(--surface); color: var(--muted); box-shadow: var(--shadow-sm); }
	.page-heading input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--text); }
	.berry-meta { margin-bottom: 1rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.7rem; }
	.berry-meta strong { color: var(--text); }
	.berry-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr)); gap: 1rem; }
	@media (max-width: 700px) { .page-heading { grid-template-columns: 1fr; gap: 1.5rem; } }
</style>
