// v2/flows/ordersEdit.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, ORDER_EDIT_URL, DEPOT_ID_FILTER, REGION_ID, LOCATION_ID_EDIT, // Config constants
    VARIANT_ID_EDIT_1, VARIANT_ID_EDIT_2, /* ... more variants ... */
    editOrderResponseTime, editOrderSuccessRate, editOrderRequestCount, // Specific metrics
} from '../../config.js';
import { makeRequest, createHeaders } from '../utils.js';

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status };
    editOrderResponseTime.add(response.timings.duration, tags);
    editOrderSuccessRate.add(success, tags);
    editOrderRequestCount.add(1, tags);
}

export function ordersEditFlow(authToken, configData) {
    const { orderIdToEdit } = configData; // Get the specific order ID for editing

    group('Orders Edit', function () {
        if (!authToken) { /* ... */ return; }
        // Use orderIdToEdit if provided, otherwise fallback or skip
        const processingOrderIdForEdit = orderIdToEdit || configData.defaultEditOrderId; // Example fallback
        if (!processingOrderIdForEdit) {
             console.warn(`VU ${__VU} Orders Edit: Skipping flow, no order ID provided.`);
             return;
        }

        const groupTags = { group: 'Orders Edit' };

        // Initial data loading...
        const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/depots/current-user');
        addMetrics(depotsCurrentUserRes);
        // ... other initial loads with addMetrics ...

        // --- Find Order to Edit (or use passed ID) ---
        // This part might change. If orderIdToEdit is passed, you might skip the filter step.
        // For now, keeping the filter logic but using the result OR the passed ID.
        let foundProcessingOrderForEdit = false;
        let dynamicOutletId = null;

        // Option 1: Use passed ID directly
        if (orderIdToEdit) {
            foundProcessingOrderForEdit = true;
            console.log(`VU ${__VU} Orders Edit: Using provided order ID: ${processingOrderIdForEdit}`);
            // Need to fetch outlet_id if not passed in configData
            const viewOrderRes = makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?fields=outlet_id,...`, null, { headers: createHeaders(authToken), tags: groupTags }, 'View Order Before Edit (Get OutletID)');
            addMetrics(viewOrderRes);
            try {
                if (viewOrderRes.status === 200) dynamicOutletId = viewOrderRes.json('order.outlet_id');
            } catch(e) {}
             if (!dynamicOutletId) {
                 console.error(`VU ${__VU} Orders Edit: Could not get outlet_id for provided order ${processingOrderIdForEdit}. Skipping edit.`);
                 foundProcessingOrderForEdit = false; // Prevent further steps
             }

        // Option 2: Filter to find an order (original logic)
        } else {
            const order_edit_filter = makeRequest('get', `${BASE_URL}/admin/orders?...&extended_status[0]=processing`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Filter Status: Processing for Edit)');
            addMetrics(order_edit_filter);
            sleep(0.5);
            try {
                if (order_edit_filter.status === 200) {
                    const body = order_edit_filter.json();
                    if (body?.orders?.length > 0 && body.orders[0].id) {
                        processingOrderIdForEdit = body.orders[0].id; // Found one dynamically
                        dynamicOutletId = body.orders[0].outlet_id; // Assuming outlet_id is in the list response
                        foundProcessingOrderForEdit = true;
                        console.log(`VU ${__VU} Orders Edit: Found Processing Order via filter: ${processingOrderIdForEdit}`);
                    } else { console.warn(`VU ${__VU} Orders Edit: Filter successful but no processing orders found.`); }
                } else { console.error(`VU ${__VU} Orders Edit: Filter failed. Status: ${order_edit_filter.status}`); }
            } catch (e) { console.error(`VU ${__VU} Orders Edit: Failed to parse filter JSON. Error: ${e.message}`); }
        }


        // --- Conditionally View, Prepare, and Edit Order ---
        if (foundProcessingOrderForEdit && processingOrderIdForEdit && dynamicOutletId) {
            console.log(`VU ${__VU} Orders Edit: Proceeding to Edit order ${processingOrderIdForEdit}`);

            // Prepare for Edit...
            const stockLocEditRes = makeRequest('get', `${BASE_URL}/admin/stock-locations?...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/stock-locations (For Edit)');
            addMetrics(stockLocEditRes);
            const depotVariantsEditRes = makeRequest('get', `${BASE_URL}/admin/variants/depot-variants?...&outlet_id=${dynamicOutletId}&...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/variants/depot-variants (For Edit)');
            addMetrics(depotVariantsEditRes);
            sleep(3);

            // Perform Edit
            const editPayload = {
                metadata: { external_doc_number: `editing order ${__VU}` },
                items: [
                     { variant_id: VARIANT_ID_EDIT_1, quantity: 1, metadata: { item_category: 'YLGA' } },
                     // ... other items using VARIANT_ID constants ...
                ],
                location_id: LOCATION_ID_EDIT,
            };
            const editResponse = makeRequest('post', `${BASE_URL}/${ORDER_EDIT_URL}/${processingOrderIdForEdit}`, editPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, '/admin/orders/edit/{id} (Perform Edit)');
            addMetrics(editResponse, editResponse.status === 200); // Specific success check

            sleep(3);

            // Conditional Refresh/View after edit...
            const isEditSuccessful = editResponse.status === 200;
            if (isEditSuccessful) {
                console.log(`VU ${__VU} Orders Edit: Edit successful. Refreshing...`);
                const numReadyAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
                addMetrics(numReadyAfterEditRes);
                // ... other refresh calls with addMetrics ...
                sleep(2);
            } else {
                console.warn(`VU ${__VU} Orders Edit: Edit failed. Skipping post-edit checks.`);
                sleep(2);
            }

        } else {
            console.warn(`VU ${__VU} Orders Edit: Skipping Edit sequence because no suitable order/outlet ID was found/provided.`);
            // Compensate for sleeps if skipping
            sleep(0.5 + 3 + 3 + 2); // Approx. sum of sleeps in the skipped block
        }
    });
}
