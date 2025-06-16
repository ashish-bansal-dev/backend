import { defineLink } from '@medusajs/framework/utils'

import SellerModule from '../modules/seller'
import VendorModule from '../modules/vendor'

export default defineLink(SellerModule.linkable.seller, {
    linkable: VendorModule.linkable.vendorInventory,
    isList: true,
}) 