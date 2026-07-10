<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowUpRight, Clock3, Sprout } from 'lucide-svelte';
	import type { Berry } from '$lib/api/schemas';
	import { titleCase } from '$lib/utils/format';
	let { berry, image, index = 0 }: { berry: Berry; image: string | null; index?: number } = $props();
</script>

<article style={`--delay: ${Math.min(index, 12) * 35}ms`}>
	<a href={`${base}/berries/${berry.name}`}>
		<div class="berry-art"><span></span>{#if image}<img src={image} alt={`${titleCase(berry.name)} Berry`} loading="lazy" />{:else}<Sprout size={54} />{/if}</div>
		<div class="copy"><p>Berry #{berry.id.toString().padStart(3, '0')}</p><h2>{titleCase(berry.name)}</h2><div><span><Clock3 size={13} /> {berry.growth_time}h growth</span><span>{titleCase(berry.firmness.name)}</span></div></div>
		<ArrowUpRight class="arrow" size={18} />
	</a>
</article>

<style>
	article { overflow: hidden; border: 1px solid var(--line); border-radius: 1.4rem; background: var(--surface); box-shadow: var(--shadow-sm); opacity: 0; transform: translateY(14px); animation: arrive 0.5s ease forwards; animation-delay: var(--delay); transition: transform 0.25s ease, box-shadow 0.25s ease; }
	article:hover { transform: translateY(-5px) rotate(-0.4deg); box-shadow: var(--shadow-lg); }
	a { position: relative; display: block; height: 100%; padding: 1rem; }
	.berry-art { position: relative; display: grid; place-items: center; height: 11rem; overflow: hidden; border-radius: 1rem; background: linear-gradient(145deg, #f4e6df, #eef4e6); }
	:global(.dark) .berry-art { background: linear-gradient(145deg, #28202c, #1c2b24); }
	.berry-art span { position: absolute; width: 7rem; height: 7rem; border: 1px solid #ffffffaa; border-radius: 50%; background: #ffffff42; }
	.berry-art img { position: relative; z-index: 1; width: 7.5rem; height: 7.5rem; object-fit: contain; image-rendering: pixelated; filter: drop-shadow(0 15px 14px #3a23352d); }
	.copy { padding: 1rem 0.2rem 0.2rem; }
	.copy > p { margin: 0 0 0.2rem; color: var(--muted); font-family: var(--font-mono); font-size: 0.64rem; font-weight: 750; letter-spacing: 0.08em; text-transform: uppercase; }
	h2 { margin: 0 0 0.8rem; font-size: 1.35rem; letter-spacing: -0.04em; }
	.copy > div { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.copy span { display: flex; align-items: center; gap: 0.25rem; padding: 0.3rem 0.5rem; border-radius: 99px; background: var(--surface-2); color: var(--muted); font-size: 0.65rem; }
	:global(.arrow) { position: absolute; top: 1.7rem; right: 1.7rem; z-index: 2; color: #4f6654; }
	@keyframes arrive { to { opacity: 1; transform: none; } }
	@media (prefers-reduced-motion: reduce) { article { opacity: 1; transform: none; animation: none; } }
</style>
