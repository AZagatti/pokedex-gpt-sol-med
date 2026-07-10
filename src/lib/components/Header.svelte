<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { Heart, Moon, Sun } from 'lucide-svelte';
	import { favorites } from '$lib/stores/favorites';
	import { theme, toggleTheme } from '$lib/stores/theme';

	const links = [
		{ href: '/', label: 'Pokédex' },
		{ href: '/berries', label: 'Berries' },
		{ href: '/favorites', label: 'Favorites' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === `${base}/` || page.url.pathname === base : page.url.pathname.startsWith(`${base}${href}`);
</script>

<header>
	<a class="brand" href={`${base}/`} aria-label="Pokédex home">
		<span class="pokeball" aria-hidden="true"><i></i></span>
		<span>Poké<span>dex</span></span>
	</a>
	<nav aria-label="Primary navigation">
		{#each links as link}
			<a href={`${base}${link.href}`} class:active={isActive(link.href)}>
				{link.label}
				{#if link.href === '/favorites' && $favorites.length > 0}
					<span class="count">{$favorites.length}</span>
				{/if}
			</a>
		{/each}
	</nav>
	<div class="actions">
		<a class="mobile-heart" href={`${base}/favorites`} aria-label={`${$favorites.length} favorites`}><Heart size={19} /><span>{$favorites.length}</span></a>
		<button type="button" onclick={toggleTheme} aria-label={`Switch to ${$theme === 'dark' ? 'light' : 'dark'} theme`}>
			{#if $theme === 'dark'}<Sun size={19} />{:else}<Moon size={19} />{/if}
		</button>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 4.75rem;
		padding: 0 max(1.25rem, calc((100vw - 1280px) / 2));
		border-bottom: 1px solid var(--line);
    background: var(--bg);
	}
	.brand { display: flex; align-items: center; gap: 0.65rem; color: var(--text); font-size: 1.3rem; font-weight: 850; letter-spacing: -0.04em; }
	.brand > span:last-child span { color: var(--accent); }
	.pokeball { position: relative; width: 2rem; height: 2rem; overflow: hidden; border: 3px solid var(--text); border-radius: 50%; background: linear-gradient(#ed3d5b 0 45%, var(--text) 46% 54%, white 55%); box-shadow: 0 4px 12px #ef476f33; }
	.pokeball i { position: absolute; inset: 50% auto auto 50%; width: 0.58rem; height: 0.58rem; transform: translate(-50%, -50%); border: 2px solid var(--text); border-radius: 50%; background: white; }
	nav { display: flex; align-items: center; gap: 0.3rem; }
	nav a { position: relative; padding: 0.65rem 0.9rem; border-radius: 0.8rem; color: var(--muted); font-size: 0.91rem; font-weight: 700; transition: color 0.2s ease, background 0.2s ease; }
	nav a:hover, nav a.active { color: var(--text); background: var(--surface-2); }
	nav a.active::after { position: absolute; right: 0.8rem; bottom: 0.25rem; left: 0.8rem; height: 2px; border-radius: 2px; background: var(--accent); content: ''; }
	.count { margin-left: 0.35rem; padding: 0.08rem 0.38rem; border-radius: 99px; background: var(--accent); color: white; font-size: 0.67rem; }
	.actions, .mobile-heart { display: flex; align-items: center; gap: 0.55rem; }
	.actions button, .mobile-heart { display: grid; place-items: center; width: 2.65rem; height: 2.65rem; border: 1px solid var(--line); border-radius: 0.85rem; background: var(--surface); color: var(--text); transition: transform 0.2s ease, background 0.2s ease; }
	.actions button:hover { transform: rotate(8deg); background: var(--surface-2); }
	.mobile-heart { display: none; width: auto; padding: 0 0.7rem; }
	@media (max-width: 660px) {
		header { min-height: 4rem; padding: 0 1rem; }
		nav a { display: none; }
		nav a:first-child, nav a:nth-child(2) { display: block; padding: 0.55rem 0.6rem; font-size: 0.82rem; }
		.mobile-heart { display: flex; }
		.brand { font-size: 1.1rem; }
		.pokeball { width: 1.65rem; height: 1.65rem; }
	}
</style>
