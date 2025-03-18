import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ZodType } from "zod";
import { directus as directusSdk } from "../directus.js";

export interface ToolDefinition<Params = any> {
	name: string;
	description: string;
	inputSchema: ZodType<Params>;
	handler: (
		directus: typeof directusSdk,
		param: Params,
	) => Promise<CallToolResult>;
}
