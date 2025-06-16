import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { VENDOR_MODULE } from '../../../../modules/vendor'
import VendorModuleService from '../../../../modules/vendor/service'
import { fetchSellerByAuthActorId } from '../../../../shared/infra/http/utils'

/**
 * @oas [get] /vendor/variants/prices
 * summary: "List vendor prices for multiple variants"
 * parameters:
 *   - in: query
 *     name: variant_ids
 *     description: Comma separated variant ids
 *     required: true
 *     schema:
 *       type: string
 * x-authenticated: true
 */
export const GET = async (
    req: AuthenticatedMedusaRequest<{ variant_ids: string | string[] }>,
    res: MedusaResponse
) => {
    const seller = await fetchSellerByAuthActorId(
        req.auth_context.actor_id,
        req.scope
    )
    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    let variantIds: string[] = []
    if (Array.isArray(req.query.variant_ids)) {
        variantIds = req.query.variant_ids
    } else if (typeof req.query.variant_ids === "string") {
        variantIds = req.query.variant_ids.split(",").filter(Boolean)
    }

    const prices = await vendorService.listVendorPrices({
        seller_id: seller.id,
        ...(variantIds.length ? { variant_id: variantIds } : {}),
    })

    res.json({ prices })
} 