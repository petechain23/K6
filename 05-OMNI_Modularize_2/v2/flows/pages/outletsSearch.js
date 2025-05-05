import { group, check, sleep } from 'k6';
import {
    BASE_URL,
    outletSearchResponseTime, outletSearchSuccessRate, outletSearchRequestCount
} from '../config.js'; // Assuming BASE_URL is here
import { makeRequest, createHeaders } from '../utils.js'; // Assuming helpers are here - Removed addMetrics import

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200); // Expect 200 for search
    const tags = { status: response.status }; // Add basic tags for specific metrics
    outletSearchResponseTime.add(response.timings.duration, tags);
    outletSearchSuccessRate.add(success, tags);
    outletSearchRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

// Helper function for common search response checks
function checkSearchResponse(response, checkPrefix) {
    check(response, {
        [`${checkPrefix} - status is 200`]: (r) => r.status === 200,
        [`${checkPrefix} - body is valid JSON`]: (r) => {
            try {
                r.json(); // Attempt to parse
                return true;
            } catch (e) { return false; }
        },
        [`${checkPrefix} - has outlets array and count`]: (r) => {
            try {
                const body = r.json();
                // Check structure
                return Array.isArray(body?.outlets) && typeof body?.count === 'number' && body.count >= 0;
            } catch (e) { return false; } // If JSON parsing failed, this check also fails
        }
    });
}

// Define the flow function
export function outletsSearchFlow(authToken, configData = {}) {
    // Extract required data from configData
    const { depotId, externalId2 } = configData; // Extract depotId and the general externalId2
    const searchByExternalId = externalId2 || '10118111'; // Use externalId2 from config, fallback to default
    const searchByTextTerm = 'BIBIMBAP'; // Hardcode the text search term

    group('Outlets Search', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} Outlets Search: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Outlets Search: Skipping flow due to missing depotId in configData.`);
            return;
        }

        console.log(`VU ${__VU} Outlets Search: Performing searches in Depot ID: ${depotId}`);
        const groupTags = { group: 'Outlets Search' };
        const searchUrl = `${BASE_URL}/admin/outlets/fetch`;
        // Updated payload structure based on the latest context provided
        const searchPayload = {
            outletDepots: [depotId], // Use depotId here
            include_address: true,
        };

        // --- 1. Search by Outlet ID ---
        console.log(`VU ${__VU} Outlets Search: Outlets Search (by ID) with query '${searchByExternalId}'`);
        const resSearchById = makeRequest(
            'post',
            `${searchUrl}?offset=0&limit=20&q=${searchByExternalId}`,
            searchPayload, // Pass object directly
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/outlets/fetch (by ID)'
        );
        
        checkSearchResponse(resSearchById, 'Outlets Search (by ID)');
        addMetrics(resSearchById);
        randomSleep();

        // --- Clear Search (List all in depot) --- [First Clear]
        console.log(`VU ${__VU} Outlets Search: Outlets Search (Clear 1) with query ''`);
        const resClearSearch1 = makeRequest(
            'post',
            `${searchUrl}?offset=0&limit=20&q=`,
            searchPayload, // Pass object directly
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/outlets/fetch (Clear Search 1)'
        );
        
        checkSearchResponse(resClearSearch1, 'Outlets Search (Clear 1)');
        addMetrics(resClearSearch1);
        randomSleep();

        // --- 2. Search by Text ---
        console.log(`VU ${__VU} Outlets Search: Outlets Search (by Text) with query '${searchByTextTerm}'`);
        const resSearchByText = makeRequest(
            'post',
            `${searchUrl}?offset=0&limit=20&q=${searchByTextTerm}`,
            searchPayload, // Pass object directly
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/outlets/fetch (by Text)'
        );
        
        checkSearchResponse(resSearchByText, 'Outlets Search (by Text)');
        addMetrics(resSearchByText);
        // Simulate think time between scrolling actions
        randomSleep();

        // --- Clear Search (List all in depot) --- [Second Clear]
        console.log(`VU ${__VU} Outlets Search: Outlets Search (Clear 2) with query ''`);
        const resClearSearch2 = makeRequest(
            'post',
            `${searchUrl}?offset=0&limit=20&q=`,
            searchPayload, // Pass object directly
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/outlets/fetch (Clear Search 2)'
        );
        checkSearchResponse(resClearSearch2, 'Outlets Search (Clear 2)');
        addMetrics(resClearSearch2);
        andomSleep();
    });
}
