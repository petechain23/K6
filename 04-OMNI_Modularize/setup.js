// import { payload } from './config.js';
// export { payload };

import { payload, outletId, variant_id, randomQty } from './config.js';
export { payload, outletId, variant_id, randomQty };

// import { payload, sharedArrayOutletId, sharedArrayVariantId, randomQty } from './config.js';
// export { payload, sharedArrayOutletId, sharedArrayVariantId, randomQty };

export function setup() {
    return {
        payloads: payload,
        outletIds: outletId,
        variant_ids: variant_id,
        randomQtys: randomQty
    };
}