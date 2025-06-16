import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

import { VENDOR_MODULE } from '../../../../../../../modules/vendor'
import VendorModuleService from '../../../../../../../modules/vendor/service'
import { AdminAdjustVariantInventoryType } from './validators'

/**
 * @oas [get] /admin/vendors/{seller_id}/variants/{id}/inventory
 * operationId: "AdminGetVariantInventory"
 * summary: "Get inventory for a vendor's variant"
 * x-authenticated: true
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { seller_id, id } = req.params
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const [inventory] = await vendorService.listVendorInventories({
        variant_id: id,
        seller_id,
    })

    res.json({ inventory })
}

/**
 * @oas [post] /admin/vendors/{seller_id}/variants/{id}/inventory
 * operationId: "AdminAdjustVariantInventory"
 * summary: "Adjust inventory for a vendor's variant"
 * x-authenticated: true
 */
export async function POST(
    req: MedusaRequest<AdminAdjustVariantInventoryType>,
    res: MedusaResponse
) {
    const { seller_id, id } = req.params
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const body = req.validatedBody as AdminAdjustVariantInventoryType

    let delta: number
    if (body.quantity !== undefined) {
        const [existing] = await vendorService.listVendorInventories({
            variant_id: id,
            seller_id,
        })
        const currentQty = existing?.quantity ?? 0
        delta = body.quantity - currentQty
    } else {
        delta = body.delta as number
    }

    await vendorService.adjustInventory(seller_id, id, delta)

    const [inventory] = await vendorService.listVendorInventories({
        variant_id: id,
        seller_id,
    })

    res.status(200).json({ inventory })
} 