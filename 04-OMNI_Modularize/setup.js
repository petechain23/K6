// import { payload } from './config.js';
// export { payload };

// import { payload, outletId, variant_id, randomQty } from './config.js';
// export { payload, outletId, variant_id, randomQty };

import { payload, sharedArrayOutletId, sharedArrayVariantId, randomQty } from './config.js';
export { payload, sharedArrayOutletId, sharedArrayVariantId, randomQty };

export function setup() {
    return {
        payloads: payload,
        outletIds: sharedArrayOutletId,
        variant_ids: sharedArrayVariantId,
        randomQtys: randomQty
    };
}