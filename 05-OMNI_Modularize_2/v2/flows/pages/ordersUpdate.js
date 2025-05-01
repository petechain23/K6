// v2/flows/pages/ordersUpdate.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config - depotId will come from configData
    ORDER_EXTEND_STATUS_UPDATE_URL, ORDER_PENDINGTOPROCESSING_URL, // Specific URLs
    ORDER_INVENTORY_CHECK_URL, ORDER_CREDIT_CHECK_URL, ORDER_PROMOTION_CHECK_URL,
    orderUpdatingRequestCount, orderUpdatingResponseTime, orderUpdatingSuccessRate
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding for specific checks (e.g., 201 Created)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderUpdatingResponseTime.add(response.timings.duration, tags);
    orderUpdatingSuccessRate.add(success, tags);
    orderUpdatingRequestCount.add(1, tags);
}

export function ordersUpdateFlow(authToken, configData) {
    // Extract specific order IDs and depotId needed for this flow from the data passed by main.js
    // orderIdForStatusUpdate is intended for the main status update sequence (processing -> checks -> ready -> shipped -> delivered)
    // orderIdToMarkProcessing is optional, used if we need to specifically mark a known pending order first
    // depotId is required for filtering and context
    const { orderIdForStatusUpdate, depotId } = configData; // Removed orderIdToMarkProcessing from extraction as it's no longer used

    group('Orders Update', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Update: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Update: Skipping flow due to missing depotId in configData.`);
            return;
        }
        // orderIdForStatusUpdate is crucial for the main part of this flow
        if (!orderIdForStatusUpdate) { // Now mandatory
            console.error(`VU ${__VU} Orders Update: Skipping flow because orderIdForStatusUpdate was not provided in configData.`);
            return; // Stop execution if the required ID is missing
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Update: Running with Depot ID: ${depotId}. Target Order for Status Update: ${orderIdForStatusUpdate}`);
        const groupTags = { group: 'Orders Update' }; // Define tags for makeRequest

        /*
        // --- Initial Data Loading ---
        // These are often common across pages, consider if they truly belong only here
        // or if some could be cached/shared differently if performance is an issue.
        const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/depots/current-user');
        addMetrics(depotsCurrentUserRes);
        const batchJobsInitialRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/batch-jobs (Initial)');
        addMetrics(batchJobsInitialRes);
        const storeRes = makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/store/');
        addMetrics(storeRes);
        // Load counts for ALL depots initially
        const numReadyInvoicedAllRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (All Depots)');
        addMetrics(numReadyInvoicedAllRes);
        const numActiveAllRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (All Depots)');
        addMetrics(numActiveAllRes);
        const numNeedReviewAllRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (All Depots)');
        addMetrics(numNeedReviewAllRes);

        // --- Initial List View (All Depots) & Select Specific Depot ---
        const initialListResponse = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List orders page - All Depots)'
        );
        addMetrics(initialListResponse);
        sleep(1);
        // ... [Optional: Conditional View Order 1 logic - addMetrics if kept] ...

        // --- Load counts for the SPECIFIC depot ---
        const numReadySelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
        addMetrics(numReadySelectDepotRes);
        const numActiveSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (Select Depot)');
        addMetrics(numActiveSelectDepotRes);
        const numNeedReviewSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (Select Depot)');
        addMetrics(numNeedReviewSelectDepotRes);

        // --- Load list filtered by the SPECIFIC depot ---
        const depotFilteredListResponse = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List orders page, Select Depot)'
        );
        addMetrics(depotFilteredListResponse);
        sleep(0.5);
        // ... [Optional: Conditional View Order 2 logic - addMetrics if kept] ...

        // --- Scrolling Orders List (Filtered by Depot) ---
        for (let i = 1; i < 5; i++) {
            const offset = i * 20;
            const scrollListRes = makeRequest(
                'get',
                `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`,
                null,
                { headers: createHeaders(authToken), tags: groupTags },
                `/admin/orders (List Page ${i + 1}, Scrolling orders list)`
            );
            addMetrics(scrollListRes);
            sleep(Math.random() * 1 + 0.5);
        }

        // The logic for filtering processing orders and POSTing to /admin/orders/edit/{id}
        // belongs in the ordersEdit.js flow.

        // --- Search Orders (Filtered by Depot) ---
        // By Number
        const search_numeric = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}&q=12345`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (Search 12345)'
        );
        addMetrics(search_numeric);
        // ... [Conditional View Search Result logic - addMetrics if kept] ...
        sleep(0.5);
        // Clear Search (reload depot-filtered list)
        const clearSearch1Res = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List After Clear Search1)'
        );
        addMetrics(clearSearch1Res);
        sleep(1);

        // By Text
        const search_text = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}&q=OMS`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (Search OMS)'
        );
        addMetrics(search_text);
        // ... [Conditional View Search Result logic - addMetrics if kept] ...
        sleep(0.5);
        // Clear Search (reload depot-filtered list)
        const clearSearch2Res = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List After Clear Search2)'
        );
        addMetrics(clearSearch2Res);
        sleep(1);

        */

        // --- Mark Pending Order as Processing (REMOVED as per request) ---
        /*
        let targetPendingOrderId = orderIdToMarkProcessing; // Use ID from configData if available
        let foundPendingOrder = !!targetPendingOrderId; // Assume found if ID provided

        if (!targetPendingOrderId) {
            // If no ID provided, try filtering to find one
            console.log(`VU ${__VU} Orders Update: No specific pending order ID provided (orderIdToMarkProcessing), filtering within depot ${depotId}...`);
            const status_pending = makeRequest(
                'get',
                `${BASE_URL}/admin/orders?expand=outlet&fields=id&order_type=standard&offset=0&limit=1&order=-created_at&include_count=false&depot_id=${depotId}&extended_status[0]=pending`, // Limit 1, only need ID
                null,
                { headers: createHeaders(authToken), tags: groupTags },
                '/admin/orders (Filter Status: Pending)'
            );
            addMetrics(status_pending);
            sleep(0.5);
            try {
                if (status_pending.status === 200) {
                    const body = status_pending.json();
                    if (body?.orders?.length > 0 && body.orders[0].id) {
                        targetPendingOrderId = body.orders[0].id;
                        foundPendingOrder = true;
                        console.log(`VU ${__VU} Orders Update: Found Pending Order via filter: ${targetPendingOrderId}`);
                    } else { console.warn(`VU ${__VU} Orders Update: Filter successful but no pending orders found in depot ${depotId}.`); }
                } else { console.error(`VU ${__VU} Orders Update: Pending filter failed. Status: ${status_pending.status}`); }
            } catch (e) { console.error(`VU ${__VU} Orders Update: Failed to parse pending filter JSON. Error: ${e.message}`); }
        } else {
             console.log(`VU ${__VU} Orders Update: Using provided pending order ID (orderIdToMarkProcessing): ${targetPendingOrderId}`);
        }

        if (foundPendingOrder && targetPendingOrderId) {
            console.log(`VU ${__VU} Orders Update: Proceeding to mark order ${targetPendingOrderId} as processing.`);
            // Optional: View before update
            // const viewBeforeMarkRes = makeRequest('get', `${BASE_URL}/admin/orders/${targetPendingOrderId}?expand=...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Before Mark Processing)');
            // addMetrics(viewBeforeMarkRes);
            // const eventBeforeMarkRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetPendingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Before Mark Processing)');
            // addMetrics(eventBeforeMarkRes);
            // sleep(0.5);

            const markProcessingPayload = { is_processing: true };
            const markProcessingRes = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${targetPendingOrderId}`, // Uses specific URL constant
                markProcessingPayload,
                { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
                '/admin/orders/{id} (Mark Processing)'
            );
            addMetrics(markProcessingRes, markProcessingRes.status === 200); // Expect 200 OK for this update

            sleep(0.5);
            // Optional: View event after update
            // const eventAfterMarkProcessingRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetPendingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Mark Processing)');
            // addMetrics(eventAfterMarkProcessingRes);
            sleep(1);
        } else {
            console.warn(`VU ${__VU} Orders Update: Skipping 'Mark Processing' block as no suitable pending order was found/provided.`);
            sleep(0.5 + 0.5 + 1); // Compensate for skipped sleeps (filter + post + event)
        }
        */

        // --- Perform Checks & Status Updates on a Processing Order (Using orderIdForStatusUpdate) ---
        // Directly use the mandatory orderIdForStatusUpdate provided via configData
        const targetProcessingOrderId = orderIdForStatusUpdate;
        console.log(`VU ${__VU} Orders Update: Proceeding with checks/status updates for order ${targetProcessingOrderId}.`);

        // Optional: View before checks
        // const viewBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/orders/${targetProcessingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Before Checks)');
        // addMetrics(viewBeforeChecksRes);
        // const eventBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Before Checks)');
        // addMetrics(eventBeforeChecksRes);
        // sleep(1);

        // Perform Checks
        const invCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/inventory-checked/{id}');
        addMetrics(invCheckRes, invCheckRes.status === 200); // Assuming 200 OK
        // Optional: View event after check
        const eventAfterInvCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Inv Check)');
        addMetrics(eventAfterInvCheckRes);

        const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/credit-checked/{id}');
        addMetrics(creditCheckRes, creditCheckRes.status === 200); // Assuming 200 OK
        // Optional: View event after check
        const eventAfterCreditCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Credit Check)');
        addMetrics(eventAfterCreditCheckRes);
        // Refresh counts after credit check (using specific depotId)
        // const numNeedReviewAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Credit Check)');
        // addMetrics(numNeedReviewAfterCreditRes);
        // const numReadyAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (After Credit Check)');
        // addMetrics(numReadyAfterCreditRes);

        const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/promotion-checked/{id}');
        addMetrics(promoCheckRes, promoCheckRes.status === 200); // Assuming 200 OK
        // Optional: View event after check
        const eventAfterPromoCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Promotion Check)');
        addMetrics(eventAfterPromoCheckRes);
        // Refresh counts after promo check (using specific depotId)
        // const numNeedReviewAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Promotion Check)');
        // addMetrics(numNeedReviewAfterPromoRes);
        // const numReadyAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (After Promotion Check)');
        // addMetrics(numReadyAfterPromoRes);

        // --- Chained Status Updates ---
        let isPreviousStatusUpdateSuccessful = true; // Start assuming success to enter the first update
        let targetStatus = '';
        let statusUpdatePayload = {};

        // --- Update Status: Ready for Delivery ---
        if (isPreviousStatusUpdateSuccessful) {
            targetStatus = "ready_for_delivery";
            statusUpdatePayload = { order_ids: [targetProcessingOrderId], status: targetStatus };
            console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
            const resReady = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`,
                statusUpdatePayload,
                { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
                `/admin/order-extend-status/update (${targetStatus})`
            );
            // Use the strict 201 check for metrics
            addMetrics(resReady, resReady.status === 201);

            // *** UPDATED CHECK ***
            check(resReady, {
                [`Orders Update (${targetStatus}) - status is 201`]: (r) => r.status === 201,
                [`Orders Update (${targetStatus}) - Order status updated successfully`]: (r) => {
                    // Only check body if status is successful
                    if (r.status !== 201) return false;
                    try {
                        const body = r.json();
                        // Check if saved array exists and has the correct status
                        return body?.saved?.length > 0 && body.saved[0]?.extended_status === targetStatus; // Check body content
                    } catch (e) {
                        console.error(`VU ${__VU} Orders Update Check (${targetStatus}): Failed to parse JSON - ${e}`);
                        return false;
                    }
                }
            });

            // *** UPDATED CHAINING LOGIC ***
            isPreviousStatusUpdateSuccessful = resReady.status === 201; // Base chaining ONLY on status 201

            if (isPreviousStatusUpdateSuccessful) {
                console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful for ${targetProcessingOrderId}.`);
                // GET order event after successful update
                const eventAfterReadyRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                addMetrics(eventAfterReadyRes);
                // ... (optional job checks) ...
                sleep(1);
            } else {
                // Warning is logged here
                console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed (Status: ${resReady.status}). Halting further status updates for ${targetProcessingOrderId}.`);
                sleep(1); // Compensate
            }
        } else { /* This else shouldn't be reachable for the first step */ }

        // --- Update Status: Shipped ---
        if (isPreviousStatusUpdateSuccessful) { // Only proceed if previous step succeeded
            targetStatus = "shipped";
            statusUpdatePayload = { order_ids: [targetProcessingOrderId], status: targetStatus };
            console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
            const resShipped = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`,
                statusUpdatePayload,
                { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
                `/admin/order-extend-status/update (${targetStatus})`
            );
            addMetrics(resShipped, resShipped.status === 201); // Strict 201 check

            // *** UPDATED CHECK ***
            check(resShipped, {
                [`Orders Update (${targetStatus}) - status is 201`]: (r) => r.status === 201,
                [`Orders Update (${targetStatus}) - Order status updated successfully`]: (r) => {
                    if (r.status !== 201) return false;
                    try {
                        const body = r.json();
                        return body?.saved?.length > 0 && body.saved[0]?.extended_status === targetStatus; // Check body content
                    } catch (e) {
                        console.error(`VU ${__VU} Orders Update Check (${targetStatus}): Failed to parse JSON - ${e}`);
                        return false;
                    }
                }
            });

            // *** UPDATED CHAINING LOGIC ***
            isPreviousStatusUpdateSuccessful = resShipped.status === 201; // Base chaining ONLY on status 201

            if (isPreviousStatusUpdateSuccessful) {
                console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful for ${targetProcessingOrderId}.`);
                // GET order event after successful update
                const eventAfterShippedRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                addMetrics(eventAfterShippedRes);
                sleep(1);
            } else {
                console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed (Status: ${resShipped.status}). Halting further status updates for ${targetProcessingOrderId}.`);
                sleep(1); // Compensate
            }
        } else {
            // If 'ready_for_delivery' failed, skip 'shipped' and compensate sleep
            console.log(`VU ${__VU} Orders Update: Skipping update to shipped due to previous failure.`);
            sleep(1); // Compensate for skipped shipped block sleep
        }

        // --- Update Status: Delivered ---
        if (isPreviousStatusUpdateSuccessful) { // Only proceed if previous step succeeded
            targetStatus = "delivered";
            statusUpdatePayload = { order_ids: [targetProcessingOrderId], status: targetStatus };
            console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
            const resDelivered = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`,
                statusUpdatePayload,
                { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
                `/admin/order-extend-status/update (${targetStatus})`
            );
            addMetrics(resDelivered, resDelivered.status === 201); // Strict 201 check

            // *** UPDATED CHECK ***
            check(resDelivered, {
                [`Orders Update (${targetStatus}) - status is 201`]: (r) => r.status === 201,
                [`Orders Update (${targetStatus}) - Order status updated successfully`]: (r) => {
                    if (r.status !== 201) return false;
                    try {
                        const body = r.json();
                        return body?.saved?.length > 0 && body.saved[0]?.extended_status === targetStatus; // Check body content
                    } catch (e) {
                        console.error(`VU ${__VU} Orders Update Check (${targetStatus}): Failed to parse JSON - ${e}`);
                        return false;
                    }
                }
            });

            // *** UPDATED CHAINING LOGIC ***
            isPreviousStatusUpdateSuccessful = resDelivered.status === 201; // Base chaining ONLY on status 201

            if (isPreviousStatusUpdateSuccessful) {
                console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful for ${targetProcessingOrderId}.`);
                // GET order event after successful update
                const eventAfterDeliveredRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                addMetrics(eventAfterDeliveredRes);
                sleep(3);
            } else {
                console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed (Status: ${resDelivered.status}) for ${targetProcessingOrderId}.`);
                sleep(2); // Compensate
            }
        } else {
            // If 'shipped' failed (or was skipped), skip 'delivered' and compensate sleep
            console.log(`VU ${__VU} Orders Update: Skipping update to delivered due to previous failure.`);
            sleep(2); // Compensate for skipped delivered block sleep
        }
        // --- Update Status: Paid ---
        if (isPreviousStatusUpdateSuccessful) { // Only proceed if 'delivered' succeeded
            targetStatus = "paid";
            statusUpdatePayload = { order_ids: [targetProcessingOrderId], status: targetStatus };
            console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
            const resPaid = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`,
                statusUpdatePayload,
                { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
                `/admin/order-extend-status/update (${targetStatus})`
            );
            addMetrics(resPaid, resPaid.status === 201); // Strict 201 check

            // *** UPDATED CHECK ***
            check(resPaid, {
                [`Orders Update (${targetStatus}) - status is 201`]: (r) => r.status === 201,
                [`Orders Update (${targetStatus}) - Order status updated successfully`]: (r) => {
                    if (r.status !== 201) return false;
                    try {
                        const body = r.json();
                        return body?.saved?.length > 0 && body.saved[0]?.extended_status === targetStatus; // Check body content
                    } catch (e) {
                        console.error(`VU ${__VU} Orders Update Check (${targetStatus}): Failed to parse JSON - ${e}`);
                        return false;
                    }
                }
            });

            isPreviousStatusUpdateSuccessful = resPaid.status === 201;

            if (isPreviousStatusUpdateSuccessful) {
                console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful for ${targetProcessingOrderId}.`);
                const eventAfterPaidRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                addMetrics(eventAfterPaidRes);
                sleep(1);
            } else {
                console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed (Status: ${resPaid.status}) for ${targetProcessingOrderId}.`);
                sleep(1);
            }
        } else {
            // If 'delivered' failed (or was skipped), skip 'paid' and compensate sleep
            console.log(`VU ${__VU} Orders Update: Skipping update to paid due to previous failure.`);
            sleep(1); // Compensate for skipped paid block sleep
        }
    });
}
