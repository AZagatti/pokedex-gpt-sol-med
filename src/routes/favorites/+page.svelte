<script lang="ts">
	import { base } from '$app/paths';
	import { Heart, Sparkles } from 'lucide-svelte';
	import { getPokemon } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import { favorites } from '$lib/stores/favorites';

	let pokemon = $state<Pokemon[]>([]);
	let isLoading = $state(false);
	let errorMessage = $state('');
	let version = 0;

	$effect(() => { void loadFavorites([...$favorites]); });

	async function loadFavorites(names: string[]) {
		const current = ++version;
		if (!names.length) { pokemon = []; return; }
		isLoading = true;
		errorMessage = '';
		try {
			const results = await Promise.all(names.map((name) => getPokemon(fetch, name)));
			if (current === version) pokemon = results;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load favorites.';
		} finally { if (current === version) isLoading = false; }
	}
</script>

<svelte:head><title>Your Favorites · Pokédex</title></svelte:head>
<main id="main-content" class="page-shell favorites-page">
	<div class="page-title"><p class="kicker"><Sparkles size={13} /> Your personal team</p><h1>Pokémon you<br /><em>choose.</em></h1><p class="lede">Your favorites are saved on this device, ready whenever your next adventure begins.</p></div>
	{#if isLoading && !pokemon.length}<SkeletonGrid />{:else if errorMessage}<div class="error-card"><h2>Favorites are hiding</h2><p>{errorMessage}</p></div>{:else if pokemon.length}<div class="grid">{#each pokemon as item, index (item.id)}<PokemonCard pokemon={item} {index} />{/each}</div>{:else}<div class="empty-state"><Heart size={42} /><h2>No favorites yet</h2><p>Tap the heart on any Pokémon to build your personal team.</p><a class="primary-button" href={`${base}/`}>Explore the Pokédex</a></div>{/if}
</main>

<style>
	.kicker { display: flex; align-items: center; gap: 0.4rem; }
	h1 em { color: var(--accent); font-style: normal; }
</style>
