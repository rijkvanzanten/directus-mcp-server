import type { Schema } from "../types/schema.js";
import type { AnyZodObject, ZodTypeAny, ZodLiteral } from "zod";
import * as z from "zod";

export const toInputSchema = (schema: Schema) => {
	const schemas: AnyZodObject[] = [];

	for (const [collection, fields] of Object.entries(schema)) {
		let fieldType: ZodTypeAny = z.null();

		if (fields.length === 1) {
			fieldType = z.literal(fields[0]);
		}

		if (fields.length > 1) {
			fieldType = z.union(
				fields.map((f) => z.literal(f)) as [
					ZodLiteral<string>,
					ZodLiteral<string>,
					...ZodLiteral<string>[],
				],
			);
		}

		schemas.push(
			z.object({
				collection: z.literal(collection),
				fields: z.array(fieldType),
				sort: fieldType,
				limit: z.number(),
			}),
		);
	}

	if (schemas.length === 0) {
		return z.object({});
	}

	if (schemas.length === 1) {
		return schemas[0] as AnyZodObject;
	}

	return z.union(schemas as [AnyZodObject, AnyZodObject, ...AnyZodObject[]]);
};
