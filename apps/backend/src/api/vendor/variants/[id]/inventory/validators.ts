import { z } from 'zod'

export const VendorAdjustVariantInventory = z.object({
    delta: z.number().optional(),
    quantity: z.number().optional(),
}).refine((data) => data.delta !== undefined || data.quantity !== undefined, {
    message: 'Either delta or quantity must be provided',
})

export type VendorAdjustVariantInventoryType = z.infer<typeof VendorAdjustVariantInventory> 