#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type CallToolRequest,
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { directus } from "./directus.js";
import { tools } from "./tools/index.js";
import { toMpcTools } from "./utils/to-mpc-tools.js";

async function main() {
	console.error("Starting Directus MCP Server...");

	const server = new Server(
		{
			name: "Directus MCP Server",
			version: "0.0.1",
		},
		{
			capabilities: {
				tools: {},
			},
		},
	);

	server.setRequestHandler(
		CallToolRequestSchema,
		async (request: CallToolRequest) => {
			console.error("Received CallToolRequest:", request);

			try {
				const tool = tools.find((definition) => {
					return definition.name === request.params.name;
				});

				if (!tool) {
					throw new Error(`Unknown tool: ${request.params.name}`);
				}

				const { inputSchema, handler } = tool;

				const args = inputSchema.parse(request.params.arguments);

				return await handler(directus, args);
			} catch (error) {
				console.error("Error executing tool:", error);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: error instanceof Error ? error.message : String(error),
							}),
						},
					],
				};
			}
		},
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		console.error("Received ListToolsRequest");

		return { tools: toMpcTools(tools) };
	});

	const transport = new StdioServerTransport();

	console.error("Connecting server to transport...");

	await server.connect(transport);

	console.error("Directus MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
