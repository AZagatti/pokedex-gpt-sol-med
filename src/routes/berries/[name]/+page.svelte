<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Clock3, Droplets, Maximize2, Sprout, Wind } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { titleCase } from '$lib/utils/format';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let activeFlavors = $derived(data.berry.flavors.filter(({ potency }) => potency > 0));
</script>

<svelte:head><title>{titleCase(data.berry.name)} Berry · Pokédex</title></svelte:head>
<main id="main-content" class="berry-detail">
	<div class="shell">
		<a class="back" href={`${base}/berries`}><ArrowLeft size={18} /> All berries</a>
		<section in:fly={{ y: 20, duration: 500 }}>
			<div class="copy"><p class="kicker">Berry #{data.berry.id.toString().padStart(3, '0')}</p><h1>{titleCase(data.berry.name)}<br /><em>Berry</em></h1><p>A {titleCase(data.berry.firmness.name).toLowerCase()} berry with a carefully balanced flavor profile and a {data.berry.growth_time}-hour growth cycle.</p><div class="flavors">{#each activeFlavors as item}<span><i style={`--potency:${item.potency * 4}%`}></i><strong>{titleCase(item.flavor.name)}</strong><small>{item.potency}</small></span>{/each}</div></div>
			<div class="art"><span></span>{#if data.image}<img src={data.image} alt={`${titleCase(data.berry.name)} Berry`} />{:else}<Sprout size={120} />{/if}</div>
		</section>
		<div class="facts">
			<div><Clock3 /><span>Growth time</span><strong>{data.berry.growth_time} hours</strong></div>
			<div><Maximize2 /><span>Size</span><strong>{data.berry.size} mm</strong></div>
			<div><Wind /><span>Firmness</span><strong>{titleCase(data.berry.firmness.name)}</strong></div>
			<div><Droplets /><span>Soil dryness</span><strong>{data.berry.soil_dryness}</strong></div>
		</div>
	</div>
</main>

<style>
	.berry-detail { min-height: 100vh; padding: 2rem 1.25rem 5rem; background: radial-gradient(circle at 75% 25%, #84a87d20, transparent 30rem); }
	.shell { width: min(1060px, 100%); margin: 0 auto; }
	.back { display: inline-flex; align-items: center; gap: 0.45rem; margin-bottom: 1.5rem; color: var(--muted); font-size: 0.8rem; font-weight: 700; }
	section { display: grid; grid-template-columns: 1fr 1fr; align-items: center; min-height: 32rem; overflow: hidden; border: 1px solid var(--line); border-radius: 2rem; background: linear-gradient(135deg, var(--surface), color-mix(in srgb, #7ba675 14%, var(--surface))); box-shadow: var(--shadow-lg); }
	.copy { padding: clamp(2rem, 6vw, 5rem); padding-right: 1rem; }
	.copy h1 { margin-bottom: 1rem; }
	.copy h1 em { color: #6b9e69; font-style: normal; }
	.copy > p:not(.kicker) { color: var(--muted); line-height: 1.65; }
	.art { position: relative; display: grid; place-items: center; min-height: 28rem; }
	.art span { position: absolute; width: min(30vw, 20rem); aspect-ratio: 1; border: 1px solid #ffffffaa; border-radius: 50%; background: #ffffff32; box-shadow: 0 0 0 3rem #81a7780c; }
	.art img { position: relative; z-index: 1; width: min(25vw, 16rem); image-rendering: pixelated; filter: drop-shadow(0 2.5rem 1.5rem #314c3433); }
	.flavors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
	.flavors span { position: relative; display: grid; grid-template-columns: auto auto; min-width: 5.5rem; overflow: hidden; padding: 0.5rem 0.65rem; border: 1px solid var(--line); border-radius: 0.65rem; background: var(--surface); font-size: 0.7rem; }
	.flavors i { position: absolute; inset: auto 0 0; width: var(--potency); height: 2px; background: #6b9e69; }
	.flavors small { justify-self: end; color: var(--muted); }
	.facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
	.facts div { display: grid; grid-template-columns: auto 1fr; gap: 0.15rem 0.7rem; padding: 1.2rem; border: 1px solid var(--line); border-radius: 1rem; background: var(--surface); }
	.facts :global(svg) { grid-row: 1 / 3; align-self: center; width: 1.3rem; color: #6b9e69; }
	.facts span { color: var(--muted); font-size: 0.65rem; }
	.facts strong { font-size: 0.8rem; }
	@media (max-width: 700px) { section { grid-template-columns: 1fr; } .copy { padding: 2rem 1.5rem 0; } .art { min-height: 18rem; } .art img { width: 10rem; } .facts { grid-template-columns: repeat(2, 1fr); } }
</style>
