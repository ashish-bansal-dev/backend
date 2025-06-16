import { z } from 'zod'

export const AdminAdjustVariantInventory = z.object({
    delta: z.number().optional(),
    quantity: z.number().optional(),
}).refine((d) => d.delta !== undefined || d.quantity !== undefined, {
    message: 'Either delta or quantity must be provided',
})

export type AdminAdjustVariantInventoryType = z.infer<typeof AdminAdjustVariantInventory> 