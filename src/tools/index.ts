import type { Schema } from "../types/schema.js";
import type { ToolDefinition } from "../types/tool.js";
import collections from "./collections.js";
import { genericReadItemsTool } from "./items.js";
import usersMe from "./users/me.js";

const tools: ToolDefinition[] = [usersMe, collections, genericReadItemsTool];

export const getTools = (_schema: Schema) => {
	return tools;
};
