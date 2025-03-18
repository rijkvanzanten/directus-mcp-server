import * as z from "zod";
import { defineTool } from "../utils/define-tool.js";
import { getSchema } from "../utils/get-schema.js";

export default defineTool("read-collections", {
	description: "Retrieve the schema of the connected Directus instance",
	inputSchema: z.object({}),
	handler: async () => {
		const schema = await getSchema();

		const collections = schema.collections.map((collection) => {
			const fields = schema.fields.filter((field) => {
				return field['collection'] === collection['collection'];
			}).map((field) => field['field']);

			return {
				collection: collection['collection'],
				fields
			};
		});

		return { content: [{ type: "text", text: JSON.stringify(collections) }] };
	},
});
