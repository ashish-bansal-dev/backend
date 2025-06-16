import { z } from "zod"

// ------------------------------
// GET /vendor/variants/prices
// ------------------------------
export const VendorBatchGetVariantPrices = z.object({
    variant_ids: z.union([z.string(), z.array(z.string())]),
})

// ------------------------------
// POST /vendor/variants/prices/batch
// ------------------------------
export const VendorBatchVariantPrices = z.object({
    prices: z.array(
        z.object({
            variant_id: z.string(),
            buyer_type: z.enum(["admin", "reseller", "customer"]),
            buyer_id: z.string().optional(),
            buyer_group_id: z.string().optional(),
            price: z.number(),
        })
    ),
})

export type VendorBatchVariantPricesType = z.infer<
    typeof VendorBatchVariantPrices
> 