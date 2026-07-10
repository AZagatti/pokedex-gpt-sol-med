import { browser } from "$app/environment";
import { writable } from "svelte/store";

const STORAGE_KEY = "pokedex-favorites";

function loadFavorites(): string[] {
  if (!browser) return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export const favorites = writable<string[]>(loadFavorites());

if (browser)
  favorites.subscribe((value) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  );

export function toggleFavorite(name: string): void {
  favorites.update((items) =>
    items.includes(name)
      ? items.filter((item) => item !== name)
      : [...items, name]
  );
}
