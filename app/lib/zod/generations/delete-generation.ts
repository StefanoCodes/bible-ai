import { z } from 'zod';
export const deleteGenerationRequestSchema = z.object({
    generationId: z.string().min(1),
})

export type DeleteGenerationRequest = z.infer<typeof deleteGenerationRequestSchema>;