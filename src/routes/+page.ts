import { getPokemonPage, getTypeNames } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
  const [pokemon, types] = await Promise.all([
    getPokemonPage(fetch, 0, 30),
    getTypeNames(fetch),
  ]);
  return { pokemon, types };
};
