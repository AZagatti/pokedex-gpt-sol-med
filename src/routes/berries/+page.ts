import { getBerries, getBerryImage } from "$lib/api/client";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
  const berries = await getBerries(fetch);
  const images = await Promise.all(
    berries.map(({ item }) => getBerryImage(fetch, item.url))
  );
  return {
    berries: berries.map((berry, index) => ({
      berry,
      image: images[index] ?? null,
    })),
  };
};
