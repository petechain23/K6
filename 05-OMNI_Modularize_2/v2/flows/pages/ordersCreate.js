// v2/flows/ordersCreate.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, FRONTEND_URL, REGION_ID, DEPOT_ID_FILTER, LOCATION_ID_EDIT,
    VARIANT_ID_EDIT_6, VARIANT_ID_EDIT_10, VARIANT_ID_EDIT_11, VARIANT_ID_EDIT_12, // Use IDs from config
    orderCreateResponseTime, orderCreateSuccessRate, orderCreateRequestCount, // Specific metrics
} from '../../config.js'; // Adjust path
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderCreateResponseTime.add(response.timings.duration, tags);
    orderCreateSuccessRate.add(success, tags);
    orderCreateRequestCount.add(1, tags);
}

export function ordersCreateFlow(authToken, configData) { // Pass configData like outletId
    const { outletId } = configData; // Extract needed data from the object passed by main.js

    group('Orders Create', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} - Skipping Orders Create due to missing auth token.`);
            return;
        }
        if (!outletId) {
             console.warn(`VU ${__VU} - Skipping Orders Create due to missing outletId in configData.`);
             return;
        }

        const groupTags = { group: 'Orders Create' }; // Define tags for makeRequest

        // Select Depot
        const numReadyResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
        addMetrics(numReadyResponse);

        const numActiveResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (Select Depot)');
        addMetrics(numActiveResponse);

        const numNeedReviewResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (Select Depot)');
        addMetrics(numNeedReviewResponse);

        // Fetch the actual list of the first 20 orders, filtered by the selected depot
        const depotFilteredOrderCreate = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List orders page, Select Depot)'
        );
        addMetrics(depotFilteredOrderCreate);

        sleep(0.5);

        // --- Dynamic ID extraction and Conditional View ---
        let orderIdView3 = null;
        let foundThirdOrder = false;
        try {
             if (depotFilteredOrderCreate.status === 200) {
                const depotFilteredListBody = depotFilteredOrderCreate.json();
                if (depotFilteredListBody?.orders?.length > 0 && depotFilteredListBody.orders[0].id) {
                    orderIdView3 = depotFilteredListBody.orders[0].id;
                    foundThirdOrder = true;
                    console.log(`VU ${__VU} Orders Create: Found order ID for view: ${orderIdView3}`);
                } else { console.warn(`VU ${__VU} Orders Create: List successful but no orders found.`); }
            } else { console.error(`VU ${__VU} Orders Create: Failed to get list. Status: ${depotFilteredOrderCreate.status}`); }
        } catch (e) { console.error(`VU ${__VU} Orders Create: Failed to parse list JSON. Error: ${e.message}`); }

        if (foundThirdOrder && orderIdView3) {
            console.log(`VU ${__VU} Orders Create: Proceeding to view details for order ${orderIdView3}`);
            const viewDetailsResponse = makeRequest('get', `${BASE_URL}/admin/orders/${orderIdView3}?expand=...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Details 2)');
            addMetrics(viewDetailsResponse);
            const viewEventResponse = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${orderIdView3}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Details 2)');
            addMetrics(viewEventResponse);
            sleep(2);
        } else {
             console.warn(`VU ${__VU} Orders Create: Skipping 'View Order 2 Details'...`);
             sleep(2);
        }
        // --- End Conditional View ---

        // Scrolling Outlet list
        for (let i = 0; i < 5; i++) {
            const offset = i * 20;
            const outletPayload = { outletDepots: [DEPOT_ID_FILTER], include_address: true };
            const outletListResponse = makeRequest('post', `${BASE_URL}/admin/outlets/fetch?offset=${offset}&limit=20&q=`, outletPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, `/admin/outlets/fetch (List Outlets ${i + 1})`);
            addMetrics(outletListResponse);
            sleep(Math.random() * 1 + 0.5);
        }

        // Prepare for Order Create
        const stockLocResponse = makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/stock-locations (For Order Create)');
        addMetrics(stockLocResponse);

        const depotVariantsResponse1 = makeRequest('get', `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outletId}&location_id=${LOCATION_ID_EDIT}&...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/variants/depot-variants (For Order Create)');
        addMetrics(depotVariantsResponse1);
        sleep(1);

        const depotVariantsResponse2 = makeRequest('get', `${BASE_URL}/admin/variants/depot-variants?...&last_id=...`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/variants/depot-variants (For Order Create -last_id)');
        addMetrics(depotVariantsResponse2);
        sleep(1);

        // Perform Create Order
        const createPayload = {
            order_type: 'standard',
            email: configData.userEmail || 'default-email@example.com', // Get email from configData if passed
            region_id: REGION_ID,
            shipping_methods: [{ option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ' }], // Parameterize?
            shipping_address: { /* ... */ },
            billing_address: { /* ... */ },
            customer_id: configData.customerId || 'cus_01JM74671R0812YXBZEP4W2KKC', // Parameterize?
            depot_id: DEPOT_ID_FILTER,
            outlet_id: outletId,
            include_brand: true,
            metadata: { source_system: 'OMS' },
            location_id: LOCATION_ID_EDIT,
            items: [
                { variant_id: VARIANT_ID_EDIT_6, quantity: 1, metadata: {} },
                { variant_id: VARIANT_ID_EDIT_10, quantity: 2, metadata: {} },
                { variant_id: VARIANT_ID_EDIT_11, quantity: 3, metadata: {} },
                { variant_id: VARIANT_ID_EDIT_12, quantity: 4, metadata: {} }
            ]
        };
        const createOrderResponse = makeRequest('post', `${BASE_URL}/${ORDER_CREATE_URL}`, createPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, '/admin/orders/create (Order Create)');
        addMetrics(createOrderResponse, createOrderResponse.status === 200); // Specific success check

        sleep(1.5);

        // --- Conditional Refresh ---
        let createdOrderId = null;
        let isCreateSuccessful = false;
         try {
            if (createOrderResponse.status === 200) {
                 const body = createOrderResponse.json();
                 createdOrderId = body?.order?.id;
                 isCreateSuccessful = !!createdOrderId; // True if ID exists
                 if(isCreateSuccessful) console.log(`VU ${__VU} Orders Create: Order created successfully with ID: ${createdOrderId}`);
                 else console.warn(`VU ${__VU} Orders Create: Status 200 but ID not found.`);
            } else { console.error(`VU ${__VU} Orders Create: Create failed. Status: ${createOrderResponse.status}`);}
         } catch(e) { console.error(`VU ${__VU} Orders Create: Failed to parse create response JSON. Error: ${e.message}`); }

        if (isCreateSuccessful) {
            console.log(`VU ${__VU} Orders Create: Refreshing counts post-create.`);
            const postCreateNumActive = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (After Order Created)');
            addMetrics(postCreateNumActive);
            const postCreateNumNeedReview = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Order Created)');
            addMetrics(postCreateNumNeedReview);
            const postCreateList = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List orders page, After Order Created)');
            addMetrics(postCreateList);
            sleep(0.5);
        } else {
            console.warn(`VU ${__VU} Orders Create: Skipping post-create checks.`);
            sleep(0.5);
        }
        // --- End Conditional Refresh ---
    });
}
