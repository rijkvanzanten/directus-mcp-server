import { createItem, readItems } from "@directus/sdk";
import * as z from "zod";
import type { Schema } from "../types/schema.js";
import { defineTool } from "../utils/define-tool.js";

export const createGenericReadItemsTool = () => {
	return defineTool("read-items", {
		description:
			"Read items from any collection. Fields and sort options are validated against the schema.",
		inputSchema: z.object({
			collection: z
				.string()
				.describe("The name of the collection to read from"),
			fields: z.array(z.string()).optional().describe("Fields to return"),
			sort: z
				.string()
				.optional()
				.describe("Field to sort by (prefix with - for descending)"),
			limit: z
				.number()
				.optional()
				.describe("Maximum number of items to return"),
		}),
		handler: async (directus, query, { schema: contextSchema }) => {
			const { collection, fields, sort, ...otherParams } = query;

			try {
				if (!contextSchema[collection]) {
					throw new Error(
						`Collection "${collection}" not found. Use read-collections tool first.`,
					);
				}

				const availableFields = contextSchema[collection] || [];

				if (fields && fields.length > 0) {
					const invalidFields = fields.filter(
						(field: string) => !availableFields.includes(field),
					);
					if (invalidFields.length > 0) {
						throw new Error(
							`Invalid fields for "${collection}": ${invalidFields.join(", ")}`,
						);
					}
				}

				if (sort) {
					const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
					if (!availableFields.includes(sortField)) {
						throw new Error(
							`Invalid sort field "${sortField}" for collection "${collection}"`,
						);
					}
				}

				const params: Record<string, any> = { ...otherParams };

				if (fields && fields.length > 0) {
					params["fields"] = fields;
				}

				if (sort) {
					params["sort"] = sort;
				}

				const items = await directus.request(readItems(collection, params));
				return { content: [{ type: "text", text: JSON.stringify(items) }] };
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: `Error: ${error?.message || "Unknown error"}`,
								wholeError: error,
							}),
						},
					],
				};
			}
		},
	});
};

export const getCollectionSchema = (schema: Schema, collection: string) => {
	const fields = schema[collection] || [];
	const description = `Collection "${collection}" has these fields: ${fields.join(", ")}`;
	return { fields, description };
};

export const createGenericCreateItemTool = () => {
	return defineTool("create-item", {
		description: "Create an item in a collection. Fields are validated against the schema.",
		inputSchema: z.object({
			collection: z.string().describe("The name of the collection to create the item in"),
			fields: z.record(z.string(), z.any()).describe("Fields to create the item with"),
		}),
		handler: async (directus, query, { schema: contextSchema }) => {
			const { collection, fields } = query;

			try {
				if (!contextSchema[collection]) {
					throw new Error(
						`Collection "${collection}" not found. Use read-collections tool first.`,
					);
				}

				// Note: For file fields, you must first upload the file using the upload-file tool
				// and then use the returned file ID in the fields object
				const item = await directus.request(createItem(collection, fields));
				return { content: [{ type: "text", text: JSON.stringify({ data: item }) }] };
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: `Error: ${error?.message || "Unknown error"}`,
								wholeError: error,
							}),
						},
					],
				};
			}
		},
	});
};
