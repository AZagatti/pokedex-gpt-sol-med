<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowLeft, SearchX } from 'lucide-svelte';
</script>

<svelte:head><title>{page.status} · Pokédex</title></svelte:head>
<main id="main-content" class="error-page">
	<div class="error-orb" aria-hidden="true"><span></span></div>
	<p class="kicker">Error {page.status}</p>
	<h1>Wild page<br /><em>appeared.</em></h1>
	<p>{page.error?.message ?? 'This route wandered beyond the known regions.'}</p>
	<a class="primary-button" href={`${base}/`}><ArrowLeft size={17} /> Return to the Pokédex</a>
	<SearchX class="ghost" aria-hidden="true" />
</main>

<style>
	.error-page { position: relative; display: grid; place-items: center; min-height: calc(100vh - 8rem); padding: 4rem 1.5rem; overflow: hidden; text-align: center; }
	.error-page h1 { font-size: clamp(3.5rem, 10vw, 7rem); }
	.error-page h1 em { color: var(--accent); font-style: normal; }
	.error-page > p:not(.kicker) { max-width: 34rem; margin: 1.2rem auto 1.8rem; color: var(--muted); line-height: 1.6; }
	.error-orb { position: absolute; z-index: -1; width: min(65vw, 34rem); aspect-ratio: 1; border: 1px solid var(--line); border-radius: 50%; background: linear-gradient(transparent 48%, var(--line) 48% 52%, transparent 52%); opacity: 0.45; }
	.error-orb span { position: absolute; top: 50%; left: 50%; width: 5rem; height: 5rem; transform: translate(-50%, -50%); border: 0.6rem solid var(--line); border-radius: 50%; background: var(--bg); }
	:global(.ghost) { position: absolute; right: 8%; bottom: 10%; width: 8rem; height: 8rem; color: var(--line); transform: rotate(8deg); }
</style>
