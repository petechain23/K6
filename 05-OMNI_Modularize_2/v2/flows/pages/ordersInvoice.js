// v2/flows/pages/ordersInvoice.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL,
    ORDER_PENDINGTOPROCESSING_URL,
    ORDER_INVENTORY_CHECK_URL,
    ORDER_CREDIT_CHECK_URL,
    ORDER_PROMOTION_CHECK_URL,
    ORDER_INVOICE_GENERATE_URL,
    orderInvoiceResponseTime,
    orderInvoiceSuccessRate,
    orderInvoiceRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders, randomSleep } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding (e.g., 201 for generate)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderInvoiceResponseTime.add(response.timings.duration, tags);
    orderInvoiceSuccessRate.add(success, tags);
    orderInvoiceRequestCount.add(1, tags);
}

export function ordersInvoiceFlow(authToken, configData) {
    // Use orderIdForStatusUpdate from configData
    const { orderIdForStatusUpdate, depotId } = configData;

    group('Orders Invoice Generation', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) { // depotId might not be strictly needed here, but good practice
            console.warn(`VU ${__VU} Skipping flow due to missing depotId in configData.`);
            return;
        }
        if (!orderIdForStatusUpdate) {
            console.warn(`VU ${__VU} Skipping flow because no orderIdForStatusUpdate was provided.`);
            return;
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Processing order ${orderIdForStatusUpdate}`);
        const groupTags = { group: 'Orders Invoice Generation' };
        const headers = createHeaders(authToken);

        // 1. View Order (Optional, but good for context)
        const viewOrderRes = makeRequest('get', `${BASE_URL}/admin/orders/${orderIdForStatusUpdate}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
            null, { headers: headers, tags: groupTags }, '/admin/orders/{id} (View Order)');
        // addMetrics(viewOrderRes);
        // check(viewOrderRes, { 'View Order - status is 200': (r) => r.status === 200 });
        sleep(1);

        // --- Check Order Status ---
        let orderStatus = null;
        try {
            if (viewOrderRes.status === 200) {
                // Assuming the status is nested like { order: { extended_status: '...' } }
                orderStatus = viewOrderRes.json('order.extended_status');
                console.log(`VU ${__VU} Order: ${orderIdForStatusUpdate} status is: '${orderStatus}'`);
            } else {
                console.error(`VU ${__VU} Failed to view order: ${orderIdForStatusUpdate}. Status: ${viewOrderRes.status}`);
            }
        } catch (e) {
            console.error(`VU ${__VU} Failed to parse view response. Error: ${e.message}`);
        }
        // --- End Check Order Status ---

        // --- Conditional Execution based on Status ---
        if (orderStatus === 'pending' || orderStatus === 'processing') {
            console.log(`VU ${__VU} Order status is: '${orderStatus}'. Proceeding with processing, checks, and invoice generation.`);

            // 2. Mark as Processing (if status was pending)
            if (orderStatus === 'pending') {
                const markProcessingPayload = { is_processing: true };
                const markProcessingRes = makeRequest('post', `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${orderIdForStatusUpdate}`, markProcessingPayload, { headers: headers, tags: groupTags }, '/admin/orders/{id} (Mark Processing)');
                addMetrics(markProcessingRes);
                check(markProcessingRes, { 'Mark Processing - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
                sleep(1);
            }

            // 3. Inventory Check
            const invenCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/inventory-checked/{id}');
            addMetrics(invenCheckRes);
            check(invenCheckRes, { 'Inventory Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(1);

            // 4. Credit Check
            const creditCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/credit-checked/{id}');
            addMetrics(creditCheckRes);
            check(creditCheckRes, { 'Credit Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(1);

            // 5. Promotion Check
            const promoCheckRes = makeRequest('post', `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${orderIdForStatusUpdate}`, null, { headers: headers, tags: groupTags }, '/admin/orders/promotion-checked/{id}');
            addMetrics(promoCheckRes);
            check(promoCheckRes, { 'Promotion Check - status is 2xx': (r) => r.status >= 200 && r.status < 300 });
            sleep(1);

            // 6. Generate Invoice
            const generateInvoicePayload = {
                order_ids: [orderIdForStatusUpdate],
                expected_delivery_date: new Date().toISOString(), // Use current date/time // expected_delivery_date: "2025-05-06T14:32:59.688Z",
                term_of_payments: "current_credit_terms"
            };

            const generateInvoiceRes = makeRequest(
                'post',
                `${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`, generateInvoicePayload, { headers: headers, tags: groupTags },
                '/admin/invoices/generate');

            // console.log(generateInvoiceRes);
            // Use specific success check for 201 Created
            check(generateInvoiceRes, {
                '[Generate Invoice] Status is 201': (r) => r.status === 201,
                '[Generate Invoice] Body is valid JSON': (r) => {
                    try {
                        r.json();
                        return true;
                    } catch (e) {
                        console.error(`Errors: ${e.message}, with body: ${generateInvoiceRes.body}`);
                        return false;
                    }
                },
                //'[Generate Invoice] Errors array is empty': (r) => { try { return r.json('errors.length') === 0; } catch (e) { return false; } },
                //'[Generate Invoice] Downloaded array exists and is not empty': (r) => { try { return Array.isArray(r.json('downloaded')) && r.json('downloaded.length') > 0; } catch (e) { return false; } },
                //'[Generate Invoice] First downloaded item has invoice object': (r) => { try { return typeof r.json('downloaded.0.invoice') === 'object' && r.json('downloaded.0.invoice') !== null; } catch (e) { return false; } },
                // '[Generate Invoice] Invoice object has ID': (r) => { try { return typeof r.json('downloaded.0.invoice.id') === 'string' && r.json('downloaded.0.invoice.id').startsWith('invoice_'); } catch (e) { return false; } },
                '[Generate Invoice] Invoice object has correct order_id': (r) => {
                    try {
                        return r.json('downloaded.0.invoice.order_id') === orderIdForStatusUpdate;
                    } catch (e) {
                        console.error(`Errors: ${e.message}, with body: ${generateInvoiceRes.body}`);
                        return false;
                    }
                },
                '[Generate Invoice] Invoice object has status': (r) => {
                    try {
                        return typeof r.json('downloaded.0.invoice.status') === 'string' && r.json('downloaded.0.invoice.status').length > 0;
                    } catch (e) {
                        console.error(`Errors: ${e.message}, with body: ${generateInvoiceRes.body}`);
                        return false;
                    }
                },
                '[Generate Invoice] First downloaded item has response object with file_name': (r) => {
                    try {
                        return typeof r.json('downloaded.0.response.file_name') === 'string' && r.json('downloaded.0.response.file_name').length > 0;
                    } catch (e) {
                        console.error(`Errors: ${e.message}, with body: ${generateInvoiceRes.body}`);
                        return false;
                    }
                },
            });
            addMetrics(generateInvoiceRes, generateInvoiceRes.status === 201);
            if (generateInvoiceRes.status !== 201) {
                console.error(`VU ${__VU} [Generate Invoice] FAILED for order: ${orderIdForStatusUpdate}. Status: ${generateInvoiceRes.status}, Body: ${generateInvoiceRes.body}`);
            }
            sleep(5);
        } else if (orderStatus !== null) {
            // If status is known but not 'pending' or 'processing'
            console.log(`VU ${__VU} Order status is: '${orderStatus}'. Skipping processing, checks, and invoice generation.`);
            // Optionally add a small sleep here if needed for pacing
            sleep(2);
        } else {
            // If status could not be determined (e.g., view failed or parsing failed)
            console.warn(`VU ${__VU} Could not determine order status for ${orderIdForStatusUpdate}. Skipping processing, checks, and invoice generation.`);
            sleep(2);
        }
    });
}

