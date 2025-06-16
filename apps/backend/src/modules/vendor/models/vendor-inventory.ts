import { model } from '@medusajs/framework/utils'

/**
 * Tracks on-hand stock for a given variant scoped to a vendor (manufacturer or reseller).
 */
export const VendorInventory = model.define('vendor_inventory', {
    id: model.id({ prefix: 'vinv' }).primaryKey(),

    /**
     * The product variant this inventory row belongs to.
     * We store the variant id as string because the core ProductVariant model
     * lives in the Medusa package and we don't need a hard relation here.
     */
    variant_id: model.text(),

    /**
     * Owning vendor (manufacturer or reseller) id for this inventory record.
     * Stored as plain id to keep module isolation; linked to Seller via module link.
     */
    seller_id: model.text(),

    /**
     * Quantity that is currently available.
     */
    quantity: model.number().default(0),

    /**
     * Optional lead time in days for this vendor to restock / fulfill this variant.
     */
    lead_time: model.number().nullable(),
}) 