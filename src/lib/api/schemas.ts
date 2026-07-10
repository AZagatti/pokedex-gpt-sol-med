import { z } from "zod";

export const namedResourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const resourceListSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(namedResourceSchema),
});

export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  cries: z.object({
    latest: z.string().url().nullable(),
    legacy: z.string().url().nullable(),
  }),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    back_default: z.string().url().nullable(),
    front_shiny: z.string().url().nullable(),
    back_shiny: z.string().url().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().url().nullable(),
        front_shiny: z.string().url().nullable(),
      }),
    }),
  }),
  types: z.array(z.object({ slot: z.number(), type: namedResourceSchema })),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: namedResourceSchema,
    })
  ),
  abilities: z.array(
    z.object({
      ability: namedResourceSchema,
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  moves: z.array(z.object({ move: namedResourceSchema })),
  species: namedResourceSchema,
});

export const typeSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({ pokemon: namedResourceSchema, slot: z.number() })
  ),
});

export const generationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(namedResourceSchema),
});

export const speciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({ url: z.string().url() }).nullable(),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedResourceSchema,
      version: namedResourceSchema,
    })
  ),
});

type EvolutionNodeShape = {
  species: z.infer<typeof namedResourceSchema>;
  evolves_to: EvolutionNodeShape[];
};

const evolutionNodeSchema: z.ZodType<EvolutionNodeShape> = z.lazy(() =>
  z.object({
    species: namedResourceSchema,
    evolves_to: z.array(evolutionNodeSchema),
  })
);

export const evolutionChainSchema = z.object({
  id: z.number(),
  chain: evolutionNodeSchema,
});

export const berrySchema = z.object({
  id: z.number(),
  name: z.string(),
  growth_time: z.number(),
  max_harvest: z.number(),
  natural_gift_power: z.number(),
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
  firmness: namedResourceSchema,
  flavors: z.array(
    z.object({ potency: z.number(), flavor: namedResourceSchema })
  ),
  item: namedResourceSchema,
});

export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  sprites: z.object({ default: z.string().url().nullable() }),
});

export type NamedResource = z.infer<typeof namedResourceSchema>;
export type Pokemon = z.infer<typeof pokemonSchema>;
export type Berry = z.infer<typeof berrySchema>;
export type Species = z.infer<typeof speciesSchema>;
export type EvolutionNode = EvolutionNodeShape;
