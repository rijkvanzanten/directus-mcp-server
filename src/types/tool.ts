import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ZodType } from "zod";
import type { Directus } from "../directus.js";
import type { Schema } from "../types/schema.js";

export interface ToolDefinition<Params = any> {
	name: string;
	description: string;
	inputSchema: ZodType<Params>;
	handler: (
		directus: Directus,
		args: Params,
		ctx: { schema: Schema },
	) => Promise<CallToolResult>;
}
