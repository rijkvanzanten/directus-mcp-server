import { readItems } from "@directus/sdk";
import * as z from "zod";
import type { ToolDefinition } from "../../types/tool.js";
import { defineTool } from "../../utils/define-tool.js";
import { getSchema } from "../../utils/get-schema.js";

let itemTools: ToolDefinition[] | null = null;

export async function getItemTools() {
	if (itemTools !== null) {
		return itemTools;
	}

	const tools: ToolDefinition[] = [];

	const schema = await getSchema();

	for (const collection of schema.collections) {
		const collectionName = collection["collection"];

		tools.push(
			defineTool(`read-${collectionName}`, {
				description: `Read the items from the ${collectionName} collection`,
				inputSchema: z.object({
					fields: z.array(z.string()),
					sort: z.string(),
					limit: z.number(),
				}),
				handler: async (directus, args) => {
					const items = await directus.request(readItems(collectionName, args));
					return { content: [{ type: "text", text: JSON.stringify(items) }] };
				},
			}),
		);
	}

	itemTools = tools;

	return itemTools;
}
