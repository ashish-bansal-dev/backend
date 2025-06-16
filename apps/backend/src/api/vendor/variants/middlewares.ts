import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework/http"
import { VendorCreateOrUpdateVariantPrice } from "./[id]/prices/validators"
import { VendorBatchVariantPrices } from "./prices/validators"
import { VendorBatchGetVariantPrices } from './prices/validators'

export const vendorVariantIdMiddleware: MiddlewareRoute[] = [
    {
        method: ['GET'],
        matcher: '/vendor/variants/prices',
        middlewares: [validateAndTransformQuery(VendorBatchGetVariantPrices, {})],
    },
    {
        method: ['POST'],
        matcher: '/vendor/variants/prices/batch',
        middlewares: [validateAndTransformBody(VendorBatchVariantPrices)],
    },

    {
        method: ["POST"],
        matcher: "/vendor/variants/:id/prices",
        middlewares: [
            validateAndTransformBody(VendorCreateOrUpdateVariantPrice),
        ]
    },

]
