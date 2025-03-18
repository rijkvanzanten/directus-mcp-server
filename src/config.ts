import * as z from 'zod';
import dotenv from 'dotenv';

const configSchema = z.object({
	DIRECTUS_URL: z.string(),
	DIRECTUS_TOKEN: z.string(),
});

dotenv.config();

export const config = configSchema.parse(process.env);
