import type { ToolDefinition } from "../types/tool.js";
import collections from "./collections.js";
import { createGenericCreateItemTool, createGenericReadItemsTool } from "./items.js";
import { createGenericUploadFileTool, createGenericDownloadFileTool, createFileFromUrlTool } from "./file.js";
import usersMe from "./users/me.js";

export const getTools = () => {
	const genericReadItemsTool = createGenericReadItemsTool();
	const genericCreateItemTool = createGenericCreateItemTool();
	const genericUploadFileTool = createGenericUploadFileTool();
	const genericDownloadFileTool = createGenericDownloadFileTool();
	const fileFromUrlTool = createFileFromUrlTool();
	const staticTools: ToolDefinition[] = [
		usersMe,
		collections,
		genericReadItemsTool,
		genericCreateItemTool,
		genericUploadFileTool,
		genericDownloadFileTool,
		fileFromUrlTool,
	];
	return staticTools;
};
