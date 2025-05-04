// v2/flows/pages/ordersScrolling.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config
    // Import specific metrics for this flow
    orderScrollingResponseTime, orderScrollingSuccessRate, orderScrollingRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200); // Expect 200 for GET list
    const tags = { status: response.status };

    // Use the scrolling-specific metrics
    orderScrollingResponseTime.add(response.timings.duration, tags);
    orderScrollingSuccessRate.add(success, tags);
    orderScrollingRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersScrollingFlow(authToken, configData) {
    // Extract needed data
    const { depotId } = configData;
    const maxScrollPages = 10; // Maximum number of pages to scroll (e.g., 10 means pages 1 through 10)
    const limitPerPage = 20; // Number of items per page

    group('Orders Scrolling', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Scrolling: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Scrolling: Skipping flow due to missing depotId in configData.`);
            return;
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders Scrolling: Scrolling through order pages for Depot ID: ${depotId}`);
        const groupTags = { group: 'Orders Scrolling' }; // Define tags for makeRequest

        // Define common base parameters for scrolling requests
        // Note: Removed unnecessary browser headers, using createHeaders for Auth/Accept
        // Adding include_count=true to potentially get the total count, though we don't use it yet.
        const baseScrollParams = `expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&limit=${limitPerPage}&order=-created_at&include_count=true&depot_id=${depotId}`;

        // --- Loop through pages to simulate scrolling ---
        // Start from page 1 (offset 0) up to maxScrollPages
        for (let page = 1; page <= maxScrollPages; page++) {
            const offset = (page - 1) * limitPerPage; // Page 1 -> offset 0, Page 2 -> offset 20, etc.
            const scrollUrl = `${BASE_URL}/admin/orders?${baseScrollParams}&offset=${offset}`;
            const requestName = `/admin/orders (Scrolling Page ${page}, Offset ${offset})`;

            console.log(`VU ${__VU} Orders Scrolling: Fetching ${requestName} (Offset: ${offset})`);

            // Make the scrolling request
            const scrollResponse = makeRequest(
                'get',
                scrollUrl,
                null,
                { headers: createHeaders(authToken), tags: groupTags }, // Use standard headers
                requestName
            );
            randomSleep();

            // console.log(`Orders Scrolling: Response for ${requestName}:`, JSON.stringify(scrollResponse, null, 2));

            let responseBody = null;
            let parseError = null;
            try {
                responseBody = scrollResponse.json();
            } catch (e) {
                parseError = e;
                console.error(`VU ${__VU} Orders Scrolling: Failed to parse JSON for page ${page}. Error: ${e.message}`);
            }

            let ordersCount = 0;
            if (responseBody && Array.isArray(responseBody.orders)) {
                ordersCount = responseBody.orders.length;
            } else if (!parseError) { // Only warn if parsing didn't already fail
                console.warn(`VU ${__VU} Orders Scrolling: Response body for page ${page} missing 'orders' array.`);
            }

            // Check response status, structure, offset, and limit
            check(scrollResponse, {
                [`Scrolling Page ${page} - status is 200`]: (r) => r.status === 200,
                [`Scrolling Page ${page} - body parsed successfully`]: () => parseError === null,
                [`Scrolling Page ${page} - body has correct structure`]: (r) => {
                    // Check structure using the pre-parsed body, only if parsing succeeded
                    return responseBody && typeof responseBody === 'object' &&
                        Array.isArray(responseBody.orders) &&
                        typeof responseBody.count === 'number' &&
                        typeof responseBody.offset === 'number' &&
                        typeof responseBody.limit === 'number';
                },
                [`Scrolling Page ${page} - offset matches expected (${offset})`]: () => responseBody?.offset === offset,
                [`Scrolling Page ${page} - limit matches expected (${limitPerPage})`]: () => responseBody?.limit === limitPerPage,
            });

            // Add metrics for this scroll request
            addMetrics(scrollResponse);

            // If the request failed (non-200) or returned no orders, stop scrolling
            if (scrollResponse.status !== 200 || ordersCount === 0) {
                console.log(`VU ${__VU} Orders Scrolling: Stopping scroll at page ${page}. Status: ${scrollResponse.status}, Orders received: ${ordersCount}`);
                break; // Exit the loop
            }
            // Simulate think time between scrolling actions
            randomSleep();
        }
    });
}
