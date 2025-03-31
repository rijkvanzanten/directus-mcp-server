import * as z from "zod";
import { defineTool } from "../utils/define-tool.js";

export default defineTool("read-collections", {
	description: "Retrieve the schema of the connected Directus instance",
	inputSchema: z.object({}),
	handler: async (_directus, _args, { schema }) => {
		return { content: [{ type: "text", text: JSON.stringify(schema) }] };
	},
});
