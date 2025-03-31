import { readFields } from "@directus/sdk";
import type { Directus } from "../directus.js";
import type { Schema } from "../types/schema.js";

export async function fetchSchema(directus: Directus): Promise<Schema> {
	const fields = (await directus.request(readFields())) as {
		collection: string;
		field: string;
	}[];

	const schema: Schema = {};

	for (const field of fields) {
		// Ignore system tables
		if (field.collection.startsWith("directus_")) continue;

		if (Array.isArray(schema[field.collection])) {
			schema[field.collection]!.push(field.field);
		} else {
			schema[field.collection] = [field.field];
		}
	}

	return schema;
}
