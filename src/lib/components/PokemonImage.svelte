<script lang="ts">
	let {
		src,
		name,
		class: className = '',
		eager = false
	}: { src: string | null; name: string; class?: string; eager?: boolean } = $props();

	let loaded = $state(false);
</script>

<div class="image-shell {className}" class:loaded>
	{#if src}
		<img
			{src}
			alt={`${name} official artwork`}
			loading={eager ? 'eager' : 'lazy'}
			fetchpriority={eager ? 'high' : 'auto'}
			onload={() => (loaded = true)}
		/>
	{:else}
		<span aria-label={`No artwork available for ${name}`}>?</span>
	{/if}
</div>

<style>
	.image-shell {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		color: var(--muted);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(0.9) translateY(8px);
		transition: opacity 0.35s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.loaded img {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		img { transition: none; transform: none; }
	}
</style>
