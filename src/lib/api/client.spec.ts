import { describe, expect, it } from "vitest";

import { baseStatTotal, flattenEvolution } from "./client";
import type { EvolutionNode, Pokemon } from "./schemas";

describe("API helpers", () => {
  it("flattens branching evolution chains in display order", () => {
    const resource = (name: string) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon-species/${name}`,
    });
    const chain: EvolutionNode = {
      species: resource("eevee"),
      evolves_to: [
        { species: resource("vaporeon"), evolves_to: [] },
        { species: resource("jolteon"), evolves_to: [] },
      ],
    };
    expect(flattenEvolution(chain)).toEqual(["eevee", "vaporeon", "jolteon"]);
  });

  it("totals base stats", () => {
    const pokemon = {
      stats: [{ base_stat: 45 }, { base_stat: 49 }, { base_stat: 49 }],
    } as Pokemon;
    expect(baseStatTotal(pokemon)).toBe(143);
  });
});
