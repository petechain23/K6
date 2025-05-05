// v2/flows/pages/ordersSearch.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config
    // Import specific metrics for this flow (We'll add these to config.js later)
    orderSearchResponseTime, orderSearchSuccessRate, orderSearchRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200); // Expect 200 for GET list/search
    const tags = { status: response.status };

    // Use the search-specific metrics
    orderSearchResponseTime.add(response.timings.duration, tags);
    orderSearchSuccessRate.add(success, tags);
    orderSearchRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

// Helper function to view details of the first search result (Optional)
function viewFirstSearchResult(searchResponse, authToken, groupTags, searchTerm) {
    let firstOrderId = null;
    let foundOrder = false;

    try {
        if (searchResponse.status === 200) {
            const body = searchResponse.json();
            if (body?.orders?.length > 0 && body.orders[0].id) {
                firstOrderId = body.orders[0].id;
                foundOrder = true;
                console.log(`VU ${__VU} Orders Search: Found order ID ${firstOrderId} from search result for '${searchTerm}'.`);
            } else {
                console.warn(`VU ${__VU} Orders Search: Search for '${searchTerm}' successful but no orders found.`);
            }
        } else {
            console.warn(`VU ${__VU} Orders Search: Search request for '${searchTerm}' failed (Status: ${searchResponse.status}). Skipping detail view.`);
        }
    } catch (e) {
        console.error(`VU ${__VU} Orders Search: Failed to parse search response JSON for '${searchTerm}'. Error: ${e.message}`);
    }

    if (foundOrder && firstOrderId) {
        console.log(`VU ${__VU} Orders Search: Viewing details for order ${firstOrderId}.`);
        // View Details Request (Simplified example)
        const viewDetailsRes = makeRequest(
            'get',
            `${BASE_URL}/admin/orders/${firstOrderId}?expand=outlet&fields=id,display_id,status,extended_status`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            `/admin/orders/{id} (View Details after Search '${searchTerm}')`
        );
        
        addMetrics(viewDetailsRes); // Add metrics for this specific request
        randomSleep();
    } else {
        console.warn(`VU ${__VU} Orders Search: Skipping detail view for '${searchTerm}' as no order ID was extracted.`);
        randomSleep();
    }
}

export function ordersSearchFlow(authToken, configData) {
    const { depotId } = configData;

    group('Orders Search', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Search: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Search: Skipping flow due to missing depotId in configData.`);
            return;
        }

        console.log(`VU ${__VU} Orders Search: Performing searches in Depot ID: ${depotId}`);
        const groupTags = { group: 'Orders Search' };
        const baseListParams = `expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`;

        // --- Search by Number --- 
        // Notes: remove &depot_id=${depotId} to search all depots
        const numericSearchTerm = '1991';
        const searchNumericRes = makeRequest('get', `${BASE_URL}/admin/orders?${baseListParams}&q=${numericSearchTerm}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/orders (Search ${numericSearchTerm})`);
        check(searchNumericRes, { // Check added for numeric search
            [`Search by Number (${numericSearchTerm}) - status is 200`]: (r) => r.status === 200,
        });

        addMetrics(searchNumericRes);
        randomSleep();
        // viewFirstSearchResult(searchNumericRes, authToken, groupTags, numericSearchTerm);
        
        // Clear Search
        const clearSearch1Res = makeRequest('get', `${BASE_URL}/admin/orders?${baseListParams}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List After Clear Search1)');;
        addMetrics(clearSearch1Res);
        randomSleep();
        
        // --- Search by Text ---
        const textSearchTerm = 'OMS';
        const searchTextRes = makeRequest('get', `${BASE_URL}/admin/orders?${baseListParams}&q=${textSearchTerm}`, null, { headers: createHeaders(authToken), tags: groupTags }, `/admin/orders (Search ${textSearchTerm})`);
        check(searchTextRes, { // Check added for text search
            [`Search by Text (${textSearchTerm}) - status is 200`]: (r) => r.status === 200,
        });

        addMetrics(searchTextRes);
        randomSleep();
        // viewFirstSearchResult(searchTextRes, authToken, groupTags, textSearchTerm);

        // Clear Search
        const clearSearch2Res = makeRequest('get', `${BASE_URL}/admin/orders?${baseListParams}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List After Clear Search2)');

        addMetrics(clearSearch2Res);
        randomSleep();
    });
}
