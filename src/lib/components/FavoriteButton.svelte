<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { favorites, toggleFavorite } from '$lib/stores/favorites';

	let { name, size = 'normal' }: { name: string; size?: 'normal' | 'large' } = $props();
	let isFavorite = $derived($favorites.includes(name));
</script>

<button
	type="button"
	class:active={isFavorite}
	class:large={size === 'large'}
	aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
	aria-pressed={isFavorite}
	onclick={(event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleFavorite(name);
	}}
>
	<Heart size={size === 'large' ? 24 : 19} fill={isFavorite ? 'currentColor' : 'none'} />
</button>

<style>
	button {
		display: grid;
		place-items: center;
		width: 2.35rem;
		height: 2.35rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface) 82%, transparent);
		color: var(--muted);
		backdrop-filter: blur(10px);
		transition: transform 0.2s ease, color 0.2s ease, background 0.2s ease;
	}
	button:hover { transform: scale(1.08); color: #ef476f; }
	button:active { transform: scale(0.9); }
	button.active { color: #ef476f; background: color-mix(in srgb, #ef476f 12%, var(--surface)); }
	button.large { width: 3rem; height: 3rem; }
</style>
