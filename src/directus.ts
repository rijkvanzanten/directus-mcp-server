import type {
	DirectusClient,
	RestClient,
	StaticTokenClient,
} from "@directus/sdk";
import { createDirectus as createSdk, rest, staticToken } from "@directus/sdk";
import type { Config } from "./config.js";

export const createDirectus = (config: Config) =>
	createSdk(config.DIRECTUS_URL)
		.with(staticToken(config.DIRECTUS_TOKEN))
		.with(rest());

export type Directus = DirectusClient<any> &
	StaticTokenClient<any> &
	RestClient<any>;
