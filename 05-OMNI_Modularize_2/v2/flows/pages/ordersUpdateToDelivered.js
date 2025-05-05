import { group, check, sleep } from 'k6';
import {
    BASE_URL,
    ORDER_EXTEND_STATUS_UPDATE_URL,
    ORDER_PENDINGTOPROCESSING_URL, // Assuming this is the base path for marking processing
    ORDER_CREDIT_CHECK_URL,
    ORDER_PROMOTION_CHECK_URL,
    ORDER_INVENTORY_CHECK_URL,
    orderUpdateToDeliveredResponseTime,
    orderUpdateToDeliveredSuccessRate,
    orderUpdateToDeliveredRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderUpdateToDeliveredResponseTime.add(response.timings.duration, tags);
    orderUpdateToDeliveredSuccessRate.add(success, tags);
    orderUpdateToDeliveredRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersUpdateToDeliveredFlow(authToken, configData) {
    // Extract needed data from configData
    // Using orderIdForStatusUpdate for the first order and orderIdForStatusUpdate for the second one
    const { orderIdForStatusUpdate, depotId } = configData;

    group('Orders Update To Delivered', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Update To Delivered: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Update To Delivered: Skipping flow due to missing depotId in configData.`);
            return;
        }
        if (!orderIdForStatusUpdate) {
            console.warn(`VU ${__VU} Orders Update To Delivered: Skipping flow because no orderIdForStatusUpdate was provided.`);
            return;
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Update To Delivered: Using Depot ${depotId}, Order: ${orderIdForStatusUpdate}`);
        const groupTags = { group: 'Orders Update To Delivered' };
        const headers = createHeaders(authToken);
        const postHeaders = createHeaders(authToken, { 'content-type': 'application/json' });

        // Step 1 & 2: Select Depot (implicitly used) & View the order
        console.log(`VU ${__VU} Orders Update To Delivered: Viewing order ${orderIdForStatusUpdate}`);
        const viewOrderRes = makeRequest('get', `${BASE_URL}/admin/orders/${orderIdForStatusUpdate}?expand=outlet&fields=id,display_id,status,extended_status`, null, { headers: headers, tags: groupTags }, '/admin/orders/{id} (View Order)');
        addMetrics(viewOrderRes);
        randomSleep();

        // Step 3: Conditional Logic based on status
        let orderStatus = null;
        try {
            if (viewOrderRes.status === 200) {
                orderStatus = viewOrderRes.json('order.extended_status');
                console.log(`VU ${__VU} Orders Update To Delivered: Order ${orderIdForStatusUpdate} status is '${orderStatus}'`);
            } else {
                console.error(`VU ${__VU} Orders Update To Delivered: Failed to view order ${orderIdForStatusUpdate}. Status: ${viewOrderRes.status}, Status: ${viewOrderRes.orderStatus}`);
            }
        } catch (e) {
            console.error(`VU ${__VU} Orders Update To Delivered: Failed to parse view response. Error: ${e.message}`);
        }

        if (orderStatus === 'pending') {
            console.log(`VU ${__VU} Orders Update To Delivered: Order is pending, performing processing and checks.`);

            // Mark order as processing
            const markProcessingPayload = { is_processing: true };
            const markProcessingRes = makeRequest('post', `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${orderIdForStatusUpdate}`, markProcessingPayload, { headers: postHeaders, tags: groupTags }, '/admin/orders/{id} (Mark Processing)');
            addMetrics(markProcessingRes);
            check(markProcessingRes, { 'Mark Processing - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            randomSleep();

            // Perform Inventory Check
            const invCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/inventory-checked/{id}');
            addMetrics(invCheckRes);
            check(invCheckRes, { 'Inventory Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(0.5);

            // Perform Credit Check
            const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/credit-checked/{id}');
            addMetrics(creditCheckRes);
            check(creditCheckRes, { 'Credit Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(0.5);

            // Perform Promotion Check
            const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/promotion-checked/{id}');
            addMetrics(promoCheckRes);
            check(promoCheckRes, { 'Promotion Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(0.5);

        } else if (orderStatus !== null) {
            console.log(`VU ${__VU} Orders Update To Delivered: Order status is '${orderStatus}', skipping processing and checks.`);
        } else {
            console.warn(`VU ${__VU} Orders Update To Delivered: Could not determine order status. Skipping processing and checks.`);
        }

        // Step 4: Update status to Delivered
        console.log(`VU ${__VU} Orders Update To Delivered: Attempting to update order ${orderIdForStatusUpdate} to 'delivered'.`);
        // Assuming the API requires at least the order ID and status.
        const updatePayload = {
            order_ids: [orderIdForStatusUpdate],
            status: "delivered",
            expected_delivery_date: new Date().toISOString(), 
            term_of_payments: "current_credit_terms" // Kept from original
        };
        const updateStatusRes = makeRequest('post', `${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, updatePayload, { headers: postHeaders, tags: groupTags }, '/admin/order-extend-status/update (To Delivered)');
        // Use specific success check
        console.log('updateStatusRes', updateStatusRes.body);
        addMetrics(updateStatusRes, updateStatusRes.status === 201);
        check(updateStatusRes, {
            'Update Status to Delivered - status is 201': (r) => r.status === 201,
            'Update Status to Delivered - response body shows delivered': (r) => {
                try {
                    const body = r.json();
                    return body?.order?.extended_status === 'delivered';
                } catch (e) {
                    return false; // Parsing failed or structure incorrect
                }
            }
        });
        randomSleep();

        // Get order events after update attempt
        const orderEventsRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/order-event (After Update)');
        addMetrics(orderEventsRes);
        randomSleep();

    }); // End group
}
