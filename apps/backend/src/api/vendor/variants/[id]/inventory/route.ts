import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'

import { VENDOR_MODULE } from '../../../../../modules/vendor'
import VendorModuleService from '../../../../../modules/vendor/service'
import { fetchSellerByAuthActorId } from '../../../../../shared/infra/http/utils'
import { VendorAdjustVariantInventoryType } from './validators'

/**
 * @oas [get] /vendor/variants/{id}/inventory
 * operationId: "VendorGetVariantInventory"
 * summary: "Get inventory for a variant scoped to this seller"
 * x-authenticated: true
 */
export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const seller = await fetchSellerByAuthActorId(req.auth_context.actor_id, req.scope)
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const [inventory] = await vendorService.listVendorInventories({
        variant_id: req.params.id,
        seller_id: seller.id,
    })

    res.json({ inventory })
}

/**
 * @oas [post] /vendor/variants/{id}/inventory
 * operationId: "VendorAdjustVariantInventory"
 * summary: "Adjust inventory (set quantity or apply delta)"
 * x-authenticated: true
 */
export const POST = async (
    req: AuthenticatedMedusaRequest<VendorAdjustVariantInventoryType>,
    res: MedusaResponse
) => {
    const body = req.validatedBody as VendorAdjustVariantInventoryType

    const seller = await fetchSellerByAuthActorId(req.auth_context.actor_id, req.scope)
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    let delta: number
    if (body.quantity !== undefined) {
        const [existing] = await vendorService.listVendorInventories({
            variant_id: req.params.id,
            seller_id: seller.id,
        })
        const currentQty = existing?.quantity ?? 0
        delta = body.quantity - currentQty
    } else {
        delta = body.delta as number
    }

    await vendorService.adjustInventory(seller.id, req.params.id, delta)

    const [inventory] = await vendorService.listVendorInventories({
        variant_id: req.params.id,
        seller_id: seller.id,
    })

    res.status(200).json({ inventory })
} 