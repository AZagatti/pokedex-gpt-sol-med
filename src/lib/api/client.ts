import { cachedFetch } from "./cache";
import {
  berrySchema,
  evolutionChainSchema,
  generationSchema,
  itemSchema,
  pokemonSchema,
  resourceListSchema,
  speciesSchema,
  typeSchema,
  type Berry,
  type EvolutionNode,
  type NamedResource,
  type Pokemon,
  type Species,
} from "./schemas";

export const API_URL = "https://pokeapi.co/api/v2";

export const getPokemon = (fetcher: typeof fetch, name: string | number) =>
  cachedFetch(fetcher, `${API_URL}/pokemon/${name}`, pokemonSchema);

export async function getPokemonPage(
  fetcher: typeof fetch,
  offset = 0,
  limit = 30
): Promise<Pokemon[]> {
  const list = await cachedFetch(
    fetcher,
    `${API_URL}/pokemon?limit=${limit}&offset=${offset}`,
    resourceListSchema
  );
  return Promise.all(list.results.map(({ name }) => getPokemon(fetcher, name)));
}

export async function getAllPokemonNames(
  fetcher: typeof fetch
): Promise<NamedResource[]> {
  return (
    await cachedFetch(
      fetcher,
      `${API_URL}/pokemon?limit=2000&offset=0`,
      resourceListSchema
    )
  ).results;
}

export async function getTypeNames(fetcher: typeof fetch): Promise<string[]> {
  const resources = (
    await cachedFetch(fetcher, `${API_URL}/type?limit=100`, resourceListSchema)
  ).results;
  return resources
    .map(({ name }) => name)
    .filter(
      (name) => name !== "unknown" && name !== "stellar" && name !== "shadow"
    );
}

export async function getTypePokemon(
  fetcher: typeof fetch,
  type: string
): Promise<string[]> {
  const data = await cachedFetch(
    fetcher,
    `${API_URL}/type/${type}`,
    typeSchema
  );
  return data.pokemon.map(({ pokemon }) => pokemon.name);
}

export async function getGenerationPokemon(
  fetcher: typeof fetch,
  id: number
): Promise<string[]> {
  const data = await cachedFetch(
    fetcher,
    `${API_URL}/generation/${id}`,
    generationSchema
  );
  return data.pokemon_species.map(({ name }) => name);
}

export async function getSpecies(
  fetcher: typeof fetch,
  name: string
): Promise<Species> {
  return cachedFetch(
    fetcher,
    `${API_URL}/pokemon-species/${name}`,
    speciesSchema
  );
}

export async function getEvolutionChain(
  fetcher: typeof fetch,
  url: string
): Promise<EvolutionNode | null> {
  return (await cachedFetch(fetcher, url, evolutionChainSchema)).chain;
}

export async function getBerries(
  fetcher: typeof fetch,
  limit = 64
): Promise<Berry[]> {
  const list = await cachedFetch(
    fetcher,
    `${API_URL}/berry?limit=${limit}`,
    resourceListSchema
  );
  return Promise.all(
    list.results.map(({ name }) =>
      cachedFetch(fetcher, `${API_URL}/berry/${name}`, berrySchema)
    )
  );
}

export const getBerry = (fetcher: typeof fetch, name: string) =>
  cachedFetch(fetcher, `${API_URL}/berry/${name}`, berrySchema);

export async function getBerryImage(
  fetcher: typeof fetch,
  itemUrl: string
): Promise<string | null> {
  return (await cachedFetch(fetcher, itemUrl, itemSchema)).sprites.default;
}

export function flattenEvolution(node: EvolutionNode | null): string[] {
  if (!node) return [];
  return [
    node.species.name,
    ...node.evolves_to.flatMap((child) => flattenEvolution(child)),
  ];
}

export function baseStatTotal(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
}
