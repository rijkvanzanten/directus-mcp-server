import { zodToJsonSchema } from "zod-to-json-schema";
import type { ToolDefinition } from "../types/tool.js";

export const toMpcTools = (defs: ToolDefinition[]) => {
	return defs.map((def) => ({
		name: def.name,
		description: def.description,
		inputSchema: zodToJsonSchema(def.inputSchema),
	}));
};
