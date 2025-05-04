// v2/flows/pages/ordersEdit.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, ORDER_EDIT_URL, REGION_ID, LOCATION_ID,
    // Import ALL variant IDs used in the edit payload from config.js
    VARIANT_ID_1, VARIANT_ID_2, VARIANT_ID_3, VARIANT_ID_4,
    VARIANT_ID_5, VARIANT_ID_6, VARIANT_ID_7, VARIANT_ID_8,
    VARIANT_ID_9, VARIANT_ID_10, // Add 11 and 12 if used
    // Import specific metrics for this flow
    orderEditingRequestCount, orderEditingSuccessRate, orderEditingResponseTime
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding (e.g., for the actual edit POST)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderEditingResponseTime.add(response.timings.duration, tags);
    orderEditingSuccessRate.add(success, tags);
    orderEditingRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersEditFlow(authToken, configData) {
    // Extract needed data from the object passed by main.js
    // These are now REQUIRED for the flow to proceed meaningfully
    const { orderIdToEdit, locationIdToEdit, depotId } = configData;

    group('Orders Edit', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Edit: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Edit: Skipping flow due to missing depotId in configData.`);
            return;
        }
        if (!orderIdToEdit) {
            console.warn(`VU ${__VU} Orders Edit: Skipping flow because no orderIdToEdit was provided in configData.`);
            return;
        }
        // if (!locationIdToEdit) {
        //     console.warn(`VU ${__VU} Orders Edit: Skipping flow because no locationIdToEdit was provided in configData.`);
        //     return;
        // }
        // --- End Initial Checks ---

        // Log the randomly selected outlet ID and potentially the edit/update order ID        
        console.log(`VU ${__VU} Orders Edit: Attempting to edit order ${orderIdToEdit} in depot ${depotId}`);
        const groupTags = { group: 'Orders Edit' };

        // --- Initial Data Loading ---
        // const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/depots/current-user');
        // randomSleep(0.25);
        // addMetrics(depotsCurrentUserRes);

        // const batchJobsInitialRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/batch-jobs (Initial)');
        // randomSleep(0.25);
        // addMetrics(batchJobsInitialRes);

        // const storeRes = makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/store/');
        // randomSleep(0.25);
        // addMetrics(storeRes);

        const numReadyInvoicedRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
        addMetrics(numReadyInvoicedRes);
        randomSleep(0.5);

        const numActiveRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (Select Depot)');
        randomSleep(0.5);
        addMetrics(numActiveRes);

        const numNeedReviewRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (Select Depot)');
        addMetrics(numNeedReviewRes);
        randomSleep(0.5);
        // --- End Initial Data Loading ---


        // --- Fetch Outlet ID ---
        let dynamicOutletId = null;
        let canProceedToEdit = false;
        let isOrderInEditableState = false; // Flag to check order status
        console.log(`VU ${__VU} Orders Edit: Fetching outlet ID for order ${orderIdToEdit}`);
        // EXPANDED CALL
        const viewOrderRes = makeRequest(
            'get', // method
            `${BASE_URL}/admin/orders/${orderIdToEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
            null,
            { headers: createHeaders(authToken), tags: groupTags }, // params
            '/admin/orders/{id} (View to get OutletID & Status)' // name
        );
        // console.log(viewOrderRes.body);
        addMetrics(viewOrderRes);
        randomSleep();
        try {
            if (viewOrderRes.status === 200) {
                dynamicOutletId = viewOrderRes.json('order.outlet_id') || viewOrderRes.json('order.outlet.id');
                if (dynamicOutletId) {
                    canProceedToEdit = true;
                    // --- ADDED STATUS CHECK ---
                    const allowedEditStatuses = ['pending', 'processing', 'invoiced', 'ready_for_delivery']; // Define allowed statuses
                    const orderStatus = viewOrderRes.json('order.extended_status');
                    isOrderInEditableState = allowedEditStatuses.includes(orderStatus); // Check if status is in the allowed list
                    console.log(`VU ${__VU} Orders Edit: Found outlet ID ${dynamicOutletId} for order ${orderIdToEdit}. Status: ${orderStatus}. Editable (in ${allowedEditStatuses.join(', ')}): ${isOrderInEditableState}`);
                    // --- END ADDED STATUS CHECK ---
                } else { console.error(`VU ${__VU} Orders Edit: Status 200 but outlet_id not found for order ${orderIdToEdit}. Body: ${viewOrderRes.body}`); }
            } else { console.error(`VU ${__VU} Orders Edit: Failed to view order ${orderIdToEdit} to get outlet ID. Status: ${viewOrderRes.status}`); }
        } catch (e) { console.error(`VU ${__VU} Orders Edit: Failed to parse view response for outlet ID. Error: ${e.message}`); }

        // --- End Fetch Outlet ID ---


        // --- Prepare and Edit Order (Only if Outlet ID was found) ---
        if (canProceedToEdit) {
            console.log(`VU ${__VU} Orders Edit: Proceeding to Prepare/Edit order ${orderIdToEdit}`);

            // --- ADDED: Skip if not in editable state ---
            if (!isOrderInEditableState) {
                console.warn(`VU ${__VU} Orders Edit: Skipping edit for order ${orderIdToEdit} because its status ('${viewOrderRes.json('order.extended_status')}') is not one of ['pending', 'processing', 'invoiced', 'ready_for_delivery'].`);
                return;
            }
            const stockLocEditRes = makeRequest(
                'get', // method
                `${BASE_URL}/admin/stock-locations?depot_id=${depotId}&offset=0&limit=1000`, null,
                { headers: createHeaders(authToken), tags: groupTags },
                '/admin/stock-locations (For Edit)'
            );
            addMetrics(stockLocEditRes);
            randomSleep();
            if (stockLocEditRes.status >= 400) {
                console.error(`VU ${__VU} StockLoc Error: Status ${stockLocEditRes.status}, Body: ${stockLocEditRes.body}`);
            }

            const depotVariantsEditRes = makeRequest(
                'get', // method
                `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${depotId}&outlet_id=${dynamicOutletId}&include_empties_deposit=true&limit=20&offset=0&q=&location_id=${locationIdToEdit}`, null,
                { headers: createHeaders(authToken), tags: groupTags },
                '/admin/variants/depot-variants (For Edit)'
            );
            
            addMetrics(depotVariantsEditRes);
            randomSleep();

            if (depotVariantsEditRes.status >= 400) { // Log only errors
                console.error(`VU ${__VU} DepotVariants Error: Status ${depotVariantsEditRes.status}, Body: ${depotVariantsEditRes.body}`);
            }
            randomSleep();

            // Perform Edit - Using the provided orderIdToEdit
            const editPayload = {
                metadata: { external_doc_number: `editing order` },
                items: [ // Use VARIANT_ID constants imported from config.js
                    { variant_id: VARIANT_ID_1, quantity: 1, metadata: { item_category: 'YLGA' } },
                    { variant_id: VARIANT_ID_2, quantity: 8, metadata: { item_category: 'YLGA' } },
                    { variant_id: VARIANT_ID_3, quantity: 60, metadata: { item_category: 'YLGA' } },
                    { variant_id: VARIANT_ID_4, quantity: 16, metadata: { item_category: 'YLGA' } },
                    { variant_id: VARIANT_ID_5, quantity: 1, metadata: { item_category: 'YRLN' } },
                    { variant_id: VARIANT_ID_6, quantity: 1, metadata: { item_category: 'YVGA' } },
                    { variant_id: VARIANT_ID_7, quantity: 2, metadata: { item_category: 'YVGA' } },
                    { variant_id: VARIANT_ID_8, quantity: 3, metadata: { item_category: 'YVGA' } },
                    { variant_id: VARIANT_ID_9, quantity: 4, metadata: { item_category: 'YVGO' } },
                    { variant_id: VARIANT_ID_10, quantity: 5, metadata: { item_category: 'YVGA' } }
                ],
                location_id: locationIdToEdit || LOCATION_ID
            };
            const editResponse = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_EDIT_URL}/${orderIdToEdit}`,
                editPayload,
                {
                    headers: createHeaders(authToken, { 'content-type': 'application/json' }),
                    tags: groupTags
                },
                '/admin/orders/edit/{id} (Perform Edit)'
            );
            
            addMetrics(editResponse, editResponse.status === 200);
            randomSleep();

            // --- ADDED CHECK ---
            check(editResponse, {
                'Edit Order - status is 200': (r) => r.status === 200,
                'Edit Order - external_doc_number updated': (r) => {
                    try {
                        if (r.status !== 200) return false;
                        const body = r.json();
                        return body?.order?.metadata?.external_doc_number === `editing order`;
                    } catch (e) {
                        console.error(`VU ${__VU} Edit Order Check: Failed to parse JSON - ${e}`);
                        return false;
                    }
                }
            });
            // --- END ADDED CHECK ---

            // --- Check if Edit was successful (based on status) and Refresh ---
            const isEditSuccessful = editResponse.status === 200;
            check(editResponse, { 'Edit Order - status is 200 (for refresh logic)': () => isEditSuccessful });

            if (isEditSuccessful) {
                console.log(`VU ${__VU} Orders Edit: Edit successful for order ${orderIdToEdit}. Refreshing counts and viewing...`);
                // Refresh counts after edit
                // EXPANDED CALL
                const numReadyAfterEditRes = makeRequest(
                    'get', // method
                    `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, // url
                    null, // body
                    { headers: createHeaders(authToken), tags: groupTags }, // params
                    '/admin/orders/number-of-order-ready-invoiced (After Edit)' // name
                );
                addMetrics(numReadyAfterEditRes);
                sleep(0.5);
                // EXPANDED CALL
                const numNeedReviewAfterEditRes = makeRequest(
                    'get', // method
                    `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, // url
                    null, // body
                    { headers: createHeaders(authToken), tags: groupTags }, // params
                    '/admin/orders/number-of-order-need-review (After Edit)' // name
                );
                addMetrics(numNeedReviewAfterEditRes);
                sleep(0.5);
                // View order details after edit
                // EXPANDED CALL
                const viewAfterEditRes = makeRequest(
                    'get', // method
                    `${BASE_URL}/admin/orders/${orderIdToEdit}?expand=outlet,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot&fields=id,display_id,outlet_id,status,extended_status`,
                    null, // body
                    { headers: createHeaders(authToken), tags: groupTags }, // params
                    '/admin/orders/{id} (View After Edit)' // name
                );
                addMetrics(viewAfterEditRes);
                randomSleep();
                // EXPANDED CALL
                const orderEventAfterEditRes = makeRequest(
                    'get', // method
                    `${BASE_URL}/admin/order-event?order_id=${orderIdToEdit}`, // url
                    null, // body
                    { headers: createHeaders(authToken), tags: groupTags }, // params
                    '/admin/order-event (After Edit)' // name
                );
                sleep(0.5);
                addMetrics(orderEventAfterEditRes);
            } else {
                console.warn(`VU ${__VU} Orders Edit: Edit failed for order ${orderIdToEdit} (Status: ${editResponse.status}) (Boby: ${editResponse.body}).. Skipping post-edit checks.`);
                sleep(1); // Compensate for skipped sleep
            }
            // --- End Conditional Refresh ---

        } else {
            // This block is reached if fetching the outlet ID failed
            console.warn(`VU ${__VU} Orders Edit: Skipping Prepare/Edit sequence for order ${orderIdToEdit} because its outlet ID could not be determined.`);
            // Compensate for sleeps in the skipped block
            sleep(1);
        }
        // --- End Prepare and Edit Order ---
    });
}
