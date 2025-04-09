import type { ToolDefinition } from "../types/tool.js";
import collections from "./collections.js";
import { createGenericReadItemsTool } from "./items.js";
import usersMe from "./users/me.js";

export const getTools = () => {
	const genericReadItemsTool = createGenericReadItemsTool();
	const staticTools: ToolDefinition[] = [
		usersMe,
		collections,
		genericReadItemsTool,
	];
	return staticTools;
};
