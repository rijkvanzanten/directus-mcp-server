import { readItems } from "@directus/sdk";
import * as z from "zod";
import type { Schema } from "../types/schema.js";
import type { ToolDefinition } from "../types/tool.js";
import { defineTool } from "../utils/define-tool.js";

const createInputSchema = (input: string[]) => {
	if (input.length === 0) {
		return z.object({});
	}

	if (input.length === 1) {
		const field = input[0] as string;

		return z.object({
			fields: z.array(z.literal(field)),
			sort: z.enum([field, `-${field}`]),
			limit: z.number(),
		});
	}

	const fields = input as [string, ...string[]];

	return z.object({
		fields: z.array(z.enum(fields)),
		sort: z.enum([...fields, ...fields.map((f) => `-${f}`)]),
		limit: z.number(),
	});
};

export const createItemTools = (schema: Schema) => {
	const tools: ToolDefinition[] = [];

	for (const [collection, fields] of Object.entries(schema)) {
		tools.push(
			defineTool(`read-${collection.toLowerCase()}`, {
				description: `Read items from the "${collection}" collection`,
				inputSchema: createInputSchema(fields),
				handler: async (directus, query) => {
					const items = await directus.request(readItems(collection, query));
					return { content: [{ type: "text", text: JSON.stringify(items) }] };
				},
			}),
		);
	}

	return tools;
};
