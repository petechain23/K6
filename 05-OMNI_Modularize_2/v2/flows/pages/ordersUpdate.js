// v2/flows/ordersUpdate.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, DEPOT_ID_FILTER, REGION_ID, LOCATION_ID_EDIT, // Base config
    ORDER_EXTEND_STATUS_UPDATE_URL, ORDER_PENDINGTOPROCESSING_URL, // Specific URLs
    ORDER_INVENTORY_CHECK_URL, ORDER_CREDIT_CHECK_URL, ORDER_PROMOTION_CHECK_URL,
    CANCELLATION_REASON_ID, // IDs
    updateOrderResponseTime, updateOrderSuccessRate, updateOrderRequestCount, // Specific metrics
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding for specific checks (e.g., 201 Created)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    updateOrderResponseTime.add(response.timings.duration, tags);
    updateOrderSuccessRate.add(success, tags);
    updateOrderRequestCount.add(1, tags);
}

export function ordersUpdateFlow(authToken, configData) {
    // Extract specific order IDs needed for this flow from the data passed by main.js
    const { orderIdForStatusUpdate, orderIdToMarkProcessing } = configData;

    group('Orders Update', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Update: Skipping flow due to missing auth token.`);
            return;
        }

        const groupTags = { group: 'Orders Update' }; // Define tags for makeRequest

        // --- Initial Data Loading ---
        // These are often common across pages, consider if they truly belong only here
        // or if some could be cached/shared differently if performance is an issue.
        const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/depots/current-user');
        addMetrics(depotsCurrentUserRes);
        const batchJobsInitialRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/batch-jobs (Initial)');
        addMetrics(batchJobsInitialRes);
        const storeRes = makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/store/');
        addMetrics(storeRes);
        const numReadyInvoicedRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced');
        addMetrics(numReadyInvoicedRes);
        const numActiveRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active');
        addMetrics(numActiveRes);
        const numNeedReviewRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review');
        addMetrics(numNeedReviewRes);

        // --- Initial List View & Select Depot ---
        // (Keeping the view/select depot logic as it was in the original group)
        const initialListResponse = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List orders page)');
        addMetrics(initialListResponse);
        sleep(1);
        // ... [Optional: Conditional View Order 1 logic - addMetrics if kept] ...

        const numReadySelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
        addMetrics(numReadySelectDepotRes);
        const numActiveSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (Select Depot)');
        addMetrics(numActiveSelectDepotRes);
        const numNeedReviewSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (Select Depot)');
        addMetrics(numNeedReviewSelectDepotRes);

        const depotFilteredListResponse = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List orders page, Select Depot)');
        addMetrics(depotFilteredListResponse);
        sleep(0.5);
        // ... [Optional: Conditional View Order 2 logic - addMetrics if kept] ...

        // --- Scrolling Orders List ---
        for (let i = 1; i < 5; i++) {
            const offset = i * 20;
            const scrollListRes = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&offset=${offset}&...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/orders (List Page ${i + 1}, Scrolling orders list)`);
            addMetrics(scrollListRes);
            sleep(Math.random() * 1 + 0.5);
        }

        // --- NOTE: Removed the misplaced 'Edit' block that was here in distributors.js ---
        // The logic for filtering processing orders and POSTing to /admin/orders/edit/{id}
        // belongs in the ordersEdit.js flow.

        // --- Search Orders ---
        // By Number
        const search_numeric = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}&q=12345`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Search 12345)');
        addMetrics(search_numeric);
        // ... [Conditional View Search Result logic - addMetrics if kept] ...
        sleep(0.5);
        const clearSearch1Res = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List After Clear Search1)');
        addMetrics(clearSearch1Res);
        sleep(1);

        // By Text
        const search_text = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}&q=OMS`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Search OMS)');
        addMetrics(search_text);
        // ... [Conditional View Search Result logic - addMetrics if kept] ...
        sleep(0.5);
        const clearSearch2Res = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List After Clear Search2)');
        addMetrics(clearSearch2Res);
        sleep(1);

        // --- Mark Pending Order as Processing ---
        let targetPendingOrderId = orderIdToMarkProcessing; // Use ID from configData if available
        let foundPendingOrder = !!targetPendingOrderId; // Assume found if ID provided

        if (!targetPendingOrderId) {
            // If no ID provided, try filtering to find one
            console.log(`VU ${__VU} Orders Update: No specific pending order ID provided, filtering...`);
            const status_pending = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=pending`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Filter Status: Pending)');
            addMetrics(status_pending);
            sleep(0.5);
            try {
                if (status_pending.status === 200) {
                    const body = status_pending.json();
                    if (body?.orders?.length > 0 && body.orders[0].id) {
                        targetPendingOrderId = body.orders[0].id;
                        foundPendingOrder = true;
                        console.log(`VU ${__VU} Orders Update: Found Pending Order via filter: ${targetPendingOrderId}`);
                    } else { console.warn(`VU ${__VU} Orders Update: Filter successful but no pending orders found.`); }
                } else { console.error(`VU ${__VU} Orders Update: Filter failed. Status: ${status_pending.status}`); }
            } catch (e) { console.error(`VU ${__VU} Orders Update: Failed to parse pending filter JSON. Error: ${e.message}`); }
        } else {
             console.log(`VU ${__VU} Orders Update: Using provided pending order ID: ${targetPendingOrderId}`);
        }

        if (foundPendingOrder && targetPendingOrderId) {
            console.log(`VU ${__VU} Orders Update: Proceeding to mark order ${targetPendingOrderId} as processing.`);
            // Optional: View before update
            // const viewBeforeMarkRes = makeRequest('get', `${BASE_URL}/admin/orders/${targetPendingOrderId}?expand=...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Before Mark Processing)');
            // addMetrics(viewBeforeMarkRes);
            // const eventBeforeMarkRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetPendingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Before Mark Processing)');
            // addMetrics(eventBeforeMarkRes);
            // sleep(0.5);

            const markProcessingRes = makeRequest('post', `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${targetPendingOrderId}`, { is_processing: true }, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, '/admin/orders/{id} (Mark Processing)');
            addMetrics(markProcessingRes, markProcessingRes.status === 200); // Expect 200 OK for this update

            sleep(0.5);
            // Optional: View event after update
            // const eventAfterMarkProcessingRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetPendingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Mark Processing)');
            // addMetrics(eventAfterMarkProcessingRes);
            sleep(1);
        } else {
            console.warn(`VU ${__VU} Orders Update: Skipping 'Mark Processing' block as no suitable pending order was found/provided.`);
            sleep(2); // Compensate for skipped sleeps
        }

        // --- Perform Checks & Status Updates on a Processing Order ---
        let targetProcessingOrderId = orderIdForStatusUpdate; // Use ID from configData if available
        let foundProcessingOrder = !!targetProcessingOrderId;

        if (!targetProcessingOrderId) {
            // If no ID provided, try filtering to find one
             console.log(`VU ${__VU} Orders Update: No specific processing order ID provided, filtering...`);
            const status_processing = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Filter Status: Processing)');
            addMetrics(status_processing);
            sleep(0.5);
             try {
                if (status_processing.status === 200) {
                    const body = status_processing.json();
                    if (body?.orders?.length > 0 && body.orders[0].id) {
                        targetProcessingOrderId = body.orders[0].id;
                        foundProcessingOrder = true;
                        console.log(`VU ${__VU} Orders Update: Found Processing Order via filter: ${targetProcessingOrderId}`);
                    } else { console.warn(`VU ${__VU} Orders Update: Filter successful but no processing orders found.`); }
                } else { console.error(`VU ${__VU} Orders Update: Filter failed. Status: ${status_processing.status}`); }
            } catch (e) { console.error(`VU ${__VU} Orders Update: Failed to parse processing filter JSON. Error: ${e.message}`); }
        } else {
             console.log(`VU ${__VU} Orders Update: Using provided processing order ID: ${targetProcessingOrderId}`);
        }


        if (foundProcessingOrder && targetProcessingOrderId) {
            console.log(`VU ${__VU} Orders Update: Proceeding with checks/status updates for order ${targetProcessingOrderId}.`);

            // Optional: View before checks
            // const viewBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/orders/${targetProcessingOrderId}?expand=...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Before Checks)');
            // addMetrics(viewBeforeChecksRes);
            // const eventBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Before Checks)');
            // addMetrics(eventBeforeChecksRes);
            // sleep(1);

            // Perform Checks
            const invCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/inventory-checked/{id}');
            addMetrics(invCheckRes, invCheckRes.status === 200); // Assuming 200 OK
            // const eventAfterInvCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Inv Check)');
            // addMetrics(eventAfterInvCheckRes);
            sleep(1);

            const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/credit-checked/{id}');
            addMetrics(creditCheckRes, creditCheckRes.status === 200); // Assuming 200 OK
            // const eventAfterCreditCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Credit Check)');
            // addMetrics(eventAfterCreditCheckRes);
            // Refresh counts after credit check
            const numNeedReviewAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Credit Check)');
            addMetrics(numNeedReviewAfterCreditRes);
            const numReadyAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (After Credit Check)');
            addMetrics(numReadyAfterCreditRes);
            sleep(1);

            const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/promotion-checked/{id}');
            addMetrics(promoCheckRes, promoCheckRes.status === 200); // Assuming 200 OK
            // const eventAfterPromoCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (After Promotion Check)');
            // addMetrics(eventAfterPromoCheckRes);
            // Refresh counts after promo check
            const numNeedReviewAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Promotion Check)');
            addMetrics(numNeedReviewAfterPromoRes);
            const numReadyAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (After Promotion Check)');
            addMetrics(numReadyAfterPromoRes);
            sleep(1);

            // --- Chained Status Updates ---
            let isPreviousStatusUpdateSuccessful = true; // Start assuming success to enter the first update
            let targetStatus = '';
            let statusUpdatePayload = {};

            // --- Update Status: Ready for Delivery ---
            if (isPreviousStatusUpdateSuccessful) {
                targetStatus = "ready_for_delivery";
                statusUpdatePayload = { order_id: targetProcessingOrderId, status: targetStatus };
                console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
                const resReady = makeRequest('post', `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, statusUpdatePayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, `/admin/order-extend-status/update (${targetStatus})`);
                addMetrics(resReady, resReady.status === 201); // Expect 201 Created

                isPreviousStatusUpdateSuccessful = resReady.status === 201; // Check actual success
                check(resReady, { [`Update to ${targetStatus} - Status is 201`]: () => isPreviousStatusUpdateSuccessful });

                if (isPreviousStatusUpdateSuccessful) {
                    // const eventAfterReadyRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                    // addMetrics(eventAfterReadyRes);
                    // sleep(1);
                    // const batchJobsAfterReadyRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/batch-jobs (After ${targetStatus})`);
                    // addMetrics(batchJobsAfterReadyRes);
                    sleep(1); // Reduced sleep if not checking events/jobs
                } else {
                    console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed. Halting further status updates for ${targetProcessingOrderId}.`);
                    sleep(1 + 1); // Compensate for skipped sleeps
                }
            }

            // --- Update Status: Shipped ---
            if (isPreviousStatusUpdateSuccessful) {
                targetStatus = "shipped";
                statusUpdatePayload = { order_id: targetProcessingOrderId, status: targetStatus };
                console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
                const resShipped = makeRequest('post', `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, statusUpdatePayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, `/admin/order-extend-status/update (${targetStatus})`);
                addMetrics(resShipped, resShipped.status === 201);

                isPreviousStatusUpdateSuccessful = resShipped.status === 201;
                check(resShipped, { [`Update to ${targetStatus} - Status is 201`]: () => isPreviousStatusUpdateSuccessful });

                if (isPreviousStatusUpdateSuccessful) {
                    // const eventAfterShippedRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                    // addMetrics(eventAfterShippedRes);
                    sleep(1);
                } else {
                    console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed. Halting further status updates for ${targetProcessingOrderId}.`);
                    sleep(1); // Compensate
                }
            } else { sleep(1); } // Compensate if previous failed

            // --- Update Status: Delivered ---
            if (isPreviousStatusUpdateSuccessful) {
                targetStatus = "delivered";
                 statusUpdatePayload = { order_id: targetProcessingOrderId, status: targetStatus };
                console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${targetProcessingOrderId}`);
                const resDelivered = makeRequest('post', `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, statusUpdatePayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, `/admin/order-extend-status/update (${targetStatus})`);
                addMetrics(resDelivered, resDelivered.status === 201);

                isPreviousStatusUpdateSuccessful = resDelivered.status === 201;
                check(resDelivered, { [`Update to ${targetStatus} - Status is 201`]: () => isPreviousStatusUpdateSuccessful });

                if (isPreviousStatusUpdateSuccessful) {
                    // const eventAfterDeliveredRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                    // addMetrics(eventAfterDeliveredRes);
                    sleep(3);
                } else {
                    console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} failed for ${targetProcessingOrderId}.`);
                    sleep(3); // Compensate
                }
            } else { sleep(3); } // Compensate if previous failed

        } else {
            console.warn(`VU ${__VU} Orders Update: Skipping 'Checks & Status Updates' block as no suitable processing order was found/provided.`);
            // Compensate for all sleeps within the skipped block
            sleep(1 + 1 + 1 + 1 + 1 + 3); // Approx sum of sleeps
        }

        // --- Filter by Status: Invoiced ---
        const status_invoiced = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=invoiced`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (Filter Status: invoiced)');
        addMetrics(status_invoiced);
        sleep(0.5);

        // --- Multi-Update / Cancel Logic (Placeholder) ---
        // Add logic for multi-updates or cancellations here if needed.
        // Remember to use makeRequest and addMetrics.
        // Use IDs passed via configData where possible.
        // Example:
        // const orderIdToCancel = configData.orderIdToCancel;
        // if (orderIdToCancel) {
        //    const cancelPayload = { cancellation_reason_id: CANCELLATION_REASON_ID, ... };
        //    const cancelRes = makeRequest('post', `${BASE_URL}/admin/orders/${orderIdToCancel}/cancel`, cancelPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, '/admin/orders/{id}/cancel');
        //    addMetrics(cancelRes, cancelRes.status === 200);
        //    sleep(1);
        // }

    }); // End group('Orders Update')
}
