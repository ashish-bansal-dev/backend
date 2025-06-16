import { z } from 'zod'

export const AdminCreateOrUpdateVariantPrice = z.object({
    buyer_type: z.enum(['admin', 'reseller', 'customer']),
    buyer_id: z.string().optional(),
    buyer_group_id: z.string().optional(),
    price: z.number().positive(),
})

export type AdminCreateOrUpdateVariantPriceType = z.infer<typeof AdminCreateOrUpdateVariantPrice> 