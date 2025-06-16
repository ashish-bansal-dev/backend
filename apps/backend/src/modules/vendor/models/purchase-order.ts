import { model } from '@medusajs/framework/utils'

/**
 * Represents a Purchase Order created by one vendor (usually a reseller) to buy from another (usually a manufacturer).
 */
export const PurchaseOrder = model.define('purchase_order', {
    id: model.id({ prefix: 'po' }).primaryKey(),

    display_id: model.number().nullable(),

    /**
     * Seller that is buying (reseller).
     */
    buyer_id: model.text(),

    /**
     * Seller that is selling (manufacturer).
     */
    seller_id: model.text(),

    status: model
        .enum(['requested', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .default('requested'),

    /**
     * JSON array of items: [{ variant_id, quantity, unit_price }]
     */
    items: model.json(),

    shipping_info: model.json().nullable(),

    // Potentially add timestamps via workflow/hooks if needed.
}) 