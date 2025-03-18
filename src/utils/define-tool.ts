import type { ToolDefinition } from "../types/tool.js";

export const defineTool = (
	name: string,
	tool: Omit<ToolDefinition, "name">,
) => ({ name, ...tool });
