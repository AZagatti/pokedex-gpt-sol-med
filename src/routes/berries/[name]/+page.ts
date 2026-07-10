import { getBerry, getBerryImage } from "$lib/api/client";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const prerender = false;

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const berry = await getBerry(fetch, params.name);
    const image = await getBerryImage(fetch, berry.item.url);
    return { berry, image };
  } catch {
    throw error(404, `We couldn't find the ${params.name} berry.`);
  }
};
