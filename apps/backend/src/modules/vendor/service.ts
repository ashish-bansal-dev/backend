import { MedusaService } from '@medusajs/framework/utils'

import { VendorInventory, VendorPrice, PurchaseOrder } from './models'

type BuyerContext = {
    buyerType: 'admin' | 'reseller' | 'customer'
    buyerId?: string | null
    buyerGroupIds?: string[] | null
}

class VendorModuleService extends MedusaService({
    VendorInventory,
    VendorPrice,
    PurchaseOrder,
}) {
    /**
     * Resolve the unit price for a variant according to priority:
     * 1. Specific buyer (buyer_id)
     * 2. Any of the buyer's groups (buyer_group_id)
     * 3. Generic price for buyer_type
     * 4. undefined (caller must fallback to variant default)
     */
    async getPrice(
        variantId: string,
        sellerId: string,
        { buyerType, buyerId, buyerGroupIds }: BuyerContext
    ): Promise<number | undefined> {
        // Pull every price row for this variant & seller in one query
        const prices = await this.listVendorPrices(
            { variant_id: variantId, seller_id: sellerId },
            {}
        )

        // 1️⃣ Specific override
        const specific = prices.find(
            (p) => p.buyer_id === buyerId && p.buyer_type === buyerType
        )
        if (specific) return specific.price

        // 2️⃣ Group override — can match any of the customer groups
        if (buyerGroupIds?.length) {
            const group = prices.find(
                (p) =>
                    p.buyer_group_id &&
                    buyerGroupIds.includes(p.buyer_group_id) &&
                    p.buyer_type === buyerType
            )
            if (group) return group.price
        }

        // 3️⃣ General buyer_type price
        const generic = prices.find(
            (p) => !p.buyer_id && !p.buyer_group_id && p.buyer_type === buyerType
        )
        return generic?.price
    }

    /**
     * Adjust inventory quantity for a seller–variant combination.
     * Positive delta adds stock, negative delta removes.
     */
    async adjustInventory(
        sellerId: string,
        variantId: string,
        delta: number,
        sharedContext: Record<string, any> = {}
    ) {
        if (!delta) return

        const [existing] = await this.listVendorInventories(
            { seller_id: sellerId, variant_id: variantId },
            sharedContext
        )

        if (!existing) {
            if (delta < 0) {
                throw new Error('Cannot deduct inventory that does not exist')
            }
            // Create new row
            await this.createVendorInventories(
                [
                    {
                        seller_id: sellerId,
                        variant_id: variantId,
                        quantity: delta
                    }
                ],
                sharedContext
            )
            return
        }

        const newQty = existing.quantity + delta
        if (newQty < 0) {
            throw new Error('Inventory would become negative')
        }

        await this.updateVendorInventories(
            [
                {
                    id: existing.id,
                    quantity: newQty
                }
            ],
            sharedContext
        )
    }
}

export default VendorModuleService 