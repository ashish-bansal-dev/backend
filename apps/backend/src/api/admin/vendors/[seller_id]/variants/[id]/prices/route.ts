import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

import { VENDOR_MODULE } from '../../../../../../../modules/vendor'
import VendorModuleService from '../../../../../../../modules/vendor/service'
import { AdminCreateOrUpdateVariantPriceType } from './validators'

/**
 * @oas [get] /admin/vendors/{seller_id}/variants/{id}/prices
 * operationId: "AdminListVariantPrices"
 * summary: "List prices for a vendor's variant"
 * x-authenticated: true
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { seller_id, id } = req.params
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const prices = await vendorService.listVendorPrices({
        variant_id: id,
        seller_id,
    })

    res.json({ prices })
}

/**
 * @oas [post] /admin/vendors/{seller_id}/variants/{id}/prices
 * operationId: "AdminCreateOrUpdateVariantPrice"
 * summary: "Create or update a price row for a vendor's variant"
 * x-authenticated: true
 */
export async function POST(
    req: MedusaRequest<AdminCreateOrUpdateVariantPriceType>,
    res: MedusaResponse
) {
    const { seller_id, id } = req.params
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const body = req.validatedBody as AdminCreateOrUpdateVariantPriceType

    const [existing] = await vendorService.listVendorPrices({
        variant_id: id,
        seller_id,
        buyer_type: body.buyer_type,
        buyer_id: body.buyer_id ?? null,
        buyer_group_id: body.buyer_group_id ?? null,
    })

    let priceRow
    if (existing) {
        priceRow = await vendorService.updateVendorPrices({
            id: existing.id,
            price: body.price,
        })
    } else {
        ;[priceRow] = await vendorService.createVendorPrices([
            {
                variant_id: id,
                seller_id,
                buyer_type: body.buyer_type,
                buyer_id: body.buyer_id ?? null,
                buyer_group_id: body.buyer_group_id ?? null,
                price: body.price,
            },
        ])
    }

    res.status(200).json({ price: priceRow })
} 