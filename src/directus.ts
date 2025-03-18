import { createDirectus, rest, staticToken } from "@directus/sdk";
import { config } from "./config.js";

export const directus = createDirectus(config.DIRECTUS_URL)
	.with(rest())
	.with(staticToken(config.DIRECTUS_TOKEN));
