import type { z as zodType } from "zod";
import { z } from 'zod'
/**
 * Generates default values for a Zod schema object
 * This utility creates an object with empty/default values matching the structure of the provided schema
 * 
 * @param schema - A Zod object schema definition
 * @returns An object with default values for each field in the schema
 */
export const formatZodDefaultValues = (schema: z.ZodObject<any>) => {
    const zodSchemaShape = schema.shape
    const zodSchemaShapeKeys = Object.keys(zodSchemaShape)
    const zodSchemaShapeValues: string[] = Object.values(zodSchemaShape)
    const zodSchemaShapeValuesZodTypes = zodSchemaShapeValues.map((v: any) => v._def.typeName)
    const zodSchemaIterable = Array.from({ length: zodSchemaShapeKeys.length })
    const defaultValues = zodSchemaIterable.reduce<Record<string, any>>((acc, _, idx) => {
        return {
            ...acc,
            [zodSchemaShapeKeys[idx]]: zodSchemaShapeValuesZodTypes[idx] === "ZodEnum" ? undefined : ''
        };
    }, {});
    return defaultValues
}


export function reconstructZodSchema(schemaData: any) {

    if (schemaData.type === "object") {
        let schemaShape: any = {};

        for (const key in schemaData.properties) {
            const property = schemaData.properties[key];

            if (property.type === "string") {
                let stringSchema = z.string();
                if (property.minLength) {
                    stringSchema = stringSchema.min(property.minLength);
                }
                if (property.email) {
                    stringSchema = stringSchema.email();
                }
                schemaShape[key] = property.optional ? stringSchema.optional() : stringSchema;
            } else if (property.type === "number") {
                let numberSchema = z.number();
                if (property.integer) {
                    numberSchema = numberSchema.int();
                }
                if (property.positive) {
                    numberSchema = numberSchema.positive();
                }
                schemaShape[key] = property.optional ? numberSchema.optional() : numberSchema;
            }
            // Add more types as needed (boolean, date, etc.)
        }

        return z.object(schemaShape);
    }

    return null; // Or throw an error if the schema type is unsupported
}
