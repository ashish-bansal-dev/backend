import { model } from '@medusajs/framework/utils'

/**
 * Holds custom pricing for a variant scoped by seller and buyer context.
 */
export const VendorPrice = model.define('vendor_price', {
    id: model.id({ prefix: 'vprc' }).primaryKey(),

    /**
     * The product variant this price entry is for.
     */
    variant_id: model.text(),

    /**
     * Vendor (seller) id owning this price. Stored as raw id to respect module isolation.
     */
    seller_id: model.text(),

    /**
     * Who the price is intended for.
     */
    buyer_type: model.enum(['admin', 'reseller', 'customer']),

    /**
     * Optional direct buyer override (e.g. reseller_id or customer_id).
     */
    buyer_id: model.text().nullable(),

    /**
     * Optional buyer group override.
     */
    buyer_group_id: model.text().nullable(),

    /**
     * Unit price (in smallest currency unit, e.g. cents).
     */
    price: model.number(),
}) 