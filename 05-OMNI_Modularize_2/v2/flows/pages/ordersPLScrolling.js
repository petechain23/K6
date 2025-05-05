// v2/flows/pages/ordersPLScrolling.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config
    // Import specific metrics for this flow
    plScrollingResponseTime, plScrollingSuccessRate, plScrollingRequestCount, REGION_ID
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 200 OK for GET
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200);
    const tags = { status: response.status };

    // Use the PL scrolling-specific metrics
    plScrollingResponseTime.add(response.timings.duration, tags);
    plScrollingSuccessRate.add(success, tags);
    plScrollingRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersPLScrollingFlow(authToken, configData) {
    // Use LOCATION_ID , depotId and outletId from configData
    const { depotId, outletId, locationId } = configData;

    group('Orders PL Scrolling', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders PL Scrolling: Skipping flow due to missing auth token.`);
            return;
        }
        // Check only for IDs coming from configData
        if (!depotId || !outletId || !locationId) {
            console.warn(`VU ${__VU} Orders PL Scrolling: Skipping flow due to missing IDs in configData (Depot: ${depotId}, Outlet: ${outletId}). Using REGION_ID: ${REGION_ID}, LOCATION_ID: ${locationId} from config.`);
            return;
        }
        // --- End Initial Checks ---

        console.log(`VU ${__VU} Orders PL Scrolling: Fetching variants for Depot ${depotId}, Outlet ${outletId}`);
        const groupTags = { group: 'Orders PL Scrolling' }; // Define tags for makeRequest
        const limit = 20; // Items per page
        const maxScrolls = 3; // Limit how many pages we scroll to avoid infinite loops in test
        let currentLastId = null;
        // Construct the base URL outside the loop
        const baseUrl = `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${depotId}&outlet_id=${outletId}&location_id=${locationId}&include_empties_deposit=true&allow_empties_return=false&limit=${limit}&offset=0&q=&expand=product.brand`; // Added expand=product.brand as per comment

        for (let i = 0; i <= maxScrolls; i++) {
            let url = baseUrl; // Start with the base URL
            if (currentLastId) {
                url += `&last_id=${currentLastId}`; // Append last_id only if it exists
            }

            const scrollResponse = makeRequest(
                'get',
                url,
                null,
                { headers: createHeaders(authToken), tags: groupTags },
                `/admin/variants/depot-variants (Scroll ${i})` // Tagged endpoint name
            );
            addMetrics(scrollResponse);
            randomSleep();

            let parsedBody = null;
            let parseError = null;
            try {
                parsedBody = scrollResponse.json();
            } catch (e) {
                parseError = e;
            }

            const checkNamePrefix = `PL Scroll ${i}`;
            check(scrollResponse, {
                [`${checkNamePrefix} - status is 200`]: (r) => r.status === 200,
                [`${checkNamePrefix} - body parsed successfully`]: () => parseError === null,
                [`${checkNamePrefix} - has variants array`]: () => parsedBody && Array.isArray(parsedBody.variants)
                // [`${checkNamePrefix} - has metadata object`]: () => parsedBody && typeof parsedBody.metadata === 'object' && parsedBody.metadata !== null,
            });

            // If request failed OR parsing failed, stop scrolling immediately
            if (scrollResponse.status !== 200 || parseError) {
                console.warn(`VU ${__VU} Orders PL Scrolling: Stopping scroll at page ${i} due to HTTP status ${scrollResponse.status} or JSON parse error. Body: ${scrollResponse.body ? scrollResponse.body.substring(0, 200) : 'N/A'}`);
                break;
            }

            // Get the last_id for the next iteration, using optional chaining in case metadata is missing
            currentLastId = parsedBody?.metadata?.last_id;

            // If there's no last_id, we've reached the end
            if (!currentLastId) {
                console.log(`VU ${__VU} Orders PL Scrolling: Reached end of list at page ${i}.`);
                break;
            }

            // If we've done the max number of scrolls, log it and break
            if (i === maxScrolls) {
                console.log(`VU ${__VU} Orders PL Scrolling: Reached max scroll limit (${maxScrolls}).`);
                break;
            }
            randomSleep();
        }
    });
}
