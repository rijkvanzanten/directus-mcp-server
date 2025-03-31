import type { Schema } from "../types/schema.js";
import type { ToolDefinition } from "../types/tool.js";
import collections from "./collections.js";
import { createItemTools } from "./items.js";
import usersMe from "./users/me.js";

const staticTools: ToolDefinition[] = [usersMe, collections];

export const getTools = (schema: Schema) => {
	return [...staticTools, ...createItemTools(schema)];
};
