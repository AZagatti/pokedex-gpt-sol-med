import {
  flattenEvolution,
  getEvolutionChain,
  getPokemon,
  getSpecies,
} from "$lib/api/client";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const pokemon = await getPokemon(fetch, params.name);
    const species = await getSpecies(fetch, pokemon.species.name);
    const chain = species.evolution_chain
      ? await getEvolutionChain(fetch, species.evolution_chain.url)
      : null;
    const evolutionNames = flattenEvolution(chain);
    const evolutions = await Promise.all(
      evolutionNames.map((name) => getPokemon(fetch, name))
    );
    return { pokemon, species, evolutions };
  } catch {
    throw error(404, `We couldn't find “${params.name}”.`);
  }
};
