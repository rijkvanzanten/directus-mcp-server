import { readItems } from '@directus/sdk'
import * as z from 'zod'
import { defineTool } from '../utils/define-tool.js'

export const genericReadItemsTool = defineTool('read-items', {
	description: 'Read items from any collection by providing the collection name',
	inputSchema: z.object({
		collection: z.string().describe('The name of the collection to read from'),
		fields: z.array(z.string()).optional().describe('Fields to return'),
		sort: z.string().optional().describe('Field to sort by (prefix with - for descending)'),
		limit: z.number().optional().describe('Maximum number of items to return')
	}),
	handler: async (directus, query) => {
		const { collection, ...params } = query
		const items = await directus.request(readItems(collection, params))
		return { content: [{ type: 'text', text: JSON.stringify(items) }] }
	}
})
