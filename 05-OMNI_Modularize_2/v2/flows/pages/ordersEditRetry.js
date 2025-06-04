import { group, check, sleep } from 'k6';
import {
    BASE_URL, ORDER_EDIT_URL, ORDER_PENDINGTOPROCESSING_URL, LOCATION_ID,
    VARIANT_ID_1, VARIANT_ID_2, VARIANT_ID_3, VARIANT_ID_4,
    VARIANT_ID_5, VARIANT_ID_6, VARIANT_ID_7, VARIANT_ID_8,
    VARIANT_ID_9, VARIANT_ID_10, VARIANT_ID_11, VARIANT_ID_12,
    // Only import retry metrics, not the base orderEditing* metrics
    orderEditingRetryRequestCount, orderEditingRetrySuccessRate, orderEditingRetryResponseTime,
    orderEditingRetry1RequestCount, orderEditingRetry1SuccessRate, orderEditingRetry1ResponseTime,
    orderEditingRetry2RequestCount, orderEditingRetry2SuccessRate, orderEditingRetry2ResponseTime,
    orderEditingRetry3RequestCount, orderEditingRetry3SuccessRate, orderEditingRetry3ResponseTime
} from '../config.js';
import { makeRequest, createHeaders, randomSleep } from '../utils.js';

// Helper function for initial edit metrics
function addInitialEditMetrics(response) {
    const success = response.status === 200;
    const tags = { 
        status: response.status,
        type: 'initial'
    };
    
    // Only add to overall retry metrics for initial attempt
    orderEditingRetryResponseTime.add(response.timings.duration, tags);
    orderEditingRetrySuccessRate.add(success, tags);
    orderEditingRetryRequestCount.add(1, tags);
}

// Helper function specifically for retry metrics
function addRetryMetrics(response, retryAttempt) {
    // Only add metrics for actual retry attempts
    if (retryAttempt > 0) {
        const success = response.status === 200;
        const tags = { 
            status: response.status,
            retry_attempt: retryAttempt
        };

        // Only add specific retry attempt metrics (not the overall metrics)
        switch(retryAttempt) {
            case 1:
                orderEditingRetry1ResponseTime.add(response.timings.duration, tags);
                orderEditingRetry1SuccessRate.add(success, tags);
                orderEditingRetry1RequestCount.add(1, tags);
                break;
            case 2:
                orderEditingRetry2ResponseTime.add(response.timings.duration, tags);
                orderEditingRetry2SuccessRate.add(success, tags);
                orderEditingRetry2RequestCount.add(1, tags);
                break;
            case 3:
                orderEditingRetry3ResponseTime.add(response.timings.duration, tags);
                orderEditingRetry3SuccessRate.add(success, tags);
                orderEditingRetry3RequestCount.add(1, tags);
                break;
        }
    }
}

// --- Helper function specifically for retrying the edit POST ---
function performEditPostRetry(authToken, orderIdToEdit, locationIdToEdit, depotId, groupTags, retryAttempt) {
    console.log(`VU ${__VU} Orders Edit (Retry ${retryAttempt}): Performing POST for order ${orderIdToEdit}`);

    // Reconstruct payload using imported VARIANT_IDs
    const editPayload = {
        metadata: { external_doc_number: `editing order retry ${retryAttempt}` }, // Add retry count to metadata
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
        location_id: locationIdToEdit || LOCATION_ID // Use LOCATION_ID from config as fallback
    };

    const editResponse = makeRequest(
        'post',
        `${BASE_URL}/${ORDER_EDIT_URL}/${orderIdToEdit}`,
        editPayload,
        {
            headers: createHeaders(authToken, { 
                'content-type': 'application/json',
                'x-retry-attempt': `${retryAttempt}`
            }),
            tags: { ...groupTags, retry_attempt: retryAttempt }
        },
        `(Perform Edit - Retry ${retryAttempt})`
    );

    // Use the retry-specific metrics function
    addRetryMetrics(editResponse, retryAttempt);

    // Basic check for the retry attempt
    check(editResponse, {
        [`Edit Order (Retry ${retryAttempt}) - status is 200`]: (r) => r.status === 200,
        // Added body check for retry
        [`Edit Order (Retry ${retryAttempt}) - check external_doc_number updated`]: (r) => {
            try {
                if (r.status !== 200) return false; // Don't check body if status isn't 200
                const body = r.json();
                // Check if the external_doc_number matches the one set in the retry payload
                return body?.order?.metadata?.external_doc_number === `editing order retry ${retryAttempt}`;
            } catch (e) { return false; } // Parsing failed or structure incorrect
        }
    });

    // Return the response object for the main flow to check status
    return editResponse;
}
// --- End Retry Helper ---

export function ordersEditWithRetryFlow(authToken, configData) {
    // Extract needed data from the object passed by main.js
    const { orderIdToEdit, locationIdToEdit, depotId } = configData;

    group('Orders Edit With Retry', function () { // Renamed group slightly
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
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Edit: Attempting to edit order ${orderIdToEdit} in depot ${depotId}`);
        const groupTags = { group: 'Orders Edit With Retry' };
        const headers = createHeaders(authToken);
        const postHeaders = createHeaders(authToken, { 'content-type': 'application/json' });

        // --- View Order Details ---
        const viewOrderRes = makeRequest(
            'get',
            `${BASE_URL}/admin/orders/${orderIdToEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
            null,
            { headers: headers, tags: groupTags },
            '(View Before Edit)'
        );
        randomSleep(0.5, 1);

        // --- Mark as Processing ---
        // Note: Removed idempotency key from original script for simplicity
        const markProcessingPayload = { is_processing: true };
        const markProcessingRes = makeRequest(
            'post',
            `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${orderIdToEdit}`,
            markProcessingPayload,
            { headers: postHeaders, tags: groupTags },
            '(Mark Processing)'
        );
        check(markProcessingRes, { 'Mark Processing - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
        randomSleep(0.5, 1);

        // --- Get Active Order Count ---
        const numActiveRes = makeRequest(
            'get',
            `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${depotId}`,
            null,
            { headers: headers, tags: groupTags },
            '/admin/orders/number-of-order-active (Before Edit)'
        );
        randomSleep(0.5, 1);

        // --- Perform Initial Edit Attempt ---
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
        let editResponse = makeRequest(
            'post',
            `${BASE_URL}/${ORDER_EDIT_URL}/${orderIdToEdit}`,
            editPayload,
            { headers: postHeaders, tags: groupTags },
            '(Perform Edit)'
        );
        
        // Add metrics for initial attempt only
        addInitialEditMetrics(editResponse);
        randomSleep();

        // --- Initial Edit Check ---
        check(editResponse, {
            'Edit Order - status is 200': (r) => r.status === 200,
            'Edit Order - external_doc_number updated': (r) => {
                try {
                    if (r.status !== 200) return false;
                    const body = r.json();
                    return body?.order?.metadata?.external_doc_number === `editing order`;
                } catch (e) { return false; }
            }
        });
        // --- END Initial Edit Check ---

        // --- Retry Logic on 409 Conflict ---
        let finalEditResponse = editResponse; // Start with the initial response
        // --- Updated Retry Trigger Conditions ---
        let retryNeeded = false;
        const status = finalEditResponse.status;
        const body = finalEditResponse.body; // Get the response body as text

        if (status === 409 || status === 500) {
            retryNeeded = true;
        } else if (body && typeof body === 'string' && (
                   body.includes('25P02') || body.includes('40001') || body.includes('40P01') ||
                   body.includes('QueryRunnerProviderAlreadyReleasedError') || body.includes('QueryFailedError') ||
                   body.includes('could not serialize access due to read') || body.includes('current transaction is aborted') ||
                   body.includes('QueryRunnerAlreadyReleasedError'))) {
            retryNeeded = true;
        }
        let retryCount = 0;
        const MAX_RETRIES = 3;
        const RETRY_SLEEP_DURATION = 2; // seconds

        if (retryNeeded) {
            console.warn(`VU ${__VU} Orders Edit: Initial edit for ${orderIdToEdit} failed with unexpected status ${finalEditResponse.status} and BodyRequetst: ${JSON.stringify(editPayload)}. Initiating retries.`);
        }

        while (retryNeeded && retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`VU ${__VU} Orders Edit: Retrying edit for ${orderIdToEdit} (Attempt ${retryCount}/${MAX_RETRIES})...`);
            sleep(RETRY_SLEEP_DURATION);

            // Call the dedicated retry function
            finalEditResponse = performEditPostRetry(authToken, orderIdToEdit, locationIdToEdit, depotId, groupTags, retryCount);

            if (finalEditResponse.status === 200) {
                console.log(`VU ${__VU} Orders Edit: Retry attempt ${retryCount} for ${orderIdToEdit} SUCCEEDED.`);
                retryNeeded = false; // Stop retrying
                // Check if the retry *also* resulted in a condition needing another retry
                } else if (finalEditResponse.status === 409 || finalEditResponse.status === 500 ||
                           (finalEditResponse.body && typeof finalEditResponse.body === 'string' && (
                            finalEditResponse.body.includes('25P02') || finalEditResponse.body.includes('40001') || finalEditResponse.body.includes('40P01') ||
                            finalEditResponse.body.includes('QueryRunnerProviderAlreadyReleasedError') || finalEditResponse.body.includes('QueryFailedError') ||
                            finalEditResponse.body.includes('could not serialize access due to read') || finalEditResponse.body.includes('current transaction is aborted') ||
                            finalEditResponse.body.includes('QueryRunnerAlreadyReleasedError'))
                           )) {
                console.warn(`VU ${__VU} Orders Edit: Retry attempt ${retryCount} for ${orderIdToEdit} failed again with unexpected status ${finalEditResponse.status} and BodyRequetst: ${JSON.stringify(editPayload)}`);
            } else {
                console.error(`VU ${__VU} Orders Edit: Retry attempt ${retryCount} for ${orderIdToEdit} failed with unexpected status ${finalEditResponse.status}. Stopping retries for this order.`);
                retryNeeded = false; // Stop retrying on unexpected errors
            }
        }
        // --- End Retry Logic ---

        /*
        // --- Conditional Refresh Logic (Based on the FINAL outcome) ---
        const isEditSuccessful = finalEditResponse.status === 200;

        if (isEditSuccessful) {
            console.log(`VU ${__VU} Orders Edit: Edit successful (initial or retry) for order ${orderIdToEdit}. Viewing details and events...`);
            // View order details after successful edit
            const viewAfterEditRes = makeRequest(
                'get',
                `${BASE_URL}/admin/orders/${orderIdToEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
                null,
                { headers: headers, tags: groupTags },
                '(View After Edit)'
            );
            randomSleep();

            // Get order events after successful edit
            const orderEventAfterEditRes = makeRequest(
                'get',
                `${BASE_URL}/admin/order-event?order_id=${orderIdToEdit}`,
                null,
                { headers: headers, tags: groupTags },
                '/admin/order-event (After Edit)'
            );
            randomSleep();

        } else {
            // Log failure based on the final attempt's status
            if (retryCount > 0) {
                console.error(`VU ${__VU} Orders Edit: Edit for ${orderIdToEdit} FAILED after initial attempt and ${retryCount} retries (Final Status: ${finalEditResponse.status}). Skipping post-edit views.`);
            } else {
                console.warn(`VU ${__VU} Orders Edit: Initial edit attempt for order ${orderIdToEdit} failed (Status: ${finalEditResponse.status}). Skipping post-edit views.`);
            }
            randomSleep(); // Compensate for skipped sleeps
        }
        // --- End Conditional Refresh Logic ---
        */

    }); // End Group
}