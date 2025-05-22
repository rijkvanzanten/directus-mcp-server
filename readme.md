> [!WARNING]
> This was an experimental MCP server to test the waters and see what it would allow us to do. We've since released an official Directus MCP server over on https://github.com/directus/mcp 🙂

---

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

The `read-items` tool allows you to read items from any Directus collection by providing the collection name as a parameter.

Parameters:
- `collection`: (required) The name of the collection to read from
- `fields`: (optional) Array of field names to return
- `sort`: (optional) Field to sort by (prefix with `-` for descending order)
- `limit`: (optional) Maximum number of items to return

Example:
```json
{
  "collection": "articles",
  "fields": ["id", "title", "date_published"],
  "sort": "-date_published",
  "limit": 10
}
```

### Read Current User

Get information about the current user. Effectively the `/users/me` endpoint.

### Read Collections

Return what collections/fields are available in the system. Use this tool first to discover available collections before using the `read-items` tool.

## License

MIT
