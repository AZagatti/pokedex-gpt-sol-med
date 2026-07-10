<script lang="ts">let { count = 6 }: { count?: number } = $props();</script>
<div class="skeleton-grid" aria-label="Loading Pokémon" aria-busy="true">
	{#each Array(count) as _}
		<div class="skeleton"><span></span><i></i><b></b></div>
	{/each}
</div>

<style>
	.skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr)); gap: 1rem; }
	.skeleton { min-height: 22rem; padding: 1rem; border: 1px solid var(--line); border-radius: 1.5rem; background: var(--surface); }
	.skeleton > * { display: block; border-radius: 1rem; background: linear-gradient(90deg, var(--surface-2), color-mix(in srgb, var(--surface-2) 40%, white), var(--surface-2)); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
	.skeleton span { width: 4rem; height: 0.8rem; }
	.skeleton i { width: 11rem; height: 11rem; margin: 2rem auto 1.5rem; border-radius: 50%; }
	.skeleton b { width: 70%; height: 1.6rem; }
	@keyframes shimmer { to { background-position: -200% 0; } }
	@media (prefers-reduced-motion: reduce) { .skeleton > * { animation: none; } }
</style>
