// v2/flows/pages/ordersFilter.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config
    // Import specific metrics for this flow
    orderFilterResponseTime, orderFilterSuccessRate, orderFilterRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
// Optimization: Pass statusTag directly instead of parsing URL
function addMetrics(response, statusTag = 'none', isSuccessCheck = null) {
    // Default success is 2xx or 3xx
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200);

    // Use the provided statusTag
    const tags = { status: response.status, filter_status: String(statusTag) }; // Ensure it's a string
    // --- END UPDATED TAG LOGIC ---

    try {
        // Use the filter-specific metrics
        orderFilterResponseTime.add(response.timings.duration, tags);
        orderFilterSuccessRate.add(success, tags);
        orderFilterRequestCount.add(1, tags);
    } catch (e) {
        // Catch potential errors during metric addition (like invalid tags)
        console.error(`VU ${__VU} Failed to add metrics: ${e}. Tags: ${JSON.stringify(tags)}`);
    }
}

// Helper function to view details and events (remains the same)
// Optimization: Accept status to pass down to addMetrics
function viewFirstOrderDetailsAndEvents(filterResponse, authToken, groupTags, status) {
    let firstOrderId = null;
    let foundOrder = false;

    // 1. Check if filter was successful and extract ID
    try {
        if (filterResponse.status === 200) {
            const body = filterResponse.json();
            if (body?.orders?.length > 0 && body.orders[0].id) {
                firstOrderId = body.orders[0].id;
                foundOrder = true;
                console.log(`VU ${__VU} Orders Filter: Found order ID ${firstOrderId} from filter result.`);
            } else {
                console.warn(`VU ${__VU} Orders Filter: Filter successful but no orders found in response.`);
            }
        } else {
            console.warn(`VU ${__VU} Orders Filter: Preceding filter request failed (Status: ${filterResponse.status}). Skipping detail/event view.`);
        }
    } catch (e) {
        console.error(`VU ${__VU} Orders Filter: Failed to parse filter response JSON. Error: ${e.message}`);
    }

    // 2. If ID found, make the detail and event requests
    if (foundOrder && firstOrderId) {
        console.log(`VU ${__VU} Orders Filter: Viewing details and events for order ${firstOrderId}.`);

        // View Details Request
        const viewDetailsRes = makeRequest(
            'get',
            `${BASE_URL}/admin/orders/${firstOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            `/admin/orders/{id} (View Details after Filter)`
        );
        addMetrics(viewDetailsRes, `view_after_${status}`); // Pass status context

        // View Events Request
        const viewEventsRes = makeRequest(
            'get',
            `${BASE_URL}/admin/order-event?order_id=${firstOrderId}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            `/admin/order-event (View Events after Filter)`
        );
        addMetrics(viewEventsRes, `view_after_${status}`); // Pass status context

        sleep(0.5); // Add a small sleep after viewing details/events

    } else {
        // If no order was found or filter failed, skip and maybe compensate sleep
        console.warn(`VU ${__VU} Orders Filter: Skipping detail/event view as no order ID was extracted.`);
        sleep(0.5); // Compensate for the skipped sleep
    }
}


export function ordersFilterFlow(authToken, configData) {
    // Extract needed data
    const { depotId } = configData;

    group('Orders Filter', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Filter: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Filter: Skipping flow due to missing depotId in configData.`);
            return;
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Filter: Simulating various status filters for Depot ID: ${depotId}`);
        const groupTags = { group: 'Orders Filter' }; // Define tags for makeRequest

        // Define common base parameters for filter requests
        const baseFilterParams = `expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`;

        // --- Define the statuses to filter by ---
        const statusesToFilter = ['processing', 'confirmed', 'ready_for_delivery', 'shipped', 'delivered', 'paid'];

        // --- Loop through statuses and perform filter + view ---
        for (const status of statusesToFilter) {
            console.log(`VU ${__VU} Orders Filter: Filtering by status: ${status}`);

            // Construct URL and request name dynamically
            const filterUrl = `${BASE_URL}/admin/orders?${baseFilterParams}&extended_status[0]=${status}`;
            const requestName = `/admin/orders (Filter Status: ${status})`;

            // Make the filter request
            const filterResponse = makeRequest(
                'get',
                filterUrl,
                null,
                { headers: createHeaders(authToken), tags: groupTags },
                requestName
            );
            
            // console.log (filterResponse.orders[0].id)

            check(filterResponse, {
                [`Filter by ${status} - status is 200`]: (r) => r.status === 200,
            });

            addMetrics(filterResponse, status); // Pass the status directly

            // Call helper to view details/events of the first result
            viewFirstOrderDetailsAndEvents(filterResponse, authToken, groupTags, status); // Pass status

            // Sleep after each filter + view combo
            sleep(Math.random() * 2 + 0.5);
        }

    }); // End group('Orders Filter')
}
