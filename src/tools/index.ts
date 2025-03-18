import type { ToolDefinition } from "../types/tool.js";

import { getItemTools } from "./items/generate.js";
import collections from "./collections.js";
import usersMe from "./users/me.js";

const staticTools: ToolDefinition[] = [usersMe, collections];

export async function getTools() {
	const itemTools = await getItemTools();
	return [...staticTools, ...itemTools];
}
