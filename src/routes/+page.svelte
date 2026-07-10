<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ChevronDown, RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-svelte';
	import {
		baseStatTotal,
		getAllPokemonNames,
		getGenerationPokemon,
		getPokemon,
		getPokemonPage,
		getTypePokemon
	} from '$lib/api/client';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import SkeletonGrid from '$lib/components/SkeletonGrid.svelte';
	import { titleCase } from '$lib/utils/format';
	import type { PageData } from './$types';
	import type { Pokemon } from '$lib/api/schemas';

	let { data }: { data: PageData } = $props();
	let pokemon = $state<Pokemon[]>([]);
	let query = $state('');
	let debouncedQuery = $state('');
	let generation = $state('');
	let selectedTypes = $state<string[]>([]);
	let sort = $state<'dex' | 'stats'>('dex');
	let isLoading = $state(false);
	let hasMore = $state(true);
	let errorMessage = $state('');
	let typePanelOpen = $state(false);
	let sentinel = $state<HTMLDivElement>();
	let candidateNames = $state<string[]>([]);
	let loadedCount = $state(30);
	let requestVersion = 0;
	let searchTimer: ReturnType<typeof setTimeout>;
	let isFiltered = $derived(Boolean(debouncedQuery || generation || selectedTypes.length || sort !== 'dex'));

	onMount(() => {
		pokemon = [...data.pokemon];
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMore && !isLoading) void loadMore();
			},
			{ rootMargin: '500px' }
		);
		if (sentinel) observer.observe(sentinel);
		return () => observer.disconnect();
	});

	function handleSearch(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			debouncedQuery = query.trim().toLowerCase();
			void applyFilters(debouncedQuery, generation, [...selectedTypes], sort);
		}, 250);
	}

	function changeGeneration(event: Event) {
		generation = (event.currentTarget as HTMLSelectElement).value;
		void applyFilters(debouncedQuery, generation, [...selectedTypes], sort);
	}

	function changeSort(event: Event) {
		sort = (event.currentTarget as HTMLSelectElement).value as 'dex' | 'stats';
		void applyFilters(debouncedQuery, generation, [...selectedTypes], sort);
	}

	async function applyFilters(
		searchValue = debouncedQuery,
		generationValue = generation,
		typeValues = selectedTypes,
		sortValue = sort
	) {
		const version = ++requestVersion;
		errorMessage = '';
		if (!searchValue && !generationValue && typeValues.length === 0 && sortValue === 'dex') {
			pokemon = [...data.pokemon];
			loadedCount = pokemon.length;
			hasMore = true;
			candidateNames = [];
			return;
		}

		isLoading = true;
		try {
			let names = (await getAllPokemonNames(fetch)).map(({ name }) => name);
			if (searchValue) names = names.filter((name) => name.includes(searchValue));
			if (generationValue) {
				const allowed = new Set(await getGenerationPokemon(fetch, Number(generationValue)));
				names = names.filter((name) => allowed.has(name));
			}
			for (const type of typeValues) {
				const allowed = new Set(await getTypePokemon(fetch, type));
				names = names.filter((name) => allowed.has(name));
			}
			if (version !== requestVersion) return;
			candidateNames = names;
			const batchNames = sortValue === 'stats' ? names : names.slice(0, 30);
			let results = await Promise.all(batchNames.map((name) => getPokemon(fetch, name)));
			results.sort((a, b) => (sortValue === 'stats' ? baseStatTotal(b) - baseStatTotal(a) : a.id - b.id));
			if (version !== requestVersion) return;
			pokemon = results.slice(0, 30);
			candidateNames = sortValue === 'stats' ? results.map(({ name }) => name) : names;
			loadedCount = pokemon.length;
			hasMore = loadedCount < candidateNames.length;
		} catch (error) {
			if (version === requestVersion) errorMessage = error instanceof Error ? error.message : 'Could not load Pokémon.';
		} finally {
			if (version === requestVersion) isLoading = false;
		}
	}

	async function loadMore() {
		isLoading = true;
		errorMessage = '';
		try {
			const next = isFiltered
				? await Promise.all(candidateNames.slice(loadedCount, loadedCount + 30).map((name) => getPokemon(fetch, name)))
				: await getPokemonPage(fetch, loadedCount, 30);
			pokemon = [...pokemon, ...next.filter((item) => !pokemon.some(({ id }) => id === item.id))];
			loadedCount += next.length;
			hasMore = next.length === 30 && (!isFiltered || loadedCount < candidateNames.length);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load more Pokémon.';
		} finally {
			isLoading = false;
		}
	}

	function toggleType(type: string) {
		selectedTypes = selectedTypes.includes(type)
			? selectedTypes.filter((item) => item !== type)
			: [...selectedTypes, type];
		void applyFilters(debouncedQuery, generation, [...selectedTypes], sort);
	}

	function clearFilters() {
		query = '';
		debouncedQuery = '';
		generation = '';
		selectedTypes = [];
		sort = 'dex';
		typePanelOpen = false;
		void applyFilters('', '', [], 'dex');
	}
</script>

<svelte:head><title>Pokédex — Discover every Pokémon</title></svelte:head>

<main id="main-content" class="page-shell">
	<section class="hero" in:fly={{ y: 18, duration: 500 }}>
		<div>
			<p class="kicker"><Sparkles size={13} /> The field guide, reimagined</p>
			<h1>Discover your<br /><em>next favorite.</em></h1>
			<p class="lede">Explore every Pokémon across nine generations. Search, compare strengths, and build a collection that follows you.</p>
		</div>
		<div class="hero-mark" aria-hidden="true"><span></span></div>
	</section>

	<section class="toolbar" aria-label="Search and filter Pokémon">
		<label class="search-field">
			<span class="sr-only">Search Pokémon by name</span>
			<Search size={19} aria-hidden="true" />
			<input value={query} oninput={handleSearch} type="search" placeholder="Search by name…" autocomplete="off" />
			{#if query}<button type="button" onclick={() => { query = ''; debouncedQuery = ''; void applyFilters('', generation, [...selectedTypes], sort); }} aria-label="Clear search">×</button>{/if}
		</label>
		<label class="select-field">
			<span class="sr-only">Filter by generation</span>
			<select value={generation} onchange={changeGeneration} aria-label="Filter by generation">
				<option value="">All generations</option>
				{#each Array(9) as _, index}<option value={index + 1}>Generation {index + 1}</option>{/each}
			</select>
			<ChevronDown size={16} aria-hidden="true" />
		</label>
		<div class="type-filter">
			<button class:active={selectedTypes.length > 0} type="button" onclick={() => (typePanelOpen = !typePanelOpen)} aria-expanded={typePanelOpen}>
				<SlidersHorizontal size={17} /> Types {#if selectedTypes.length}<span>{selectedTypes.length}</span>{/if}
			</button>
			{#if typePanelOpen}
				<div class="type-panel" transition:fade={{ duration: 150 }}>
					<p>Match all selected types</p>
					<div>{#each data.types as type}<button type="button" class="type-{type}" class:selected={selectedTypes.includes(type)} onclick={() => toggleType(type)} aria-pressed={selectedTypes.includes(type)}>{titleCase(type)}</button>{/each}</div>
				</div>
			{/if}
		</div>
		<label class="select-field sort-field">
			<span class="sr-only">Sort Pokémon</span>
			<select value={sort} onchange={changeSort} aria-label="Sort Pokémon">
				<option value="dex">Sort: Dex number</option>
				<option value="stats">Sort: Base-stat total</option>
			</select>
			<ChevronDown size={16} aria-hidden="true" />
		</label>
		{#if isFiltered}<button class="clear" type="button" onclick={clearFilters}><RotateCcw size={15} /> Clear</button>{/if}
	</section>

	<div class="results-meta">
		<p>{#if isLoading && pokemon.length === 0}Finding matches…{:else}<strong>{pokemon.length}</strong> {isFiltered ? `of ${candidateNames.length} matches` : 'Pokémon loaded'}{/if}</p>
		<span aria-live="polite">{errorMessage}</span>
	</div>

	{#if pokemon.length}
		<section class="grid" aria-label="Pokémon results">
			{#each pokemon as item, index (item.id)}<PokemonCard pokemon={item} {index} />{/each}
		</section>
	{:else if isLoading}
		<SkeletonGrid />
	{:else if errorMessage}
		<div class="error-card"><h2>We lost the trail</h2><p>{errorMessage}</p><button class="primary-button" type="button" onclick={() => applyFilters()}>Try again</button></div>
	{:else}
		<div class="empty-state" in:fade><Search size={38} /><h2>No Pokémon found</h2><p>Try another name or loosen your filters.</p><button class="primary-button" type="button" onclick={clearFilters}>Clear filters</button></div>
	{/if}

	{#if hasMore}<div class="sentinel" bind:this={sentinel}>{#if isLoading}<SkeletonGrid count={3} />{/if}</div>{:else}<div class="end-mark"><span></span><p>You’ve reached the end of this trail.</p><span></span></div>{/if}
</main>

<style>
	.hero { position: relative; display: grid; grid-template-columns: 1fr 22rem; align-items: center; min-height: 24rem; margin-bottom: 2.5rem; overflow: hidden; }
	.hero h1 em { color: var(--accent); font-style: normal; }
	.kicker { display: flex; align-items: center; gap: 0.4rem; }
	.hero-mark { position: relative; width: 20rem; height: 20rem; justify-self: end; border: 1px solid var(--line); border-radius: 50%; background: linear-gradient(to bottom, var(--accent) 0 47%, var(--text) 47% 53%, var(--surface) 53%); box-shadow: var(--shadow-lg); opacity: 0.88; transform: rotate(-8deg); }
	.hero-mark::before, .hero-mark::after { position: absolute; content: ''; }
	.hero-mark::before { inset: 50% auto auto 50%; width: 5rem; height: 5rem; transform: translate(-50%, -50%); border: 0.85rem solid var(--text); border-radius: 50%; background: var(--surface); }
	.hero-mark::after { inset: 1rem; border: 1px solid #ffffff30; border-radius: 50%; }
	.hero-mark span { position: absolute; top: 1.8rem; left: 4rem; width: 4rem; height: 2rem; transform: rotate(-24deg); border-radius: 50%; background: #ffffff1f; filter: blur(4px); }
	.toolbar { position: sticky; top: 5.35rem; z-index: 30; display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; padding: 0.65rem; border: 1px solid var(--line); border-radius: 1.15rem; background: color-mix(in srgb, var(--surface) 90%, transparent); box-shadow: var(--shadow-sm); backdrop-filter: blur(18px); }
	.search-field { display: flex; flex: 1 1 18rem; align-items: center; min-width: 12rem; gap: 0.6rem; padding: 0 0.75rem; color: var(--muted); }
	.search-field input { width: 100%; min-width: 0; padding: 0.7rem 0; border: 0; outline: 0; background: transparent; color: var(--text); }
	.search-field button { border: 0; background: none; color: var(--muted); font-size: 1.3rem; }
	.select-field { position: relative; flex: 0 0 auto; }
	.select-field select, .type-filter > button, .clear { height: 2.75rem; padding: 0 2.25rem 0 0.85rem; appearance: none; border: 1px solid var(--line); border-radius: 0.75rem; background: var(--surface-2); color: var(--text); font-size: 0.8rem; font-weight: 690; }
	.select-field :global(svg) { position: absolute; top: 50%; right: 0.7rem; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
	.type-filter { position: relative; }
	.type-filter > button, .clear { display: flex; align-items: center; gap: 0.4rem; padding-right: 0.85rem; }
	.type-filter > button.active { border-color: var(--accent); color: var(--accent); }
	.type-filter > button span { display: grid; place-items: center; width: 1.15rem; height: 1.15rem; border-radius: 99px; background: var(--accent); color: white; font-size: 0.63rem; }
	.type-panel { position: absolute; top: calc(100% + 0.75rem); right: 0; width: min(22rem, calc(100vw - 2rem)); padding: 1rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--surface); box-shadow: var(--shadow-lg); }
	.type-panel p { margin: 0 0 0.7rem; color: var(--muted); font-size: 0.72rem; }
	.type-panel > div { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.type-panel button { padding: 0.4rem 0.65rem; border: 1px solid var(--line); border-radius: 99px; background: var(--surface-2); color: var(--muted); font-size: 0.69rem; font-weight: 700; }
	.type-panel button.selected { border-color: var(--type); background: color-mix(in srgb, var(--type) 15%, var(--surface)); color: var(--type); }
	.clear { border-color: transparent; background: transparent; color: var(--muted); }
	.results-meta { display: flex; justify-content: space-between; min-height: 2.2rem; padding: 0 0.35rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.04em; }
	.results-meta p { margin: 0; }
	.results-meta strong { color: var(--text); }
	.sentinel { min-height: 2rem; padding-top: 1rem; }
	.end-mark { display: flex; align-items: center; gap: 1rem; margin-top: 2.5rem; color: var(--muted); font-size: 0.75rem; text-align: center; }
	.end-mark span { flex: 1; height: 1px; background: var(--line); }
	@media (max-width: 900px) { .hero { grid-template-columns: 1fr 14rem; } .hero-mark { width: 13rem; height: 13rem; } .toolbar { flex-wrap: wrap; } .search-field { flex-basis: calc(100% - 1rem); } }
	@media (max-width: 600px) { .hero { display: block; min-height: auto; margin-bottom: 2rem; } .hero-mark { display: none; } .toolbar { top: 4.5rem; } .select-field, .type-filter { flex: 1; } .select-field select, .type-filter > button { width: 100%; } .sort-field { flex-basis: 55%; } }
</style>
