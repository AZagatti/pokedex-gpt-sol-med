import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type Theme = "light" | "dark";

function initialTheme(): Theme {
  if (!browser) return "light";
  const saved = localStorage.getItem("pokedex-theme");
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const theme = writable<Theme>(initialTheme());

if (browser) {
  theme.subscribe((value) => {
    document.documentElement.classList.toggle("dark", value === "dark");
    document.documentElement.style.colorScheme = value;
    localStorage.setItem("pokedex-theme", value);
  });
}

export function toggleTheme(): void {
  theme.update((value) => (value === "light" ? "dark" : "light"));
}
