<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, ChevronRight, Play, Ruler, Shield, Sparkles, Weight } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { dexNumber, statLabel, titleCase } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let spriteKey = $state<'front' | 'back' | 'shiny'>('front');
	let isPlaying = $state(false);
	let audio: HTMLAudioElement;
	let primary = $derived(data.pokemon.types[0]?.type.name ?? 'normal');
	let artwork = $derived(data.pokemon.sprites.other['official-artwork'].front_default ?? data.pokemon.sprites.front_default);
	let selectedSprite = $derived(
		spriteKey === 'back'
			? data.pokemon.sprites.back_default
			: spriteKey === 'shiny'
				? data.pokemon.sprites.front_shiny
				: data.pokemon.sprites.front_default
	);
	let description = $derived(
		data.species.flavor_text_entries
			.find(({ language }) => language.name === 'en')
			?.flavor_text.replace(/[\n\f]/g, ' ') ?? 'A mysterious Pokémon waiting to be discovered.'
	);

	function playCry() {
		if (!data.pokemon.cries.latest) return;
		if (!audio) audio = new Audio(data.pokemon.cries.latest);
		audio.currentTime = 0;
		isPlaying = true;
		void audio.play().finally(() => setTimeout(() => (isPlaying = false), 700));
	}
</script>

<svelte:head>
	<title>{titleCase(data.pokemon.name)} · Pokédex</title>
	<meta name="description" content={`Stats, abilities, evolution chain, and sprites for ${titleCase(data.pokemon.name)}.`} />
</svelte:head>

<main id="main-content" class="detail-page type-card-{primary}">
	<div class="detail-shell">
		<div class="topbar">
			<a href={`${base}/`} class="back"><ArrowLeft size={18} /> All Pokémon</a>
			<span>{dexNumber(data.pokemon.id)}</span>
		</div>

		<section class="detail-hero" in:fly={{ y: 20, duration: 550 }}>
			<div class="hero-copy">
				<div class="types">{#each data.pokemon.types as item}<TypeBadge type={item.type.name} />{/each}</div>
				<h1>{titleCase(data.pokemon.name)}</h1>
				<p>{description}</p>
				<div class="hero-actions">
					<FavoriteButton name={data.pokemon.name} size="large" />
					{#if data.pokemon.cries.latest}<button type="button" class:playing={isPlaying} class="cry" onclick={playCry}><Play size={18} fill="currentColor" /> {isPlaying ? 'Playing cry…' : 'Play cry'}</button>{/if}
				</div>
			</div>
			<div class="hero-art"><span class="rings"></span><PokemonImage src={artwork} name={data.pokemon.name} eager /></div>
			<div class="quick-facts">
				<div><Ruler size={18} /><span>Height</span><strong>{(data.pokemon.height / 10).toFixed(1)} m</strong></div>
				<div><Weight size={18} /><span>Weight</span><strong>{(data.pokemon.weight / 10).toFixed(1)} kg</strong></div>
				<div><Sparkles size={18} /><span>Experience</span><strong>{data.pokemon.base_experience ?? '—'} XP</strong></div>
			</div>
		</section>

		<div class="info-grid">
			<section class="panel stats-panel">
				<div class="panel-title"><span><Shield size={19} /></span><div><p>Battle profile</p><h2>Base stats</h2></div></div>
				<div class="stats">
					{#each data.pokemon.stats as item, index}
						<div class="stat"><span>{statLabel(item.stat.name)}</span><strong>{item.base_stat}</strong><div><i style={`--value: ${Math.min(item.base_stat / 180 * 100, 100)}%; --delay: ${index * 90}ms`}></i></div></div>
					{/each}
				</div>
			</section>

			<section class="panel">
				<div class="panel-title"><span>✦</span><div><p>Innate talents</p><h2>Abilities</h2></div></div>
				<div class="abilities">{#each data.pokemon.abilities as item}<div><strong>{titleCase(item.ability.name)}</strong>{#if item.is_hidden}<span>Hidden ability</span>{:else}<span>Standard</span>{/if}</div>{/each}</div>
				<div class="moves"><p>Example moves</p><div>{#each data.pokemon.moves.slice(0, 8) as item}<span>{titleCase(item.move.name)}</span>{/each}</div></div>
			</section>
		</div>

		<section class="panel evolution-panel">
			<div class="panel-title"><span>↗</span><div><p>Growth path</p><h2>Evolution chain</h2></div></div>
			<div class="evolution-chain">
				{#each data.evolutions as pokemon, index}
					{#if index > 0}<ChevronRight class="arrow" size={24} aria-hidden="true" />{/if}
					<a href={`${base}/pokemon/${pokemon.name}`} class:current={pokemon.name === data.pokemon.name}>
						<PokemonImage src={pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default} name={pokemon.name} />
						<span>{dexNumber(pokemon.id)}</span><strong>{titleCase(pokemon.name)}</strong>
					</a>
				{/each}
			</div>
		</section>

		<section class="panel sprite-panel">
			<div><p class="kicker">Pixel archive</p><h2>Sprite variants</h2><p>Switch between classic in-game appearances.</p></div>
			<div class="sprite-view"><PokemonImage src={selectedSprite} name={`${data.pokemon.name} ${spriteKey} sprite`} /></div>
			<div class="sprite-tabs" aria-label="Sprite variant">
				{#each [['front', 'Front'], ['back', 'Back'], ['shiny', 'Shiny']] as variant}
					<button type="button" class:active={spriteKey === variant[0]} onclick={() => (spriteKey = variant[0] as typeof spriteKey)}>{variant[1]}</button>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	.detail-page { --hero-gradient: linear-gradient(135deg, color-mix(in srgb, var(--type) 22%, var(--surface)), var(--surface) 58%); min-height: 100vh; padding: 2rem 1.25rem 5rem; }
	.detail-shell { width: min(1160px, 100%); margin: 0 auto; }
	.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.77rem; font-weight: 750; }
	.back { display: flex; align-items: center; gap: 0.45rem; padding: 0.6rem 0; color: var(--text); font-family: var(--font-sans); }
	.detail-hero { position: relative; display: grid; grid-template-columns: 1fr 1fr; min-height: 32rem; overflow: hidden; border: 1px solid var(--line); border-radius: 2rem; background: var(--hero-gradient); box-shadow: var(--shadow-lg); }
	.hero-copy { z-index: 2; align-self: center; padding: clamp(2rem, 6vw, 5rem); padding-right: 1rem; }
	.types { display: flex; gap: 0.45rem; }
	.hero-copy h1 { margin: 1rem 0; font-size: clamp(3.5rem, 7vw, 6.5rem); }
	.hero-copy > p { max-width: 32rem; color: var(--muted); font-size: 1rem; line-height: 1.65; }
	.hero-actions { display: flex; align-items: center; gap: 0.7rem; margin-top: 1.5rem; }
	.cry { display: flex; align-items: center; gap: 0.5rem; height: 3rem; padding: 0 1rem; border: 0; border-radius: 0.9rem; background: var(--text); color: var(--bg); font-weight: 750; }
	.cry.playing :global(svg) { animation: pulse 0.5s infinite alternate; }
	.hero-art { position: relative; z-index: 1; min-height: 28rem; padding: 2rem; }
	.hero-art :global(.image-shell) { position: relative; z-index: 2; }
	.hero-art :global(img) { filter: drop-shadow(0 32px 28px color-mix(in srgb, var(--type) 35%, transparent)); }
	.rings { position: absolute; top: 50%; left: 50%; width: min(34vw, 25rem); aspect-ratio: 1; transform: translate(-50%, -50%); border: 1px solid color-mix(in srgb, var(--type) 30%, transparent); border-radius: 50%; box-shadow: 0 0 0 3rem color-mix(in srgb, var(--type) 5%, transparent), 0 0 0 6rem color-mix(in srgb, var(--type) 4%, transparent); }
	.quick-facts { position: absolute; right: 1.5rem; bottom: 1.5rem; left: 1.5rem; z-index: 3; display: grid; grid-template-columns: repeat(3, 1fr); max-width: 28rem; margin-left: auto; overflow: hidden; border: 1px solid var(--line); border-radius: 1rem; background: color-mix(in srgb, var(--surface) 80%, transparent); backdrop-filter: blur(14px); }
	.quick-facts div { display: grid; grid-template-columns: auto 1fr; gap: 0.05rem 0.5rem; padding: 0.85rem; border-right: 1px solid var(--line); }
	.quick-facts div:last-child { border: 0; }
	.quick-facts :global(svg) { grid-row: 1 / 3; align-self: center; color: var(--type); }
	.quick-facts span { color: var(--muted); font-size: 0.63rem; }
	.quick-facts strong { font-size: 0.78rem; }
	.info-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1rem; margin-top: 1rem; }
	.panel { padding: clamp(1.5rem, 3vw, 2.3rem); border: 1px solid var(--line); border-radius: 1.5rem; background: var(--surface); box-shadow: var(--shadow-sm); }
	.panel-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.6rem; }
	.panel-title > span { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 0.8rem; background: color-mix(in srgb, var(--type) 13%, var(--surface)); color: var(--type); font-weight: 900; }
	.panel-title p, .moves > p { margin: 0 0 0.1rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.62rem; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
	.panel h2 { margin: 0; font-size: 1.5rem; letter-spacing: -0.04em; }
	.stats { display: grid; gap: 0.78rem; }
	.stat { display: grid; grid-template-columns: 5rem 2.2rem 1fr; align-items: center; gap: 0.6rem; font-size: 0.74rem; }
	.stat > span { color: var(--muted); }
	.stat > div { height: 0.45rem; overflow: hidden; border-radius: 99px; background: var(--surface-2); }
	.stat i { display: block; width: var(--value); height: 100%; transform-origin: left; border-radius: inherit; background: linear-gradient(90deg, var(--type), color-mix(in srgb, var(--type) 55%, white)); animation: grow 0.8s ease-out both; animation-delay: var(--delay); }
	.abilities { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.65rem; }
	.abilities div { padding: 0.85rem; border: 1px solid var(--line); border-radius: 0.85rem; background: var(--surface-2); }
	.abilities strong, .abilities span { display: block; }
	.abilities strong { font-size: 0.83rem; }
	.abilities span { margin-top: 0.15rem; color: var(--muted); font-size: 0.64rem; }
	.moves { margin-top: 1.5rem; }
	.moves > div { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.6rem; }
	.moves span { padding: 0.32rem 0.55rem; border-radius: 99px; background: var(--surface-2); color: var(--muted); font-size: 0.67rem; }
	.evolution-panel { margin-top: 1rem; }
	.evolution-chain { display: flex; align-items: center; justify-content: center; gap: clamp(0.5rem, 3vw, 2rem); }
	.evolution-chain a { display: grid; place-items: center; width: min(12rem, 28%); padding: 1rem; border: 1px solid transparent; border-radius: 1.2rem; text-align: center; transition: background 0.2s, transform 0.2s; }
	.evolution-chain a:hover { transform: translateY(-3px); background: var(--surface-2); }
	.evolution-chain a.current { border-color: color-mix(in srgb, var(--type) 40%, var(--line)); background: color-mix(in srgb, var(--type) 8%, var(--surface)); }
	.evolution-chain :global(.image-shell) { height: 8rem; }
	.evolution-chain a > span { color: var(--muted); font-family: var(--font-mono); font-size: 0.62rem; }
	.evolution-chain a > strong { margin-top: 0.2rem; font-size: 0.83rem; }
	.arrow { color: var(--muted); }
	.sprite-panel { display: grid; grid-template-columns: 1fr 11rem auto; align-items: center; gap: 2rem; margin-top: 1rem; }
	.sprite-panel > div:first-child > p:last-child { color: var(--muted); font-size: 0.8rem; }
	.sprite-view { height: 9rem; padding: 0.5rem; border-radius: 50%; background: var(--surface-2); image-rendering: pixelated; }
	.sprite-tabs { display: flex; flex-direction: column; gap: 0.4rem; }
	.sprite-tabs button { min-width: 6rem; padding: 0.55rem 0.8rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--surface); color: var(--muted); font-size: 0.72rem; font-weight: 700; }
	.sprite-tabs button.active { border-color: var(--type); background: color-mix(in srgb, var(--type) 10%, var(--surface)); color: var(--type); }
	@keyframes grow { from { transform: scaleX(0); } }
	@keyframes pulse { to { transform: scale(1.2); } }
	@media (max-width: 760px) { .detail-page { padding: 1rem 0.75rem 3rem; } .detail-hero { grid-template-columns: 1fr; } .hero-copy { padding: 2rem 1.5rem 0; } .hero-copy h1 { font-size: 3.3rem; } .hero-art { min-height: 20rem; } .quick-facts { position: relative; right: auto; bottom: auto; left: auto; grid-column: 1; width: calc(100% - 2rem); margin: 0 auto 1rem; } .info-grid { grid-template-columns: 1fr; } .evolution-chain { gap: 0.25rem; } .evolution-chain a { padding: 0.4rem; } .evolution-chain :global(.image-shell) { height: 5rem; } .sprite-panel { grid-template-columns: 1fr 7rem; } .sprite-tabs { grid-column: 1 / -1; flex-direction: row; } }
</style>
