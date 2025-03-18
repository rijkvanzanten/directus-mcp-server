import { readMe } from "@directus/sdk";
import * as z from "zod";
import { defineTool } from "../../utils/define-tool.js";

export default defineTool("users-me", {
	description: "Retrieve information about the current user",
	inputSchema: z.object({
		fields: z.array(z.string()),
	}),
	handler: async (directus, { fields }) => {
		const me = await directus.request(readMe({ fields }));

		return { content: [{ type: "text", text: JSON.stringify(me) }] };
	},
});
