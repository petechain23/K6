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

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

// --- Helper function for status updates ---
function updateOrderStatus(authToken, orderId, targetStatus, groupTags) {
    const statusUpdatePayload = { order_ids: [orderId], status: targetStatus };
    const requestName = `/admin/order-extend-status/update (${targetStatus})`;

    console.log(`VU ${__VU} Orders Update: Attempting update to '${targetStatus}' for order ${orderId}`);

    const response = makeRequest(
        'post',
        `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`,
        statusUpdatePayload,
        { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
        requestName
    );
    randomSleep();
    addMetrics(response, response.status === 201);

    const isSuccess = check(response, {
        [`Orders Update (${targetStatus}) - status is 201`]: (r) => r.status === 201,
    });

    if (isSuccess) {
        console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful for ${orderId}.`);
    } else {
        console.error(`VU ${__VU} Orders Update: Update to ${targetStatus} FAILED (Status: ${response.status}). Body: ${response.body}`);
    }
    return isSuccess; // Return true if status was 201, false otherwise
}

export function ordersUpdateFlow(authToken, configData) {
    // orderIdForStatusUpdate, depotId is required
    const { orderIdForStatusUpdate, depotId } = configData;

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
        if (!orderIdForStatusUpdate) { // Now mandatory
            console.error(`VU ${__VU} Orders Update: Skipping flow because orderIdForStatusUpdate was not provided in configData.`);
            return; // Stop execution if the required ID is missing
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Update: Running with Depot ID: ${depotId}. Target Order for Status Update: ${orderIdForStatusUpdate}`);
        const groupTags = { group: 'Orders Update' }; // Define tags for makeRequest

        // --- Perform Checks & Status Updates on a Processing Order (Using orderIdForStatusUpdate) ---
        const targetProcessingOrderId = orderIdForStatusUpdate;
        console.log(`VU ${__VU} Orders Update: Proceeding with checks/status updates for order ${targetProcessingOrderId}.`);

        // Perform Checks
        const invCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/inventory-checked/{id}');
        sleep(0.5)
        addMetrics(invCheckRes, invCheckRes.status === 200);

        // Credit Checks
        const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/credit-checked/{id}');
        sleep(0.5)
        addMetrics(creditCheckRes, creditCheckRes.status === 200);

        // Promotion Checks
        const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/promotion-checked/{id}');
        sleep(0.5)
        addMetrics(promoCheckRes, promoCheckRes.status === 200);

        // --- Chained Status Updates ---
        let isPreviousStatusUpdateSuccessful = true; // Start assuming success to enter the first update
        const statusesToUpdate = ['ready_for_delivery', 'shipped', 'delivered', 'paid'];

        for (let i = 0; i < statusesToUpdate.length; i++) {
            const targetStatus = statusesToUpdate[i];

            if (isPreviousStatusUpdateSuccessful) {
                // Call the helper function
                isPreviousStatusUpdateSuccessful = updateOrderStatus(authToken, targetProcessingOrderId, targetStatus, groupTags);

                if (isPreviousStatusUpdateSuccessful) {
                    // --- Verification Step ---
                    // Fetch order details again to verify the status update
                    const verifyStatusRes = makeRequest(
                        'get',
                        `${BASE_URL}/admin/orders/${targetProcessingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`,
                        null,
                        { headers: createHeaders(authToken), tags: groupTags },
                        `/admin/orders/{id} (Verify Status: ${targetStatus})`
                    );
                    check(verifyStatusRes, {
                        [`Verify Status Update (${targetStatus}) - status is 200`]: (r) => r.status === 200,
                        [`Verify Status Update (${targetStatus}) - extended_status is ${targetStatus}`]: (r) => {
                            if (r.status !== 200) return false; // Don't check body if status failed
                            try {
                                const actualStatus = r.json('order.extended_status');
                                const passes = actualStatus === targetStatus;
                                if (!passes) {
                                    console.warn(`VU ${__VU} Verify Check Fail (${targetStatus}): Expected ${targetStatus}, Got ${actualStatus}. Body: ${r.body}`);
                                }
                                return passes;
                            } catch (e) { return false; /* JSON parsing failed */ }
                        },
                    });
  
                    addMetrics(verifyStatusRes); // Add metrics for the verification request
                    randomSleep();
                    
                    // --- End Verification Step ---

                    // Fetch order events (optional)
                    const eventAfterUpdateRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                    
                    addMetrics(eventAfterUpdateRes);
                    randomSleep();

                    if (targetStatus === 'paid') {
                        sleep(1);
                    } else {
                        randomSleep();
                    }
                } else {
                    // If update failed, log is handled in helper. Halt further updates.
                    console.error(`VU ${__VU} Orders Update: Halting further status updates for ${targetProcessingOrderId} due to failure at '${targetStatus}'.`);
                    // Compensate sleep with random duration
                    if (targetStatus === 'paid') {
                        sleep(1);
                    } else {
                        randomSleep();
                    }
                    break; // Exit the loop
                }
            } else {
                // If a previous step failed, skip this status and compensate sleep
                console.log(`VU ${__VU} Orders Update: Skipping update to ${targetStatus} due to previous failure.`);
                // Compensate sleep with random duration
                if (targetStatus === 'paid') {
                    sleep(1);
                } else {
                    randomSleep();
                }
            }
        }

    });
}
