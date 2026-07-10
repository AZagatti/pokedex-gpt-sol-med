<script lang="ts">
	import { base } from '$app/paths';
	import type { Pokemon } from '$lib/api/schemas';
	import { dexNumber, titleCase } from '$lib/utils/format';
	import FavoriteButton from './FavoriteButton.svelte';
	import PokemonImage from './PokemonImage.svelte';
	import TypeBadge from './TypeBadge.svelte';

	let { pokemon, index = 0 }: { pokemon: Pokemon; index?: number } = $props();
	let primary = $derived(pokemon.types[0]?.type.name ?? 'normal');
	let artwork = $derived(pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default);
</script>

<article class="pokemon-card type-card-{primary}" style={`--delay: ${Math.min(index, 12) * 35}ms`}>
	<a href={`${base}/pokemon/${pokemon.name}`} aria-label={`View ${titleCase(pokemon.name)}, ${dexNumber(pokemon.id)}`}>
		<div class="card-top">
			<span class="dex">{dexNumber(pokemon.id)}</span>
			<FavoriteButton name={pokemon.name} />
		</div>
		<div class="artwork"><span class="orb"></span><PokemonImage src={artwork} name={pokemon.name} /></div>
		<div class="card-copy">
			<p class="eyebrow">Pocket monster</p>
			<h2>{titleCase(pokemon.name)}</h2>
			<div class="types">{#each pokemon.types as item}<TypeBadge type={item.type.name} />{/each}</div>
		</div>
	</a>
</article>

<style>
	.pokemon-card { position: relative; min-height: 22rem; overflow: hidden; border: 1px solid var(--line); border-radius: 1.5rem; background: var(--surface); box-shadow: var(--shadow-sm); opacity: 0; transform: translateY(18px); animation: card-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: var(--delay); transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease; }
	.pokemon-card::before { position: absolute; inset: 0; background: radial-gradient(circle at 75% 20%, var(--type-soft, #94a3b833), transparent 48%); content: ''; pointer-events: none; }
	.pokemon-card:hover { transform: translateY(-6px); border-color: color-mix(in srgb, var(--type, var(--accent)) 45%, var(--line)); box-shadow: 0 22px 55px color-mix(in srgb, var(--type, #64748b) 18%, transparent); }
	a { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; padding: 1rem; color: inherit; }
	.card-top { display: flex; align-items: center; justify-content: space-between; }
	.dex { color: var(--muted); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; }
	.artwork { position: relative; height: 13rem; margin: -0.5rem 0 -0.3rem; }
	.artwork :global(img) { filter: drop-shadow(0 18px 18px color-mix(in srgb, var(--type, #64748b) 30%, transparent)); }
	.orb { position: absolute; top: 50%; left: 50%; width: 9.5rem; height: 9.5rem; transform: translate(-50%, -50%); border: 1px solid color-mix(in srgb, var(--type, #64748b) 20%, transparent); border-radius: 50%; background: color-mix(in srgb, var(--type-soft, #94a3b833) 60%, transparent); }
	.card-copy { margin-top: auto; padding: 0.35rem 0.25rem 0.2rem; }
	.eyebrow { margin-bottom: 0.15rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.11em; text-transform: uppercase; }
	h2 { margin: 0 0 0.75rem; font-size: clamp(1.35rem, 2vw, 1.7rem); font-weight: 820; letter-spacing: -0.045em; }
	.types { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	@keyframes card-in { to { opacity: 1; transform: translateY(0); } }
	@media (prefers-reduced-motion: reduce) { .pokemon-card { opacity: 1; transform: none; animation: none; transition: none; } }
</style>
