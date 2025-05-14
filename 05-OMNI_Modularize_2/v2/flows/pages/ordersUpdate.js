// v2/flows/pages/ordersUpdate.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config - depotId will come from configData
    ORDER_EXTEND_STATUS_UPDATE_URL, ORDER_PENDINGTOPROCESSING_URL, // Specific URLs
    ORDER_INVENTORY_CHECK_URL, ORDER_CREDIT_CHECK_URL, ORDER_PROMOTION_CHECK_URL,
    // Original metrics for initial checks
    orderUpdatingRequestCount, orderUpdatingResponseTime, orderUpdatingSuccessRate,
    // New status-specific metrics
    orderUpdateReadyForDeliveryResponseTime, orderUpdateReadyForDeliverySuccessRate, orderUpdateReadyForDeliveryRequestCount,
    orderUpdateShippedResponseTime, orderUpdateShippedSuccessRate, orderUpdateShippedRequestCount,
    orderUpdateDeliveredResponseTime, orderUpdateDeliveredSuccessRate, orderUpdateDeliveredRequestCount,
    orderUpdatePaidResponseTime, orderUpdatePaidSuccessRate, orderUpdatePaidRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, operationIdentifier, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding for specific checks (e.g., 201 Created)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Basic tag, operation is identified by metric name

    switch (operationIdentifier) {
        case 'ready_for_delivery':
            orderUpdateReadyForDeliveryResponseTime.add(response.timings.duration, tags);
            orderUpdateReadyForDeliverySuccessRate.add(success, tags);
            orderUpdateReadyForDeliveryRequestCount.add(1, tags);
            break;
        case 'shipped':
            orderUpdateShippedResponseTime.add(response.timings.duration, tags);
            orderUpdateShippedSuccessRate.add(success, tags);
            orderUpdateShippedRequestCount.add(1, tags);
            break;
        case 'delivered':
            orderUpdateDeliveredResponseTime.add(response.timings.duration, tags);
            orderUpdateDeliveredSuccessRate.add(success, tags);
            orderUpdateDeliveredRequestCount.add(1, tags);
            break;
        case 'paid':
            orderUpdatePaidResponseTime.add(response.timings.duration, tags);
            orderUpdatePaidSuccessRate.add(success, tags);
            orderUpdatePaidRequestCount.add(1, tags);
            break;
        default: // For initial checks like 'inventory_check', 'credit_check', 'promotion_check'
            // Add the operationIdentifier as a tag to the generic orderUpdating metrics
            const genericTags = { status: response.status, operation: operationIdentifier };
            orderUpdatingResponseTime.add(response.timings.duration, genericTags);
            orderUpdatingSuccessRate.add(success, genericTags);
            orderUpdatingRequestCount.add(1, genericTags);
            break;
    }
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

// --- Helper function for status updates (includes verification from response) ---
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
    // REMOVED: randomSleep(); // Sleep will be handled by the calling flow

    let isUpdateVerified = false;
    let actualStatusInResponse = null;

    if (response.status === 201) {
        console.log(`VU ${__VU} Orders Update (Order: ${orderId}, Target: ${targetStatus}): API Status 201. Full Response Body: ${response.body}`); // Log raw body
        try {
            const body = response.json();
            // console.log(`VU ${__VU} Orders Update (Order: ${orderId}, Target: ${targetStatus}): API Status 201. Parsed Body: ${JSON.stringify(body)}`); // Log parsed body
            if (body && body.saved && Array.isArray(body.saved) && body.saved.length > 0) {
                actualStatusInResponse = body.saved[0]?.extended_status;
                if (actualStatusInResponse === targetStatus) {
                    isUpdateVerified = true;
                } else {
                    console.warn(`VU ${__VU} Orders Update (Order: ${orderId}, Target: ${targetStatus}): API status 201, but extended_status in response ('${actualStatusInResponse}') !== targetStatus ('${targetStatus}').`);
                }
            } else {
                console.warn(`VU ${__VU} Orders Update: Update to ${targetStatus} for ${orderId} - API status 201, but response body structure unexpected: ${response.body}`);
            }
        } catch (e) {
            console.error(`VU ${__VU} Orders Update: Update to ${targetStatus} for ${orderId} - API status 201, but failed to parse response JSON. Error: ${e.message}, Body: ${response.body}`);
        }
    }

    // Metrics should reflect the full success (API call + content verification)
    addMetrics(response, targetStatus, isUpdateVerified); // Pass targetStatus for tagging

    // Check should also reflect the full success
    const checkPassed = check(response, {
        [`Orders Update (${targetStatus}) - status is 201 AND extended_status is ${targetStatus}`]: () => isUpdateVerified,
    });

    if (isUpdateVerified) {
        console.log(`VU ${__VU} Orders Update: Update to ${targetStatus} successful and verified for ${orderId}.`);
    } else {
        console.error(`VU ${__VU} Orders Update: Update to ${targetStatus} FAILED verification for ${orderId}. API Status: ${response.status}, Expected Status in Body: ${targetStatus}, Actual in Body: ${actualStatusInResponse}, Body: ${response.body}`);
    }
    return isUpdateVerified;
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
        addMetrics(invCheckRes, 'inventory_check', invCheckRes.status === 200); // Tag initial checks too

        // Credit Checks
        const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/credit-checked/{id}');
        sleep(0.5)
        addMetrics(creditCheckRes, 'credit_check', creditCheckRes.status === 200);

        // Promotion Checks
        const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/promotion-checked/{id}');
        sleep(0.5)
        addMetrics(promoCheckRes, 'promotion_check', promoCheckRes.status === 200);

        // --- Chained Status Updates ---
        let isPreviousStatusUpdateSuccessful = true; // Start assuming success to enter the first update
        const statusesToUpdate = ['ready_for_delivery', 'shipped', 'delivered', 'paid'];

        for (let i = 0; i < statusesToUpdate.length; i++) {
            const targetStatus = statusesToUpdate[i];

            if (isPreviousStatusUpdateSuccessful) {
                // Call the helper function
                isPreviousStatusUpdateSuccessful = updateOrderStatus(authToken, targetProcessingOrderId, targetStatus, groupTags);

                if (isPreviousStatusUpdateSuccessful) {
                    // Verification is now part of updateOrderStatus.
                    // The helper function already logged success.

                    // Fetch order events (optional)
                    // const eventAfterUpdateRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${targetProcessingOrderId}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/order-event (After ${targetStatus})`);
                    // addMetrics(eventAfterUpdateRes);
                    // randomSleep();

                    // Sleep *after* successful update and verification
                    if (targetStatus === 'paid') {
                        sleep(1);
                    } else {
                        randomSleep(); // Main "think time" after a successful step
                    }
                } else {
                    // If update failed, log is handled in helper. Halt further updates.
                    console.error(`VU ${__VU} Orders Update: Halting further status updates for ${targetProcessingOrderId} due to failure at '${targetStatus}'.`);
                    // Compensate sleep with random duration
                    if (targetStatus === 'paid') {
                        sleep(1);
                    } else {
                        randomSleep();
                    } // Sleep even on failure to maintain some pacing
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
