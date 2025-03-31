#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	type CallToolRequest,
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createConfig } from "./config.js";
import { createDirectus } from "./directus.js";
import { getTools } from "./tools/index.js";
import { toMpcTools } from "./utils/to-mpc-tools.js";
import { fetchSchema } from "./utils/fetch-schema.js";

async function main() {
	const config = createConfig();
	const directus = createDirectus(config);
	const schema = await fetchSchema(directus);
	const tools = getTools(schema);

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

	// server.sendLoggingMessage({
	// 	level: "info",
	// 	data: "Server started successfully",
	// });

	server.setRequestHandler(
		CallToolRequestSchema,
		async (request: CallToolRequest) => {
			// server.sendLoggingMessage({
			// 	level: "debug",
			// 	data: `Received CallToolRequests: ${request}`,
			// });

			try {
				const tool = tools.find((definition) => {
					return definition.name === request.params.name;
				});

				if (!tool) {
					throw new Error(`Unknown tool: ${request.params.name}`);
				}

				const { inputSchema, handler } = tool;

				const args = inputSchema.parse(request.params.arguments);

				return await handler(directus, args, { schema });
			} catch (error) {
				console.error("Error executing tool:", error);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(error),
						},
					],
				};
			}
		},
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		// server.sendLoggingMessage({
		// 	level: "debug",
		// 	data: "Received ListToolsRequest",
		// });

		return { tools: toMpcTools(tools) };
	});

	const transport = new StdioServerTransport();

	// server.sendLoggingMessage({
	// 	level: "debug",
	// 	data: "Connecting server to transport...",
	// });

	await server.connect(transport);

	// server.sendLoggingMessage({
	// 	level: "debug",
	// 	data: "Directus MCP Server running on stdio",
	// });
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
