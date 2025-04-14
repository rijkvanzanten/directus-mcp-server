import * as dotenv from 'dotenv';
import * as z from 'zod';

const configSchema = z.object({
	DIRECTUS_URL: z.string(),
	DIRECTUS_TOKEN: z.string(),
});

export const createConfig = () => {
	dotenv.config();

	return configSchema.parse(process.env);
}

export type Config = z.infer<typeof configSchema>;
