import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { VENDOR_MODULE } from '../../../../../modules/vendor'
import VendorModuleService from '../../../../../modules/vendor/service'
import { fetchSellerByAuthActorId } from '../../../../../shared/infra/http/utils'
import { VendorBatchVariantPricesType } from '../validators'

/**
 * @oas [post] /vendor/variants/prices/batch
 * operationId: "VendorBatchUpsertVariantPrices"
 * summary: "Batch create or update vendor prices"
 * x-authenticated: true
 */
export const POST = async (
    req: AuthenticatedMedusaRequest<VendorBatchVariantPricesType>,
    res: MedusaResponse
) => {
    const seller = await fetchSellerByAuthActorId(
        req.auth_context.actor_id,
        req.scope
    )

    const vendorService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)

    await Promise.all(
        req.validatedBody.prices.map(async (priceRow) => {
            const { variant_id, buyer_type, buyer_id, buyer_group_id, price } =
                priceRow

            const [existing] = await vendorService.listVendorPrices({
                variant_id,
                seller_id: seller.id,
                buyer_type,
                buyer_id: buyer_id ?? null,
                buyer_group_id: buyer_group_id ?? null,
            })

            if (existing) {
                await vendorService.updateVendorPrices({ id: existing.id, price })
            } else {
                await vendorService.createVendorPrices([
                    {
                        variant_id,
                        seller_id: seller.id,
                        buyer_type,
                        buyer_id: buyer_id ?? null,
                        buyer_group_id: buyer_group_id ?? null,
                        price,
                    },
                ])
            }
        })
    )

    res.status(200).json({ updated: req.validatedBody.prices.length })
} 