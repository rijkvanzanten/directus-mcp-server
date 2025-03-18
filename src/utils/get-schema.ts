import { schemaSnapshot, type SchemaSnapshotOutput } from "@directus/sdk";
import { directus } from "../directus.js";

let cache: SchemaSnapshotOutput | null = null;

export async function getSchema() {
	if (cache !== null) return cache;

	const snapshot = await directus.request(schemaSnapshot());

	cache = snapshot;

	return cache;
}
