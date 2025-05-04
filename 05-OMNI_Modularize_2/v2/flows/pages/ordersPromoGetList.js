// v2/flows/pages/ordersPromoGetList.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, // Base config
    // Import specific metrics for this flow
    promoGetListResponseTime, promoGetListSuccessRate, promoGetListRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 200 OK for GET/POST in this context
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200);
    const tags = { status: response.status };

    // Use the promotion-specific metrics
    promoGetListResponseTime.add(response.timings.duration, tags);
    promoGetListSuccessRate.add(success, tags);
    promoGetListRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersPromoGetListFlow(authToken, configData) {
    // Extract needed data from configData passed by main.js
    const { depotExternalId, outletExternalId } = configData;

    group('Orders Promotions Get List', function () {
        // --- Initial Checks ---
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Promotions: Skipping flow due to missing auth token.`);
            return;
        }
        if (!depotExternalId || !outletExternalId) {
            console.warn(`VU ${__VU} Orders Promotions: Skipping flow due to missing depotExternalId (${depotExternalId}) or outletExternalId (${outletExternalId}) in configData.`);
            return;
        }
        // --- End Initial Checks ---
        console.log(`VU ${__VU} Orders Promotions: Fetching promotions for Depot ${depotExternalId}, Outlet ${outletExternalId}`);
        const groupTags = { group: 'Orders Promotions Get List' }; // Define tags for makeRequest

        // --- Get Promotions List ---
        // Construct URL dynamically using data from configData
        const promoListUrl = `${BASE_URL}/admin/promotions/get-list?depot_external_id=${depotExternalId}&outlet_external_id=${outletExternalId}&start_before=2025-05-01T00:00:00.000Z&end_after=2025-05-01T00:00:00.000Z`;
        const promoListResponse = makeRequest(
            'get',
            promoListUrl,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/promotions/get-list'
        );
        randomSleep();
        addMetrics(promoListResponse);

        // Optimize checks by parsing JSON once
        let parsedPromoListBody = null;
        let promoListParseError = null;
        try {
            parsedPromoListBody = promoListResponse.json();
        } catch (e) {
            promoListParseError = e;
            console.error(`VU ${__VU} Orders Promotions: Failed to parse promo list JSON. Error: ${e.message}`);
        }

        check(promoListResponse, {
            'Get Promotions List - status is 200': (r) => r.status === 200,
            'Get Promotions List - body parsed successfully': () => promoListParseError === null,
            // Corrected check based on provided examples { "promotionList": [...] }
            'Get Promotions List - body has promotionList array': (r) => {
                // Check structure using the pre-parsed body, only if parsing succeeded
                return parsedPromoListBody !== null && typeof parsedPromoListBody === 'object' && Array.isArray(parsedPromoListBody.promotionList);
            },
            // Enhanced check for content structure (empty array or array with objects having expected properties)
            'Get Promotions List - content is valid (empty or has items with expected structure)': (r) => {
                // Reuse parsedBody, check only if parsing succeeded and basic structure is okay
                let isValid = false; // Assume invalid initially
                if (parsedPromoListBody === null || typeof parsedPromoListBody !== 'object' || !Array.isArray(parsedPromoListBody.promotionList)) {
                    isValid = false;
                } else if (parsedPromoListBody.promotionList.length === 0) {
                    // If the array is empty, it's valid
                    isValid = true;
                } else {
                    // If not empty, check the first element's structure for key properties
                    const firstItem = parsedPromoListBody.promotionList[0];
                    isValid = typeof firstItem === 'object' && firstItem !== null &&
                           firstItem.hasOwnProperty('id') && typeof firstItem.id === 'string' &&
                           firstItem.hasOwnProperty('promotion_name') && typeof firstItem.promotion_name === 'string';// &&
                        //    firstItem.hasOwnProperty('promo_type') && typeof firstItem.promo_type === 'string' &&
                        //    firstItem.hasOwnProperty('activity_type') && typeof firstItem.activity_type === 'string' &&
                        //    firstItem.hasOwnProperty('periode_start') && typeof firstItem.periode_start === 'string'; // Add more checks as needed
                }

                // If the structure is not valid, log the response body
                if (!isValid) {
                    console.warn(`VU ${__VU} Orders Promotions: Unexpected promo list structure. Response Body: ${r.body}`);
                }
                return isValid; // Return the result of the validation
            }
        });
        // console.log(promoListResponse.body)

        randomSleep(); // Think time after getting list

        // --- Get Depot Variants (External) ---
        // Note: The SKU list is very long and hardcoded. Consider parameterizing if needed.
        const depotVariantsResponse = makeRequest(
            'post',
            `${BASE_URL}/admin/variants/depot-variants-external?limit=0`, // Added &expand=product.brand in ID QA
            `{"include_empties_deposit":true,"sku":["L66661","L66662","50074","50074","50074","50074","54027","54027","54027","54027","46903","46903","46903","46903","54026","54026","54026","54026","50074",
        "50074","50074","50074","54027","54027","54027","54027","46903","46903","46903","46903","54026","54026","54026","54026","53031","53031","53031","53709","53709","53709","53063","53063","53063",
        "54070","54070","54070","54071","54071","54071","60075","60075","60075","53031","53031","53031","53709","53709","53709","53063","53063","53063","54070","54070","54070","54071","54071","54071",
        "60075","60075","60075","3609","3609","3609","3609","53076","53076","53076","53076","3610","3610","3610","3610","53671","53671","53671","53671","53675","53675","53675","53675","50721","50721",
        "50721","50721","50689","50689","50689","50689","3609","3609","3609","3609","53076","53076","53076","53076","3610","3610","3610","3610","53671","53671","53671","53671","53675","53675","53675",
        "53675","50721","50721","50721","50721","50689","50689","50689","50689","10436","10436","10436","10436","10436","10436","10436","10436","10164","10166","53993","45447","10163","10165","60970",
        "60970","60970","60970","60983","60983","60983","60983","62818","62818","62818","62818","63528","63528","63528","63528","60970","60970","60970","60970","60983","60983","60983","60983","62818",
        "62818","62818","62818","63528","63528","63528","63528","64709","L53031","L10166","64709"],"depotExternalID":"${depotExternalId}","outletExternalID":"${outletExternalId}"}`,
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/variants/depot-variants-external'
        );
        randomSleep();
        addMetrics(depotVariantsResponse);

        // Optimize checks by parsing JSON once
        let parsedDepotVariantsBody = null;
        let depotVariantsParseError = null;
        try {
            parsedDepotVariantsBody = depotVariantsResponse.json();
        } catch (e) {
            depotVariantsParseError = e;
            console.error(`VU ${__VU} Orders Promotions: Failed to parse depot variants JSON. Error: ${e.message}`);
        }

        check(depotVariantsResponse, {
            'Get Depot Variants - status is 200': (r) => r.status === 200,
            'Get Depot Variants - body parsed successfully': () => depotVariantsParseError === null,
            'Get Depot Variants - has variants array': () => {
                // Check structure using the pre-parsed body, only if parsing succeeded
                return parsedDepotVariantsBody !== null && typeof parsedDepotVariantsBody === 'object' && Array.isArray(parsedDepotVariantsBody.variants);
            }
        });

    }); // End group
}