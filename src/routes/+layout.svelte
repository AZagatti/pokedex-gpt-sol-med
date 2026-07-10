<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#ef476f" />
	<meta name="description" content="Explore Pokémon, discover evolutions, and keep your favorites in a tactile modern Pokédex." />
	<meta property="og:title" content="Pokédex — Discover every Pokémon" />
	<meta property="og:description" content="A polished, fast Pokédex powered by PokéAPI." />
</svelte:head>
<a class="skip-link" href="#main-content">Skip to content</a>
<Header />
{@render children()}
<footer><p>Built with SvelteKit · Data from <a href="https://pokeapi.co/" rel="noreferrer">PokéAPI</a></p></footer>
