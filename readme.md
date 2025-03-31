# Directus Model Context Protocol (MCP) Server

MCP server for use with Directus. Allows your AI tools to connect to and use your Directus API on
your behalf.

This is an experiment by yours truly (@rijkvanzanten). Any and all PRs are more than welcome :)

## Installation

This MCP server is built to work with NodeJS v22.12 or newer.

### Global Installation (Recommended)

`npm install -g @rijk/directus-mcp-server`

Then configure Claude AI to use the `npm` package as remote server:

```json
{
	"mcpServers": {
		"directus": {
			"command": "directus-mcp-server",
			"env": {
				"DIRECTUS_URL": "<your Directus instance URL>",
				"DIRECTUS_TOKEN": "<your Directus user token>"
			}
		}
	}
}
```

### Local / Dev Installation

1. Clone the repo
2. `pnpm install && pnpm build` to build the server
3. Configure Claude AI like above, but pointing it to the `dist` file instead:

```json
{
	"mcpServers": {
		"directus": {
			"command": "node",
			"args": ["/path/to/directus-mcp-server/dist/index.js"]
		}
	}
}
```

## Tools

### Read Items

Read items from a collection. The MCP server will automatically generate one tool per collection. It currently accepts `fields`, `sort`, and `limit` as parameters

### Read Current User

Get information about the current user. Effectively the `/users/me` endpoint.

## Installation

```
pnpm add @rijk/directus-mcp-server
```

## Development

To build a `dist` copy of the project:

```
pnpm build
```

### Dev mode

To watch for changes and auto restart the server, use:

```
pnpm dev
```

## License

MIT
