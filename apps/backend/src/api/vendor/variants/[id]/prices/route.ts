import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'

import { VENDOR_MODULE } from '../../../../../modules/vendor'
import VendorModuleService from '../../../../../modules/vendor/service'
import { fetchSellerByAuthActorId } from '../../../../../shared/infra/http/utils'
import { VendorCreateOrUpdateVariantPrice, VendorCreateOrUpdateVariantPriceType } from './validators'

/**
 * @oas [get] /vendor/variants/{id}/prices
 * operationId: "VendorListVariantPrices"
 * summary: "List prices for a variant"
 * x-authenticated: true
 */
export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const seller = await fetchSellerByAuthActorId(req.auth_context.actor_id, req.scope)
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const prices = await vendorService.listVendorPrices({
        variant_id: req.params.id,
        seller_id: seller.id,
    })

    res.json({ prices })
}

/**
 * @oas [post] /vendor/variants/{id}/prices
 * operationId: "VendorCreateOrUpdateVariantPrice"
 * summary: "Create or update a price for a variant"
 * x-authenticated: true
 */
export const POST = async (
    req: AuthenticatedMedusaRequest<VendorCreateOrUpdateVariantPriceType>,
    res: MedusaResponse
) => {
    const seller = await fetchSellerByAuthActorId(
        req.auth_context.actor_id,
        req.scope
    )

    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    const body = req.validatedBody as VendorCreateOrUpdateVariantPriceType

    const [existing] = await vendorService.listVendorPrices({
        variant_id: req.params.id,
        seller_id: seller.id,
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
        priceRow = await vendorService.createVendorPrices([
            {
                variant_id: req.params.id,
                seller_id: seller.id,
                buyer_type: body.buyer_type,
                buyer_id: body.buyer_id ?? null,
                buyer_group_id: body.buyer_group_id ?? null,
                price: body.price,
            },
        ])
    }

    res.status(200).json({ price: priceRow })
}