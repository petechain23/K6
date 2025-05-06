// v2/flows/ordersCreate.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, ORDER_CREATE_URL, REGION_ID,
    VARIANT_ID_6, VARIANT_ID_10, VARIANT_ID_11, VARIANT_ID_12, // Use IDs from config
    orderCreationRequestCount, orderCreationResponseTime, orderCreationSuccessRate, // Specific metrics
} from '../config.js'; // Adjust path
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status === 200);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderCreationResponseTime.add(response.timings.duration, tags);
    orderCreationSuccessRate.add(success, tags);
    orderCreationRequestCount.add(1, tags);
}

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

export function ordersCreateFlow(authToken, configData) { // Pass configData like outletId
    const { outletId, depotId, userEmail, customerId, locationId } = configData;

    group('Orders Create', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} - Skipping Orders Create due to missing auth token.`);
            return;
        }
        if (!outletId) {
             console.warn(`VU ${__VU} - Skipping Orders Create due to missing outletId in configData.`);
             return;
        }
        if (!depotId) {
            console.warn(`VU ${__VU} Orders Create: Skipping flow due to missing depotId in configData.`);
            return;
       }
    //    // Add checks for the newly required fields
    //    if (!locationId) {
    //         console.warn(`VU ${__VU} Orders Create: Skipping flow due to missing locationId in configData.`);
    //         return;
    //    }
    //    if (!customerId) {
    //         console.warn(`VU ${__VU} Orders Create: Skipping flow due to missing customerId in configData.`);
    //    }

        // Log the randomly selected outlet ID and potentially the edit/update order ID
        console.log(`VU ${__VU} starting iteration: using Depot ${depotId}, Outlet Id ${outletId}}`);

        const groupTags = { group: 'Orders Create' }; // Define tags for makeRequest

        // Select Depot
        const numReadyResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
        addMetrics(numReadyResponse);
        sleep(0.5);

        const numActiveResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (Select Depot)');
        addMetrics(numActiveResponse);
        sleep(0.5);

        const numNeedReviewResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (Select Depot)');
        addMetrics(numNeedReviewResponse);
        sleep(0.5);

        // Fetch the actual list of the first 20 orders, filtered by the selected depot
        const depotFilteredOrderCreate = makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`,
            null,
            { headers: createHeaders(authToken), tags: groupTags },
            '/admin/orders (List orders page, Select Depot)'
        );
        addMetrics(depotFilteredOrderCreate);
        randomSleep();

        // // --- Dynamic ID extraction and Conditional View ---
        // let orderIdView3 = null;
        // let foundThirdOrder = false;
        // try {
        //      if (depotFilteredOrderCreate.status === 200) {
        //         const depotFilteredListBody = depotFilteredOrderCreate.json();
        //         if (depotFilteredListBody?.orders?.length > 0 && depotFilteredListBody.orders[0].id) {
        //             orderIdView3 = depotFilteredListBody.orders[0].id;
        //             foundThirdOrder = true;
        //             console.log(`VU ${__VU} Orders Create: Found order ID for view: ${orderIdView3}`);
        //         } else { console.warn(`VU ${__VU} Orders Create: List successful but no orders found.`); }
        //     } else { console.error(`VU ${__VU} Orders Create: Failed to get list. Status: ${depotFilteredOrderCreate.status}`); }
        // } catch (e) { console.error(`VU ${__VU} Orders Create: Failed to parse list JSON. Error: ${e.message}`); }

        // if (foundThirdOrder && orderIdView3) {
        //     console.log(`VU ${__VU} Orders Create: Proceeding to view details for order ${orderIdView3}`);
        //     const viewDetailsResponse = makeRequest('get', `${BASE_URL}/admin/orders/${orderIdView3}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/{id} (View Details 2)');
        //     addMetrics(viewDetailsResponse);
        //     const viewEventResponse = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${orderIdView3}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/order-event (View Details 2)');
        //     addMetrics(viewEventResponse);
        //     sleep(2);
        // } else {
        //      console.warn(`VU ${__VU} Orders Create: Skipping 'View Order 2 Details'...`);
        //      sleep(2);
        // }
        // // --- End Conditional View ---

        // // Scrolling Outlet list
        // for (let i = 0; i < 5; i++) {
        //     const offset = i * 20;
        //     const outletPayload = { outletDepots: [depotId], include_address: true };
        //     const outletListResponse = makeRequest('post', `${BASE_URL}/admin/outlets/fetch?offset=${offset}&limit=20&q=`, outletPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, `/admin/outlets/fetch (List Outlets ${i + 1})`);
        //     addMetrics(outletListResponse);
        //     sleep(Math.random() * 1 + 0.5);
        // }

        // Perform Create Order
        const createPayload = {
            order_type: 'standard',
            email: userEmail || 'nengahpuspayoga23@yopmail.com',
            region_id: REGION_ID,
            shipping_methods: [{ option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ' }], // Indonesia
            shipping_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
            billing_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
            customer_id: customerId || 'cus_01JM74671R0812YXBZEP4W2KKC',
            depot_id: depotId,
            outlet_id: outletId,
            // include_brand: true, //not used ID-Hotfix
            metadata: { source_system: 'OMS' }, 
            location_id: locationId, // Use locationId directly from configData
            items: [
                { variant_id: VARIANT_ID_6, quantity: 1, metadata: {} },
                { variant_id: VARIANT_ID_10, quantity: 2, metadata: {} },
                { variant_id: VARIANT_ID_11, quantity: 3, metadata: {} },
                { variant_id: VARIANT_ID_12, quantity: 4, metadata: {} }
            ]
        };
        const createOrderResponse = makeRequest('post', `${BASE_URL}/${ORDER_CREATE_URL}`, createPayload, { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags }, '/admin/orders/create (Order Create)');
        check(createOrderResponse, {
            'Create Order - status is 200': (r) => r.status === 200,
            'Create Order - body contains display_id': (r) => r.body && r.body.includes('display_id'),
        });
        addMetrics(createOrderResponse, createOrderResponse.status === 200);
        randomSleep();
        // console.log(createOrderResponse.body);
        // console.log(createOrderResponse.status);
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
            } else { console.error(`VU ${__VU} Orders Create: Create failed. Status: ${createOrderResponse.status} Body: ${createOrderResponse.body}`);}
         } catch(e) { console.error(`VU ${__VU} Orders Create: Failed to parse create response JSON. Error: ${e.message}`); }

        if (isCreateSuccessful) {
            // console.log(`VU ${__VU} Orders Create: Refreshing counts post-create.`);
            const postCreateNumActive = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-active (After Order Created)');
            
            addMetrics(postCreateNumActive);
            
            const postCreateNumNeedReview = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders/number-of-order-need-review (After Order Created)');
            addMetrics(postCreateNumNeedReview);
            
            const postCreateList = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${depotId}`, null, { headers: createHeaders(authToken), tags: groupTags }, '/admin/orders (List orders page, After Order Created)');
            addMetrics(postCreateList);
        } else {
            console.warn(`VU ${__VU} Orders Create: Skipping post-create checks.`);
            sleep(1);
        }
    });
}
