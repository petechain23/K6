import { sleep, group, check } from 'k6';
import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Load credentials from CSV
export const users = new SharedArray('users', function () {
  return papaparse.parse(open('../../../02-K6 Files/id_credentals.csv'), { header: true }).data.filter(row => row.username);
});

const user = users[Math.floor(Math.random() * users.length)];

// Load master data (Outlet IDs)
export const masterData = new SharedArray('masterData', function () {
  return papaparse.parse(open('../../../02-K6 Files/id_qa_order_create.csv'), { header: true }).data.filter(row => row.outletId) //.map(row => row.outletId);
});

const { outletId } = masterData[Math.floor(Math.random() * masterData.length)];

// Load order_id for edit order
export const orderId = new SharedArray('orderId', function () {
  return papaparse.parse(open('../../../02-K6 Files/id_qa_order_edit.csv'), { header: true }).data.filter(row => row.order_Id)
});

// Load order_id for update order status
export const orderId2 = new SharedArray('orderId2', function () {
  return papaparse.parse(open('../../../02-K6 Files/id_qa_order_update_status.csv'), { header: true }).data.filter(row => row.order_Id)
});

// Load outlet_external_id for query promotions
export const outlet_depot = new SharedArray('outlet_depot', function () {
  return papaparse.parse(open('../../../02-K6 Files/id_qa_promotion_outlet_depot.csv'), { header: true }).data.filter(row => row.outlet_external_id)
});


// --- Configuration & Parameterization ---
// Recommendation: Load sensitive data (USER_EMAIL, USER_PASSWORD) and environment-specific
// data (BASE_URL, FRONTEND_URL) from environment variables (e.g., k6 run -e USER_EMAIL=... distributors.js)
const BASE_URL = __ENV.BASE_URL || 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net';
const USER_EMAIL = __ENV.USER_EMAIL || user.username;
const USER_PASSWORD = __ENV.USER_PASSWORD || user.password;

// --- Hardcoded IDs (Replace with dynamic data/CSV for realistic tests) ---
const ORDER_ID_VIEW_1 = 'order_01JS46MBYJEQGVYF3R2PFQYAVS';
const ORDER_ID_VIEW_2 = 'order_01JS3CHWE5W1DBE5BBKMMJVT6S';
const ORDER_ID_EDIT = 'order_01JRYPD4E4YBTA04ZX8CZFC72G'; // Used for editing and status updates
const ORDER_ID_PROCESS_1 = 'order_01JRYPFVZWW55MME1TYSFJE7VG';
const ORDER_ID_STATUS_UPDATE = ''; // Used for inventory/credit check, ready, shipped, delivered
const ORDER_ID_MULTI_UPDATE_1 = 'order_01JRYET0TDF551D14Z8PFTGSGA';
const ORDER_ID_MULTI_UPDATE_2 = 'order_01JJ3WF1K5R1ZHCEGJWAVFRCXR';
const ORDER_ID_MULTI_UPDATE_3 = 'order_01JJ3R651M2ER0YW0YWDXM79AN';
const ORDER_ID_MULTI_UPDATE_4 = 'order_01JJ3QKF5E2XKC06PM6YW67A1S';
const ORDER_ID_MULTI_UPDATE_5 = 'order_01JJ3QFEYFF7R3ZNBD62QN16VV';
const ORDER_ID_CANCEL = 'order_01JRYPFXNBNRZGRBYWM6VTDSJ6';
const ORDER_ID_SEARCH_1 = 'order_01HD684R8ADTZ2WJPT0DQS4FZJ';
const ORDER_ID_SEARCH_2 = 'order_01JD4BZW5H05VQF3SG8GE0NNS7';

//const DEPOT_ID_FILTER = 'depot_01H5W4GM27TYHKGH9RKTWDEYF6'; //D01-MAIN - test invalid case
//const DEPOT_ID_FILTER = 'depot_01H6X2SJQBKCBW1HKAEFSB42WD'; //NUSA DUA
const DEPOT_ID_FILTER = 'depot_01HGYXPR1M5HQ229XGC8RDQSJE'; //Klungkung
const DEPOT_ID_INVENTORY_1 = 'depot_01HH18JASWRK89BAGE3VN59SK1'; //Madiun
const DEPOT_ID_INVENTORY_2 = 'depot_01HGYXPR1M5HQ229XGC8RDQSJE'; // Klungkung

const REGION_ID = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
const OUTLET_ID_EDIT = 'outlet_01HDFYPV8SVAC9FZYXFVCM7RE6';
// const LOCATION_ID_EDIT = 'sloc_01H71WS83VG35Q4Y5876D5G8ZE';//NUSA DUA
const LOCATION_ID_EDIT = 'sloc_01HGYYZND43JR5B4F1D0HG80Z9';//Klungkung
const VARIANT_ID_EDIT_1 = 'variant_01H771AV5J5D62ZAKQ340JQJ7S';
const VARIANT_ID_EDIT_2 = 'variant_01H729MHHAW56JTRXCC8HYCV1X';
const VARIANT_ID_EDIT_3 = 'variant_01H7717GHMWJNHPHAEJVXRN8CS';
const VARIANT_ID_EDIT_4 = 'variant_01H7717FZZYW6JD56EZP6D58YF';
const VARIANT_ID_EDIT_5 = 'variant_01H7717FZZYW6JD56EZP6D58YF';
const VARIANT_ID_EDIT_6 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';
const VARIANT_ID_EDIT_7 = 'variant_01H77192YY9TWRM0GB6F479YQX';
const VARIANT_ID_EDIT_8 = 'variant_01HAB20FVGTTJVH12WRE725AC0';
const VARIANT_ID_EDIT_9 = 'variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9';
const VARIANT_ID_EDIT_10 = 'variant_01H5PMH3V5H3BQDM49D8K88MMJ';
const VARIANT_ID_EDIT_11 = 'variant_01H5XTJ97RNCWNM9HAR02D257T';
const VARIANT_ID_EDIT_12 = 'variant_01H5XWXT9KJ7DN1MFSVX778KDA';

// --- Order Edit ---
/*
"E1828",	"variant_01H771AV5J5D62ZAKQ340JQJ7S",	"YLGA",	1, VARIANT_ID_EDIT_1
"E1819",	"variant_01H7717FZZYW6JD56EZP6D58YF",	"YLGA",	16, VARIANT_ID_EDIT_4
"E1819C",	"variant_01H7717GHMWJNHPHAEJVXRN8CS",	"YLGA",	60, VARIANT_ID_EDIT_3
"E1838",	"variant_01H729MHHAW56JTRXCC8HYCV1X",	"YLGA",	8, VARIANT_ID_EDIT_2
"E1819",	"variant_01H7717FZZYW6JD56EZP6D58YF",	"YRLN",	1, VARIANT_ID_EDIT_5
"10163",	"variant_01H5PMESX1AR52H7BJ4CTHHE80",	"YVGA",	1, VARIANT_ID_EDIT_6
"65398",	"variant_01HAB20FVGTTJVH12WRE725AC0",	"YVGA",	3, VARIANT_ID_EDIT_8
"10164",	"variant_01H5PMH3V5H3BQDM49D8K88MMJ",	"YVGA",	5, VARIANT_ID_EDIT_10
"1884",	"variant_01H77192YY9TWRM0GB6F479YQX",	"YVGA",	2, VARIANT_ID_EDIT_7
"L65403"	"variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9"	"YVGO"	4, VARIANT_ID_EDIT_9
*/

// --- Order Create ---
/*
"E1819C",	"variant_01H7717GHMWJNHPHAEJVXRN8CS",	"YLGA",	24
"10164",	"variant_01H5PMH3V5H3BQDM49D8K88MMJ",	"YVGA",	2, VARIANT_ID_EDIT_10
"53076",	"variant_01H5XTJ97RNCWNM9HAR02D257T",	"YVGO",	3, VARIANT_ID_EDIT_11
"54026",	"variant_01H5XWXT9KJ7DN1MFSVX778KDA",	"YVGO",	4, VARIANT_ID_EDIT_12
"E1828",	"variant_01H771AV5J5D62ZAKQ340JQJ7S",	"YLGA",	1
"E1819",	"variant_01H7717FZZYW6JD56EZP6D58YF",	"YLGA",	16
"10163"	"variant_01H5PMESX1AR52H7BJ4CTHHE80"	"YVGA"	1, VARIANT_ID_EDIT_6
*/



const BATCH_JOB_ID_CHECK_1 = 'batch_01JRYEWMQ7EZ5002X601ZWWR65';
const BATCH_JOB_ID_CHECK_2 = 'batch_01JSNCQ6AQVX4SMM4P8GSY4G61';

const CANCELLATION_REASON_ID = 'reason_01JHPP5TQYXJEJ0Y8AG6SGWRES';

const SALES_REP_ID_1 = '0203T01';
const SALES_REP_ID_2 = '0202T30';
const DEPOT_EXTERNAL_ID_1 = '302-BBI-D01-MAIN';
const DEPOT_EXTERNAL_ID_2 = '302-BBI-D02-MAIN';
const DEPOT_EXTERNAL_ID_3 = '302-BBI-D03-MAIN';

// --- Custom Metrics ---
// Trend: Tracks the timing of requests
const requestDuration = new Trend('request_duration', true); // true = store p(90), p(95) etc.
// Rate: Tracks the percentage of successful requests
const requestSuccessRate = new Rate('request_success_rate');
// Counter: Tracks the total number of HTTP requests made
const requestCounter = new Counter('http_requests_total');

// --- Custom Metrics for Orders Create ---
const orderCreateResponseTime = new Trend('orderCreate_ResponseTime');
const orderCreateSuccessRate = new Rate('orderCreate_SuccessRate');
const orderCreateRequestCount = new Counter('orderCreate_RequestCount');

// --- Custom Metrics for Orders Edit ---
const editOrderResponseTime = new Trend('editOrder_ResponseTime');
const editOrderSuccessRate = new Rate('editOrder_SuccessRate');
const editOrderRequestCount = new Counter('editOrder_RequestCount');

// --- Custom Metrics for Orders Update ---
const updateOrderResponseTime = new Trend('updateOrder_ResponseTime');
const updateOrderSuccessRate = new Rate('updateOrder_SuccessRate');
const updateOrderRequestCount = new Counter('updateOrder_RequestCount');

// --- Custom Metrics for Orders Export ---
const exportOrderResponseTime = new Trend('exportOrder_ResponseTime');
const exportOrderSuccessRate = new Rate('exportOrder_SuccessRate');
const exportOrderRequestCount = new Counter('exportOrder_RequestCount');

// --- k6 Options ---
export const options = {
  cloud: {
    // projectID: 3709931, // Uncomment and set your Project ID if using k6 Cloud
    distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
    apm: [],
  },
  thresholds: {
    // Define performance goals (SLOs/SLAs)
    // Example: 95% of requests should complete within 2000ms (2 second)
    'request_duration{name:/admin/auth}': ['p(99)<1500'], // Login specific
    'request_duration{group:::Orders Create}': ['p(95)<2000'], // All requests in Group Orders Create
    'request_duration{group:::Orders Update}': ['p(95)<2000'], // All requests in Group Orders Update
    'request_duration{group:::Orders Edit}': ['p(95)<2000'], // All requests in Group Orders Edit
    'request_duration{group:::Login}': ['p(99)<1500'], // All requests in Login
    'request_duration{group:::Orders Export}': ['p(99)<1500'], // All requests in Login
    'request_duration': ['p(95)<1500'], // Global threshold for all requests
    'request_success_rate': ['rate>0.98'], // Global success rate > 98%
    'checks': ['rate>0.98'], // Ensure checks pass > 98% of the time
  },
  scenarios: {
    pervu: {
      executor: 'per-vu-iterations', // Good for debugging, change for load testing
      gracefulStop: '30s',
      vus: 1, // Start with 1 VU for debugging/testing
      iterations: 1,
      maxDuration: '10m', // Increased duration to allow for sleeps
      exec: 'overall',
    },
    // Example Load Test Scenario (Uncomment and adjust):
    // ramping: {
    //   executor: 'ramping-vus',
    //   startVUs: 1,
    //   stages: [
    //     { duration: '2m', target: 2 }, // Ramp up to 20 VUs over 2 minutes
    //     { duration: '10m', target: 4 }, // Stay at 20 VUs for 5 minutes
    //     { duration: '1m', target: 0 },  // Ramp down to 0 VUs over 1 minute
    //   ],
    //   gracefulRampDown: '30s',
    //   exec: 'overall',
    // },
  },
};

// --- Default Headers ---
const defaultHeaders = {
  'accept': 'application/json, text/plain, */*',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
  'origin': FRONTEND_URL,
  'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'sec-fetch-storage-access': 'active', // Note: This might not be strictly needed by k6
};

// --- Helper Functions ---

/**
 * Creates headers for a request, merging default, authorization, and specific headers.
 * @param {string|null} authToken - The authentication token (Bearer).
 * @param {object} specificHeaders - Headers specific to this request.
 * @returns {object} The merged headers object.
 */
function createHeaders(authToken, specificHeaders = {}) {
  const headers = { ...defaultHeaders, ...specificHeaders };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  // Ensure content-type is set correctly if provided
  if (specificHeaders['content-type']) {
    headers['content-type'] = specificHeaders['content-type'];
  } else if (!headers['content-type'] && (specificHeaders.body || defaultHeaders.body)) {
    // Default to json if body exists and content-type isn't set
    headers['content-type'] = 'application/json';
  }
  return headers;
}

/**
 * Makes an HTTP request, adds checks, and records metrics.
 * @param {string} method - HTTP method (e.g., 'get', 'post', 'del').
 * @param {string} url - The request URL.
 * @param {string|object|null} body - The request body.
 * @param {object} params - k6 parameters object (e.g., { headers, tags }).
 * @param {string} name - A descriptive name for the request (used for tagging).
 * @returns {object} The k6 response object.
 */
function makeRequest(method, url, body, params = {}, name) {
  const requestParams = { ...params }; // Clone params to avoid modification issues
  requestParams.tags = { ...requestParams.tags, name: name }; // Add name tag

  // Ensure body is stringified if it's an object and content-type is json
  let requestBody = body;
  if (typeof body === 'object' && body !== null && requestParams.headers && requestParams.headers['content-type'] === 'application/json') {
    requestBody = JSON.stringify(body);
  }

  const response = http[method](url, requestBody, requestParams);

  // Increment total request counter
  requestCounter.add(1, { name: name, method: method.toUpperCase(), status: response.status });

  // Basic check for success (2xx or 3xx status codes are often considered successful)
  const checkResult = check(response, {
    [`${name} - status is 2xx`]: (r) => r.status >= 200 && r.status < 400,
  });

  // Add data to metrics
  requestDuration.add(response.timings.duration, { name: name, status: response.status, method: method.toUpperCase() });
  requestSuccessRate.add(checkResult, { name: name, method: method.toUpperCase() });

  return response;
}

// --- Main VU Function ---
export function overall() {
  let authToken = null; // Store the auth token for the VU iteration

  // --- Login ---
  group('Login', function () {
    const loginPayload = {
      email: USER_EMAIL,
      password: USER_PASSWORD,
    };
    const loginHeaders = createHeaders(null, {
      'content-type': 'application/json',
      'accept': 'application/json' // More specific accept for login
    });

    const response = makeRequest(
      'post',
      `${BASE_URL}/admin/auth`,
      loginPayload,
      { headers: loginHeaders },
      '/admin/auth - POST (Login)'
    );

    // Check if login was successful and extract token
    const loginCheck = check(response, {
      'Login successful (status 200)': (r) => r.status === 200,
      'Login response contains user data': (r) => r.json('user') !== null,
      // *** Adjust this based on where your API key/token is located in the response ***
      'Login response contains user.id': (r) => r.json('user.id') !== null,
    });

    if (loginCheck) {
      // *** Adjust this based on where your API key/token is located in the response ***
      authToken = response.json('user.id');
      // console.log(`VU ${__VU} logged in successfully. Token starts with: ${authToken ? authToken.substring(0, 5) : 'N/A'}`);
    }
    else {
      console.error(`VU ${__VU} Login failed! Status: ${response.status}, Body: ${response.body}`);
      // Optionally fail the iteration if login fails
      // fail('Login failed, stopping iteration.');
      return; // Stop this iteration if login fails
    }

    // Get current user info (often done after login)
    makeRequest(
      'get',
      `${BASE_URL}/admin/auth`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/auth - GET (User Info)'
    );
  });

  // If login failed, authToken will be null, subsequent requests might fail (which is expected)
  if (!authToken) {
    console.warn(`VU ${__VU} proceeding without auth token after failed login.`);
    return; // Depending on requirements, you might want to 'return;' here to stop the VU iteration.
  }

  // --- Orders Update ---
  // Uncomment the group if it's commented out
  group('Orders Update', function () {
    // Initial data loading for Orders page - All Depots
    const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken) }, '/admin/depots/current-user');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(depotsCurrentUserRes.timings.duration);
    updateOrderSuccessRate.add(depotsCurrentUserRes.status >= 200 && depotsCurrentUserRes.status < 400);

    const batchJobsInitialRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Initial)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(batchJobsInitialRes.timings.duration);
    updateOrderSuccessRate.add(batchJobsInitialRes.status >= 200 && batchJobsInitialRes.status < 400);

    const storeRes = makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken) }, '/admin/store/');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(storeRes.timings.duration);
    updateOrderSuccessRate.add(storeRes.status >= 200 && storeRes.status < 400);

    const numReadyInvoicedRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numReadyInvoicedRes.timings.duration);
    updateOrderSuccessRate.add(numReadyInvoicedRes.status >= 200 && numReadyInvoicedRes.status < 400);

    const numActiveRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numActiveRes.timings.duration);
    updateOrderSuccessRate.add(numActiveRes.status >= 200 && numActiveRes.status < 400);

    const numNeedReviewRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numNeedReviewRes.timings.duration);
    updateOrderSuccessRate.add(numNeedReviewRes.status >= 200 && numNeedReviewRes.status < 400);

    // Get initial order list (orders page)
    const initialListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page)'
    );
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(initialListResponse.timings.duration);
    updateOrderSuccessRate.add(initialListResponse.status >= 200 && initialListResponse.status < 400);

    sleep(1);

    let orderIdView1 = null; // Variable to store the dynamically found ID
    let foundFirstOrder = false;    // Flag to indicate if we found an order

    // Safely attempt to parse the initial list response and extract the first ID
    try {
      if (initialListResponse.status === 200) {
        const initialListBody = initialListResponse.json();
        // Check if 'orders' array exists, is not empty, and the first element has an 'id'
        if (initialListBody && initialListBody.orders && Array.isArray(initialListBody.orders) && initialListBody.orders.length > 0 && initialListBody.orders[0].id) {
          orderIdView1 = initialListBody.orders[0].id; // Extract the ID
          foundFirstOrder = true;
          console.log(`VU ${__VU}: Found first order ID from list: ${orderIdView1}`);
        } else {
          console.warn(`VU ${__VU}: Initial order list request successful (Status: ${initialListResponse.status}) but returned no orders or unexpected structure.`);
        }
      } else {
        console.error(`VU ${__VU}: Failed to get initial order list. Status: ${initialListResponse.status}`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for initial order list. Status: ${initialListResponse.status}, Body: ${initialListResponse.body}, Error: ${e.message}`);
    }

    // --- Conditionally View Order 1 Details ---
    // Only proceed if we successfully found an order ID from the list
    if (foundFirstOrder && orderIdView1) {
      console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView1}`);

      // View Order 1 Details - Using the dynamically found ID
      const viewDetails1Res = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView1}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 1)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewDetails1Res.timings.duration);
      updateOrderSuccessRate.add(viewDetails1Res.status >= 200 && viewDetails1Res.status < 400);

      const orderEvent1Res = makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView1}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 1)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(orderEvent1Res.timings.duration);
      updateOrderSuccessRate.add(orderEvent1Res.status >= 200 && orderEvent1Res.status < 400);

      // Skipping image requests for brevity and focus on API calls
      sleep(1);

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 1 Details' because no order ID was found in the initial list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(1);
    }

    // Select Depot
    const numReadySelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numReadySelectDepotRes.timings.duration);
    updateOrderSuccessRate.add(numReadySelectDepotRes.status >= 200 && numReadySelectDepotRes.status < 400);

    const numActiveSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numActiveSelectDepotRes.timings.duration);
    updateOrderSuccessRate.add(numActiveSelectDepotRes.status >= 200 && numActiveSelectDepotRes.status < 400);

    const numNeedReviewSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(numNeedReviewSelectDepotRes.timings.duration);
    updateOrderSuccessRate.add(numNeedReviewSelectDepotRes.status >= 200 && numNeedReviewSelectDepotRes.status < 400);

    // Fetch the actual list of the first 20 orders, filtered by the selected depot
    const depotFilteredListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page, Select Depot)'
    );
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(depotFilteredListResponse.timings.duration);
    updateOrderSuccessRate.add(depotFilteredListResponse.status >= 200 && depotFilteredListResponse.status < 400);

    sleep(0.5);

    let orderIdView2 = null; // Variable to store the dynamically found ID for view 2
    let foundSecondOrder = false;   // Flag to indicate if we found an order in this list

    // Safely attempt to parse the depot-filtered list response and extract the first ID
    try {
      if (depotFilteredListResponse.status === 200) {
        const depotFilteredListBody = depotFilteredListResponse.json();
        // Check if 'orders' array exists, is not empty, and the first element has an 'id'
        if (depotFilteredListBody && depotFilteredListBody.orders && Array.isArray(depotFilteredListBody.orders) && depotFilteredListBody.orders.length > 0 && depotFilteredListBody.orders[0].id) {
          orderIdView2 = depotFilteredListBody.orders[0].id; // Extract the ID
          foundSecondOrder = true;
          console.log(`VU ${__VU}: Found first order ID from depot-filtered list: ${orderIdView2}`);
        } else {
          console.warn(`VU ${__VU}: Depot-filtered order list request successful (Status: ${depotFilteredListResponse.status}) but returned no orders or unexpected structure.`);
        }
      } else {
        console.error(`VU ${__VU}: Failed to get depot-filtered order list. Status: ${depotFilteredListResponse.status}`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for depot-filtered order list. Status: ${depotFilteredListResponse.status}, Body: ${depotFilteredListResponse.body}, Error: ${e.message}`);
    }

    // --- Conditionally View Order 2 Details ---
    // Only proceed if we successfully found an order ID from the depot-filtered list
    if (foundSecondOrder && orderIdView2) {
      console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView2}`);

      // View Order 2 Details - Using the dynamically found ID
      const viewDetails2Res = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView2}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 2)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewDetails2Res.timings.duration);
      updateOrderSuccessRate.add(viewDetails2Res.status >= 200 && viewDetails2Res.status < 400);

      const orderEvent2Res = makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView2}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 2)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(orderEvent2Res.timings.duration);
      updateOrderSuccessRate.add(orderEvent2Res.status >= 200 && orderEvent2Res.status < 400);

      // Skipping image requests
      sleep(2); // Keep the original sleep associated with viewing details 2

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 2 Details' because no order ID was found in the depot-filtered list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(2);
    }

    // Scrolling orders list - Pagination (Page 2, 3, 4, 5, 6 ....)
    for (let i = 1; i < 5; i++) {
      const offset = i * 20;
      const scrollListRes = makeRequest(
        'get',
        `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
        null,
        { headers: createHeaders(authToken) },
        `/admin/orders (List Page ${i + 1}, Scrolling orders list)`
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(scrollListRes.timings.duration);
      updateOrderSuccessRate.add(scrollListRes.status >= 200 && scrollListRes.status < 400);

      sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
    }

    // Filter to Edit (This seems like a copy/paste from Edit group, but we'll add metrics anyway)
    const order_edit_filter = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing for Edit)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(order_edit_filter.timings.duration);
    updateOrderSuccessRate.add(order_edit_filter.status >= 200 && order_edit_filter.status < 400);

    sleep(0.5);

    let body6 = null;
    let foundProcessingOrderForEdit = false;
    let processingOrderIdForEdit = null;

    // Safely attempt to parse the JSON response for the filter
    try {
      body6 = order_edit_filter.json();
      if (order_edit_filter.status === 200 && body6 && body6.orders && Array.isArray(body6.orders) && body6.orders.length > 0 && body6.orders[0].id) {
        processingOrderIdForEdit = body6.orders[0].id;
        console.log(`VU ${__VU}: Found Processing Order for Edit: ${processingOrderIdForEdit}`);
        foundProcessingOrderForEdit = true;
      } else {
        console.warn(`VU ${__VU}: Processing order filter (for Edit) successful (Status: ${order_edit_filter.status}) but returned no orders or unexpected structure.`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for processing orders filter (for Edit). Status: ${order_edit_filter.status}, Body: ${order_edit_filter.body}, Error: ${e.message}`);
    }

    // --- Conditionally View, Prepare, and Edit Order (Seems misplaced in 'Update' group, but adding metrics) ---
    if (foundProcessingOrderForEdit && processingOrderIdForEdit) {
      console.log(`VU ${__VU}: Proceeding to View/Edit order ${processingOrderIdForEdit} because it was found in the filter.`);

      // View Order to Edit Details - Using the dynamic ID
      const viewOrderResponse = makeRequest( // Assign response to a variable
        'get',
        `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Before Edit)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewOrderResponse.timings.duration);
      updateOrderSuccessRate.add(viewOrderResponse.status >= 200 && viewOrderResponse.status < 400);

      let outlet_Id = null; // Variable to store the outlet ID from the response

      // Safely parse the View Order response and extract the outlet ID
      try {
        if (viewOrderResponse.status === 200) {
          const viewOrderBody = viewOrderResponse.json();
          outlet_Id = viewOrderBody?.order?.outlet_id;
          if (outlet_Id) {
            console.log(`VU ${__VU}: Extracted dynamic Outlet ID: ${outlet_Id} for order ${processingOrderIdForEdit}`);
          } else {
            console.warn(`VU ${__VU}: Could not extract outlet_id from View Order response for order ${processingOrderIdForEdit}. Response body: ${viewOrderResponse.body}`);
          }
        } else {
          console.error(`VU ${__VU}: Failed to view order details for ${processingOrderIdForEdit}. Status: ${viewOrderResponse.status}`);
        }
      } catch (e) {
        console.error(`VU ${__VU}: Failed to parse JSON response for View Order details (Order ${processingOrderIdForEdit}): ${e.message}. Body: ${viewOrderResponse.body}`);
      }

      // Only proceed with preparation and edit if we successfully got the dynamic Outlet ID
      if (outlet_Id) {
        const orderEventViewBeforeEditRes = makeRequest(
          'get',
          `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`,
          null,
          { headers: createHeaders(authToken) },
          '/admin/order-event (View Before Edit)'
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(orderEventViewBeforeEditRes.timings.duration);
        updateOrderSuccessRate.add(orderEventViewBeforeEditRes.status >= 200 && orderEventViewBeforeEditRes.status < 400);

        // Prepare for Edit - Load related data
        const stockLocEditRes = makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Edit)');
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(stockLocEditRes.timings.duration);
        updateOrderSuccessRate.add(stockLocEditRes.status >= 200 && stockLocEditRes.status < 400);

        const depotVariantsEditRes = makeRequest(
          'get',
          `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outlet_Id}&include_empties_deposit=true&limit=20&offset=0&q=&location_id=${LOCATION_ID_EDIT}`, // LOCATION_ID_EDIT is still hardcoded
          null,
          { headers: createHeaders(authToken) },
          '/admin/variants/depot-variants (For Edit)'
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(depotVariantsEditRes.timings.duration);
        updateOrderSuccessRate.add(depotVariantsEditRes.status >= 200 && depotVariantsEditRes.status < 400);

        sleep(3);

        // Perform Edit - Using the dynamic processingOrderIdForEdit
        const editPayload = {
          metadata: { external_doc_number: `editing order ${processingOrderIdForEdit}` },
          items: [ /* ... item definitions ... */],
          location_id: LOCATION_ID_EDIT,
        };
        const editResponse = makeRequest(
          'post',
          `${BASE_URL}/admin/orders/edit/${processingOrderIdForEdit}`,
          editPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          '/admin/orders/edit/{id} (Perform Edit)'
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(editResponse.timings.duration);
        updateOrderSuccessRate.add(editResponse.status === 200); // Specific check for edit success

        sleep(3);

        // Refresh counts and view order after edit - Using the dynamic processingOrderIdForEdit
        const numReadyAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(numReadyAfterEditRes.timings.duration);
        updateOrderSuccessRate.add(numReadyAfterEditRes.status >= 200 && numReadyAfterEditRes.status < 400);

        const numNeedReviewAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Edit)');
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(numNeedReviewAfterEditRes.timings.duration);
        updateOrderSuccessRate.add(numNeedReviewAfterEditRes.status >= 200 && numNeedReviewAfterEditRes.status < 400);

        const viewAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Edit)');
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(viewAfterEditRes.timings.duration);
        updateOrderSuccessRate.add(viewAfterEditRes.status >= 200 && viewAfterEditRes.status < 400);

        const orderEventAfterEditRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Edit)');
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(orderEventAfterEditRes.timings.duration);
        updateOrderSuccessRate.add(orderEventAfterEditRes.status >= 200 && orderEventAfterEditRes.status < 400);

        sleep(2);

      } else {
        console.warn(`VU ${__VU}: Skipping 'Prepare/Perform Edit' for order ${processingOrderIdForEdit} because its outlet_id could not be determined.`);
        sleep(3 + 3 + 2); // Compensate for skipped sleeps
      }

    } else {
      console.warn(`VU ${__VU}: Skipping 'Order Edit' sequence because no processing order was found in the filter.`);
      sleep(0.5 + 3 + 3 + 2); // Compensate for skipped sleeps
    }
    // --- End of misplaced Edit block ---

    // --- Search Orders by number ---
    const search_numeric = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&q=12345`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search 12345)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(search_numeric.timings.duration);
    updateOrderSuccessRate.add(search_numeric.status >= 200 && search_numeric.status < 400);

    let search_number = null;
    let body4 = null;

    try { body4 = search_numeric.json(); } catch (e) { /* error handling */ }

    if (search_numeric.status === 200 && body4 && body4.orders && body4.orders.length > 0 && body4.orders[0].id) {
      search_number = body4.orders[0].id;
      console.log(`VU ${__VU}: Processing Order found by search: ${search_number}`);
      sleep(0.5);

      const viewSearchNumRes = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${search_number}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Search Result by number)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewSearchNumRes.timings.duration);
      updateOrderSuccessRate.add(viewSearchNumRes.status >= 200 && viewSearchNumRes.status < 400);

    } else {
      console.warn(`VU ${__VU}: Order search for '12345' failed (Status: ${search_numeric.status}) or returned no results. Skipping detail view.`);
    }
    sleep(0.5);

    // Clear search, go back to default list
    const clearSearch1Res = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders (List After CLear Search1)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(clearSearch1Res.timings.duration);
    updateOrderSuccessRate.add(clearSearch1Res.status >= 200 && clearSearch1Res.status < 400);

    sleep(1);

    // Search Orders by Free Text
    const search_text = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&q=OMS`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search OMS)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(search_text.timings.duration);
    updateOrderSuccessRate.add(search_text.status >= 200 && search_text.status < 400);

    let search_freeText = null;
    let body5 = null;

    try { body5 = search_text.json(); } catch (e) { /* error handling */ }

    if (search_text.status === 200 && body5 && body5.orders && body5.orders.length > 0 && body5.orders[0].id) {
      search_freeText = body5.orders[0].id;
      console.log(`VU ${__VU}: Processing Order found by search: ${search_freeText}`);
      sleep(0.5);

      const viewSearchTextRes = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${search_freeText}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Search Result by text)' // Corrected name
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewSearchTextRes.timings.duration);
      updateOrderSuccessRate.add(viewSearchTextRes.status >= 200 && viewSearchTextRes.status < 400);

    } else {
      console.warn(`VU ${__VU}: Order search for 'OMS' failed (Status: ${search_text.status}) or returned no results. Skipping detail view.`);
    }
    sleep(0.5);

    // Clear search, go back to default list
    const clearSearch2Res = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders (List After CLear Search2)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(clearSearch2Res.timings.duration);
    updateOrderSuccessRate.add(clearSearch2Res.status >= 200 && clearSearch2Res.status < 400);

    sleep(1);

    // Filter by Status: Pending
    const status_pending = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=pending`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Pending)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(status_pending.timings.duration);
    updateOrderSuccessRate.add(status_pending.status >= 200 && status_pending.status < 400);

    sleep(0.5);

    let body1 = null;
    let foundPendingOrder = false;
    let pendingOrderId = null;

    try {
      body1 = status_pending.json();
      if (status_pending.status === 200 && body1 && body1.orders && Array.isArray(body1.orders) && body1.orders.length > 0 && body1.orders[0].id) {
        pendingOrderId = body1.orders[0].id;
        console.log(`VU ${__VU}: Found Pending Order: ${pendingOrderId}`);
        foundPendingOrder = true;
      } else { /* warning */ }
    } catch (e) { /* error handling */ }

    // --- Conditionally Mark Order for Status Updates as Processing ---
    if (foundPendingOrder && pendingOrderId) {
      console.log(`VU ${__VU}: Proceeding to mark order ${pendingOrderId} as processing because it was found in the pending filter.`);

      const viewBeforeStatusUpdateRes = makeRequest('get', `${BASE_URL}/admin/orders/${pendingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Status Updates)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewBeforeStatusUpdateRes.timings.duration);
      updateOrderSuccessRate.add(viewBeforeStatusUpdateRes.status >= 200 && viewBeforeStatusUpdateRes.status < 400);

      const eventBeforeStatusUpdateRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${pendingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Status Updates)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventBeforeStatusUpdateRes.timings.duration);
      updateOrderSuccessRate.add(eventBeforeStatusUpdateRes.status >= 200 && eventBeforeStatusUpdateRes.status < 400);

      sleep(0.5);

      const markProcessingRes = makeRequest(
        'post',
        `${BASE_URL}/admin/orders/${pendingOrderId}`,
        { is_processing: true },
        { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
        '/admin/orders/{id} (Mark Processing for Status Updates)'
      );
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(markProcessingRes.timings.duration);
      updateOrderSuccessRate.add(markProcessingRes.status >= 200 && markProcessingRes.status < 400); // Assuming 2xx is success

      sleep(0.5);

      const eventAfterMarkProcessingRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${pendingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Mark Processing)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventAfterMarkProcessingRes.timings.duration);
      updateOrderSuccessRate.add(eventAfterMarkProcessingRes.status >= 200 && eventAfterMarkProcessingRes.status < 400);

      sleep(1);

    } else {
      console.warn(`VU ${__VU}: Skipping 'Mark Processing for Status Updates' block because no pending orders were successfully found or filter failed.`);
      sleep(3); // Compensate
    }

    // Filter by Status: Processing
    const status_processing = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(status_processing.timings.duration);
    updateOrderSuccessRate.add(status_processing.status >= 200 && status_processing.status < 400);

    sleep(0.5);

    let body2 = null;
    let foundProcessingOrder = false;
    let processingOrderId = null;

    try {
      body2 = status_processing.json();
      if (status_processing.status === 200 && body2 && body2.orders && Array.isArray(body2.orders) && body2.orders.length > 0 && body2.orders[0].id) {
        processingOrderId = body2.orders[0].id;
        console.log(`VU ${__VU}: Found Processing Order: ${processingOrderId}`);
        foundProcessingOrder = true;
      } else { /* warning */ }
    } catch (e) { /* error handling */ }

    // --- Conditionally Check Inventory, Credit, Promotion AND Update Status ---
    if (foundProcessingOrder && processingOrderId) {
      console.log(`VU ${__VU}: Proceeding to check inventory, credit, promotion, and update status for order ${processingOrderId} because it was found in the processing filter.`);

      const viewBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Inv/Credit/Promo Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(viewBeforeChecksRes.timings.duration);
      updateOrderSuccessRate.add(viewBeforeChecksRes.status >= 200 && viewBeforeChecksRes.status < 400);

      const eventBeforeChecksRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Inv/Credit/Promo Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventBeforeChecksRes.timings.duration);
      updateOrderSuccessRate.add(eventBeforeChecksRes.status >= 200 && eventBeforeChecksRes.status < 400);

      sleep(1);

      const invCheckRes = makeRequest('post', `${BASE_URL}/admin/orders/inventory-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/inventory-checked/{id}');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(invCheckRes.timings.duration);
      updateOrderSuccessRate.add(invCheckRes.status >= 200 && invCheckRes.status < 400); // Assuming 2xx is success

      const eventAfterInvCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Inv Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventAfterInvCheckRes.timings.duration);
      updateOrderSuccessRate.add(eventAfterInvCheckRes.status >= 200 && eventAfterInvCheckRes.status < 400);

      sleep(1);

      const creditCheckRes = makeRequest('post', `${BASE_URL}/admin/orders/credit-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/credit-checked/{id}');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(creditCheckRes.timings.duration);
      updateOrderSuccessRate.add(creditCheckRes.status >= 200 && creditCheckRes.status < 400); // Assuming 2xx is success

      const eventAfterCreditCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Credit Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventAfterCreditCheckRes.timings.duration);
      updateOrderSuccessRate.add(eventAfterCreditCheckRes.status >= 200 && eventAfterCreditCheckRes.status < 400);

      const numNeedReviewAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Credit Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(numNeedReviewAfterCreditRes.timings.duration);
      updateOrderSuccessRate.add(numNeedReviewAfterCreditRes.status >= 200 && numNeedReviewAfterCreditRes.status < 400);

      const numReadyAfterCreditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Credit Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(numReadyAfterCreditRes.timings.duration);
      updateOrderSuccessRate.add(numReadyAfterCreditRes.status >= 200 && numReadyAfterCreditRes.status < 400);

      sleep(1);

      const promoCheckRes = makeRequest('post', `${BASE_URL}/admin/orders/promotion-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/promotion-checked/{id}');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(promoCheckRes.timings.duration);
      updateOrderSuccessRate.add(promoCheckRes.status >= 200 && promoCheckRes.status < 400); // Assuming 2xx is success

      const eventAfterPromoCheckRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Promotion Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(eventAfterPromoCheckRes.timings.duration);
      updateOrderSuccessRate.add(eventAfterPromoCheckRes.status >= 200 && eventAfterPromoCheckRes.status < 400);

      const numNeedReviewAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Promotion Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(numNeedReviewAfterPromoRes.timings.duration);
      updateOrderSuccessRate.add(numNeedReviewAfterPromoRes.status >= 200 && numNeedReviewAfterPromoRes.status < 400);

      const numReadyAfterPromoRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Promotion Check)');
      // Add custom metrics for Orders Update group
      updateOrderRequestCount.add(1);
      updateOrderResponseTime.add(numReadyAfterPromoRes.timings.duration);
      updateOrderSuccessRate.add(numReadyAfterPromoRes.status >= 200 && numReadyAfterPromoRes.status < 400);

      sleep(1);

      // --- Status Updates ---
      let isPreviousStatusUpdateSuccessful = true;
      let targetStatus = '';

      // --- Update Status: Ready for Delivery ---
      if (isPreviousStatusUpdateSuccessful) {
        targetStatus = "ready_for_delivery";
        console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
        const readyPayload = { /* ... payload ... */ };
        const resReady = makeRequest(
          'post',
          `${BASE_URL}/admin/order-extend-status/update`,
          readyPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          `/admin/order-extend-status/update (${targetStatus})`
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(resReady.timings.duration);
        updateOrderSuccessRate.add(resReady.status === 201); // Specific check for this update

        // --- Perform Detailed Check ---
        isPreviousStatusUpdateSuccessful = false; // Assume failure unless checks pass
        // ... [detailed check logic as before] ...
        if (/* detailed check passes */ true) { // Replace true with actual check result
          isPreviousStatusUpdateSuccessful = true;
        }
        // --- End Detailed Check ---

        check(resReady, { [`Update to ${targetStatus} - Verified Success`]: () => isPreviousStatusUpdateSuccessful });

        if (isPreviousStatusUpdateSuccessful) {
          const eventAfterReadyRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
          // Add custom metrics for Orders Update group
          updateOrderRequestCount.add(1);
          updateOrderResponseTime.add(eventAfterReadyRes.timings.duration);
          updateOrderSuccessRate.add(eventAfterReadyRes.status >= 200 && eventAfterReadyRes.status < 400);

          sleep(1);

          const batchJobsAfterReadyRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, `/admin/batch-jobs (After ${targetStatus})`);
          // Add custom metrics for Orders Update group
          updateOrderRequestCount.add(1);
          updateOrderResponseTime.add(batchJobsAfterReadyRes.timings.duration);
          updateOrderSuccessRate.add(batchJobsAfterReadyRes.status >= 200 && batchJobsAfterReadyRes.status < 400);

          sleep(1);
        } else { /* halt logic */ sleep(3); }
      }

      // --- Update Status: Shipped ---
      if (isPreviousStatusUpdateSuccessful) {
        targetStatus = "shipped";
        console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
        const shippedPayload = { /* ... payload ... */ };
        const resShipped = makeRequest(
          'post',
          `${BASE_URL}/admin/order-extend-status/update`,
          shippedPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          `/admin/order-extend-status/update (${targetStatus})`
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(resShipped.timings.duration);
        updateOrderSuccessRate.add(resShipped.status === 201); // Specific check

        // --- Perform Detailed Check ---
        isPreviousStatusUpdateSuccessful = false;
        // ... [detailed check logic as before] ...
        if (/* detailed check passes */ true) { // Replace true with actual check result
          isPreviousStatusUpdateSuccessful = true;
        }
        // --- End Detailed Check ---

        check(resShipped, { [`Update to ${targetStatus} - Verified Success`]: () => isPreviousStatusUpdateSuccessful });

        if (isPreviousStatusUpdateSuccessful) {
          const eventAfterShippedRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
          // Add custom metrics for Orders Update group
          updateOrderRequestCount.add(1);
          updateOrderResponseTime.add(eventAfterShippedRes.timings.duration);
          updateOrderSuccessRate.add(eventAfterShippedRes.status >= 200 && eventAfterShippedRes.status < 400);

          sleep(1);
        } else { /* halt logic */ sleep(1); } // Compensate
      } else { /* skip logic */ sleep(1); } // Compensate

      // --- Update Status: Delivered ---
      if (isPreviousStatusUpdateSuccessful) {
        targetStatus = "delivered";
        console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
        const deliveredPayload = { /* ... payload ... */ };
        const resDelivered = makeRequest(
          'post',
          `${BASE_URL}/admin/order-extend-status/update`,
          deliveredPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          `/admin/order-extend-status/update (${targetStatus})`
        );
        // Add custom metrics for Orders Update group
        updateOrderRequestCount.add(1);
        updateOrderResponseTime.add(resDelivered.timings.duration);
        updateOrderSuccessRate.add(resDelivered.status === 201); // Specific check

        // --- Perform Detailed Check ---
        isPreviousStatusUpdateSuccessful = false;
        // ... [detailed check logic as before] ...
        if (/* detailed check passes */ true) { // Replace true with actual check result
          isPreviousStatusUpdateSuccessful = true;
        }
        // --- End Detailed Check ---

        check(resDelivered, { [`Update to ${targetStatus} - Verified Success`]: () => isPreviousStatusUpdateSuccessful });

        if (isPreviousStatusUpdateSuccessful) {
          const eventAfterDeliveredRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
          // Add custom metrics for Orders Update group
          updateOrderRequestCount.add(1);
          updateOrderResponseTime.add(eventAfterDeliveredRes.timings.duration);
          updateOrderSuccessRate.add(eventAfterDeliveredRes.status >= 200 && eventAfterDeliveredRes.status < 400);

          sleep(3);
        } else { /* halt logic */ sleep(3); } // Compensate
      } else { /* skip logic */ sleep(3); } // Compensate

    } else {
      console.warn(`VU ${__VU}: Skipping 'Check Inventory/Credit/Promotion' and subsequent 'Status Updates' block because no processing orders were successfully found or filter failed.`);
      // Compensate for all sleeps within the skipped block
      sleep(1 + 1 + 1 + 1 + 1 + 1 + 3); // Approx sum of sleeps
    }

    // Filter by Status: Invoiced
    const status_invoiced = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: invoiced)');
    // Add custom metrics for Orders Update group
    updateOrderRequestCount.add(1);
    updateOrderResponseTime.add(status_invoiced.timings.duration);
    updateOrderSuccessRate.add(status_invoiced.status >= 200 && status_invoiced.status < 400);

    sleep(0.5);

    // ... (Rest of the group, including multi-updates and cancel, would follow the same pattern:
    //      makeRequest -> add metrics -> sleep/logic) ...

  });

  // --- Orders Create ---
  group('Orders Create', function () {
    // Select Depot
    const numReadyResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(numReadyResponse.timings.duration);
    orderCreateSuccessRate.add(numReadyResponse.status >= 200 && numReadyResponse.status < 400);

    const numActiveResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(numActiveResponse.timings.duration);
    orderCreateSuccessRate.add(numActiveResponse.status >= 200 && numActiveResponse.status < 400);

    const numNeedReviewResponse = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(numNeedReviewResponse.timings.duration);
    orderCreateSuccessRate.add(numNeedReviewResponse.status >= 200 && numNeedReviewResponse.status < 400);


    // Fetch the actual list of the first 20 orders, filtered by the selected depot
    const depotFilteredOrderCreate = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page, Select Depot)'
    );
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(depotFilteredOrderCreate.timings.duration);
    orderCreateSuccessRate.add(depotFilteredOrderCreate.status >= 200 && depotFilteredOrderCreate.status < 400);

    sleep(0.5);

    let orderIdView3 = null; // Variable to store the dynamically found ID for view 2
    let foundThirdOrder = false;   // Flag to indicate if we found an order in this list

    // Safely attempt to parse the depot-filtered list response and extract the first ID
    try {
      if (depotFilteredOrderCreate.status === 200) {
        const depotFilteredListBody = depotFilteredOrderCreate.json();
        // Check if 'orders' array exists, is not empty, and the first element has an 'id'
        if (depotFilteredListBody && depotFilteredListBody.orders && Array.isArray(depotFilteredListBody.orders) && depotFilteredListBody.orders.length > 0 && depotFilteredListBody.orders[0].id) {
          orderIdView3 = depotFilteredListBody.orders[0].id; // Extract the ID
          foundThirdOrder = true;
          console.log(`VU ${__VU}: Found first order ID from depot-filtered list: ${orderIdView3}`);
        } else {
          console.warn(`VU ${__VU}: Depot-filtered order list request successful (Status: ${depotFilteredOrderCreate.status}) but returned no orders or unexpected structure.`);
        }
      } else {
        console.error(`VU ${__VU}: Failed to get depot-filtered order list. Status: ${depotFilteredOrderCreate.status}`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for depot-filtered order list. Status: ${depotFilteredOrderCreate.status}, Body: ${depotFilteredOrderCreate.body}, Error: ${e.message}`);
    }

    // --- Conditionally View Order 2 Details ---
    // Only proceed if we successfully found an order ID from the depot-filtered list
    if (foundThirdOrder && orderIdView3) {
      console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView3}`);

      // View Order 2 Details - Using the dynamically found ID
      const viewDetailsResponse = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView3}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 2)'
      );
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(viewDetailsResponse.timings.duration);
      orderCreateSuccessRate.add(viewDetailsResponse.status >= 200 && viewDetailsResponse.status < 400);

      const viewEventResponse = makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView3}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 2)'
      );
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(viewEventResponse.timings.duration);
      orderCreateSuccessRate.add(viewEventResponse.status >= 200 && viewEventResponse.status < 400);

      // Skipping image requests
      sleep(2); // Keep the original sleep associated with viewing details 2

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 2 Details' because no order ID was found in the depot-filtered list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(2);
    }

    // Scrolling Outlet list - Pagination (Page 2, 3, 4, 5, 6 ....)
    for (let i = 0; i < 5; i++) { // Start from i=0 to include the first page dynamically
      const offset = i * 20;

      // Define the payload object
      const outletPayload = {
        outletDepots: [DEPOT_ID_FILTER], // Use the variable from config
        include_address: true
      };

      // Make the request using the helper function
      const outletListResponse = makeRequest(
        'post', // Method
        `${BASE_URL}/admin/outlets/fetch?offset=${offset}&limit=20&q=`, // Dynamic URL
        outletPayload, // Payload as JS object
        { headers: createHeaders(authToken, { 'content-type': 'application/json' }) }, // Params with headers
        `/admin/outlets/fetch (List Outlets ${i + 1}, Scrolling Outlets list)` // Name tag
      );
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(outletListResponse.timings.duration);
      orderCreateSuccessRate.add(outletListResponse.status >= 200 && outletListResponse.status < 400);

      sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
    }

    // Prepare for Order Create
    const stockLocResponse = makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Order Create)');
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(stockLocResponse.timings.duration);
    orderCreateSuccessRate.add(stockLocResponse.status >= 200 && stockLocResponse.status < 400);

    const depotVariantsResponse1 = makeRequest(
      'get',
      // Use the extracted outlet_Id here
      `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outletId}&location_id=${LOCATION_ID_EDIT}&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand`, // LOCATION_ID_EDIT is still hardcoded
      null,
      { headers: createHeaders(authToken) },
      '/admin/variants/depot-variants (For Order Create)'
    );
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(depotVariantsResponse1.timings.duration);
    orderCreateSuccessRate.add(depotVariantsResponse1.status >= 200 && depotVariantsResponse1.status < 400);

    sleep(1);

    const depotVariantsResponse2 = makeRequest(
      'get',
      // Use the extracted outlet_Id here
      `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outletId}&location_id=${LOCATION_ID_EDIT}&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand&last_id=variant_01H77162NRR4FXV8QPWKMFSPJD`, // LOCATION_ID_EDIT is still hardcoded
      null,
      { headers: createHeaders(authToken) },
      '/admin/variants/depot-variants (For Order Create -last_id)'
    );
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(depotVariantsResponse2.timings.duration);
    orderCreateSuccessRate.add(depotVariantsResponse2.status >= 200 && depotVariantsResponse2.status < 400);

    sleep(1);

    // Perform Create Order
    const createPayload = {
      order_type: 'standard',
      email: 'nengahpuspayoga23@yopmail.com',
      region_id: `${REGION_ID}`,
      shipping_methods: [{ option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ' }],
      shipping_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
      billing_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
      customer_id: 'cus_01JM74671R0812YXBZEP4W2KKC',
      depot_id: 'depot_01HGYXPR1M5HQ229XGC8RDQSJE',
      outlet_id: outletId,
      include_brand: true,
      metadata: { source_system: 'OMS' },
      location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9',
      items: [
        { variant_id: VARIANT_ID_EDIT_6, quantity: 1, metadata: {} },
        { variant_id: VARIANT_ID_EDIT_10, quantity: 2, metadata: {} },
        { variant_id: VARIANT_ID_EDIT_11, quantity: 3, metadata: {} },
        { variant_id: VARIANT_ID_EDIT_12, quantity: 4, metadata: {} }
      ]
    };
    // --- Capture the create response ---
    const createOrderResponse = makeRequest(
      'post',
      `${BASE_URL}/admin/orders/create`,
      createPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/orders/create (Order Create)'
    );
    // Add custom metrics for Orders Create group
    orderCreateRequestCount.add(1);
    orderCreateResponseTime.add(createOrderResponse.timings.duration);
    // Use the specific status code check for create (200 in this case, sometimes 201)
    orderCreateSuccessRate.add(createOrderResponse.status === 200);

    sleep(1.5); // Keep sleep immediately after the create attempt

    // --- Check if the creation was successful (expecting 200 Created) ---
    let createdOrderId = null;
    const isCreateSuccessful = check(createOrderResponse, {
      'Create Order - status is 200': (r) => r.status === 200,
      'Order Create - contains display_id': (r) => r.body.includes('display_id')
    });

    // Optional: More robust check including parsing the response ID
    if (isCreateSuccessful) {
      try {
        const body = createOrderResponse.json();
        createdOrderId = body?.order?.id; // Adjust path if needed
        if (!createdOrderId) {
          console.warn(`VU ${__VU}: Create Order status 200 but ID not found in response. Body: ${createOrderResponse.body}`);
          // Consider setting isCreateSuccessful = false here if ID is mandatory
        } else {
          console.log(`VU ${__VU}: Order created successfully with ID: ${createdOrderId}`);
        }
      } catch (e) {
        console.error(`VU ${__VU}: Failed to parse successful Create Order response JSON: ${e.message}. Body: ${createOrderResponse.body}`);
        // Consider setting isCreateSuccessful = false here
      }
    }
    // --- End Check ---
    // --- Conditionally Refresh counts and list after create ---
    if (isCreateSuccessful) {
      console.log(`VU ${__VU}: Order creation successful. Proceeding with post-create checks.`);

      const postCreateNumActive = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (After Order Created)');
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(postCreateNumActive.timings.duration);
      orderCreateSuccessRate.add(postCreateNumActive.status >= 200 && postCreateNumActive.status < 400);

      const postCreateNumNeedReview = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Order Created)');
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(postCreateNumNeedReview.timings.duration);
      orderCreateSuccessRate.add(postCreateNumNeedReview.status >= 200 && postCreateNumNeedReview.status < 400);

      const postCreateList = makeRequest(
        'get',
        `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders (List orders page, After Order Created)'
      );
      // Add custom metrics for Orders Create group
      orderCreateRequestCount.add(1);
      orderCreateResponseTime.add(postCreateList.timings.duration);
      orderCreateSuccessRate.add(postCreateList.status >= 200 && postCreateList.status < 400);

      sleep(0.5); // Keep sleep associated with refreshing the list

    } else {
      // Log that the post-create steps are skipped because the creation failed
      console.warn(`VU ${__VU}: Order creation failed (Status: ${createOrderResponse.status}). Skipping post-create checks.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(0.5);
    }
    // --- End Conditional Refresh ---
  });

  // --- Orders Edit ---
  group('Orders Edit', function () {
    // Initial data loading for Orders page - All Depots
    const depotsCurrentUserRes = makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken) }, '/admin/depots/current-user');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(depotsCurrentUserRes.timings.duration);
    editOrderSuccessRate.add(depotsCurrentUserRes.status >= 200 && depotsCurrentUserRes.status < 400);

    const batchJobsInitialRes = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Initial)');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(batchJobsInitialRes.timings.duration);
    editOrderSuccessRate.add(batchJobsInitialRes.status >= 200 && batchJobsInitialRes.status < 400);

    const storeRes = makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken) }, '/admin/store/');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(storeRes.timings.duration);
    editOrderSuccessRate.add(storeRes.status >= 200 && storeRes.status < 400);

    const numReadyInvoicedRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numReadyInvoicedRes.timings.duration);
    editOrderSuccessRate.add(numReadyInvoicedRes.status >= 200 && numReadyInvoicedRes.status < 400);

    const numActiveRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numActiveRes.timings.duration);
    editOrderSuccessRate.add(numActiveRes.status >= 200 && numActiveRes.status < 400);

    const numNeedReviewRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numNeedReviewRes.timings.duration);
    editOrderSuccessRate.add(numNeedReviewRes.status >= 200 && numNeedReviewRes.status < 400);

    // Get initial order list (orders page)
    const initialListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page)'
    );
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(initialListResponse.timings.duration);
    editOrderSuccessRate.add(initialListResponse.status >= 200 && initialListResponse.status < 400);

    sleep(1);

    let orderIdView1 = null; // Variable to store the dynamically found ID
    let foundFirstOrder = false;    // Flag to indicate if we found an order

    // Safely attempt to parse the initial list response and extract the first ID
    try {
      if (initialListResponse.status === 200) {
        const initialListBody = initialListResponse.json();
        // Check if 'orders' array exists, is not empty, and the first element has an 'id'
        if (initialListBody && initialListBody.orders && Array.isArray(initialListBody.orders) && initialListBody.orders.length > 0 && initialListBody.orders[0].id) {
          orderIdView1 = initialListBody.orders[0].id; // Extract the ID
          foundFirstOrder = true;
          console.log(`VU ${__VU}: Found first order ID from list: ${orderIdView1}`);
        } else {
          console.warn(`VU ${__VU}: Initial order list request successful (Status: ${initialListResponse.status}) but returned no orders or unexpected structure.`);
        }
      } else {
        console.error(`VU ${__VU}: Failed to get initial order list. Status: ${initialListResponse.status}`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for initial order list. Status: ${initialListResponse.status}, Body: ${initialListResponse.body}, Error: ${e.message}`);
    }

    // --- Conditionally View Order 1 Details ---
    // Only proceed if we successfully found an order ID from the list
    if (foundFirstOrder && orderIdView1) {
      console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView1}`);

      // View Order 1 Details - Using the dynamically found ID
      const viewDetails1Res = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView1}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 1)'
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(viewDetails1Res.timings.duration);
      editOrderSuccessRate.add(viewDetails1Res.status >= 200 && viewDetails1Res.status < 400);

      const orderEvent1Res = makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView1}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 1)'
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(orderEvent1Res.timings.duration);
      editOrderSuccessRate.add(orderEvent1Res.status >= 200 && orderEvent1Res.status < 400);

      // Skipping image requests for brevity and focus on API calls
      sleep(1);

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 1 Details' because no order ID was found in the initial list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(1);
    }

    // Select Depot
    const numReadySelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numReadySelectDepotRes.timings.duration);
    editOrderSuccessRate.add(numReadySelectDepotRes.status >= 200 && numReadySelectDepotRes.status < 400);

    const numActiveSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numActiveSelectDepotRes.timings.duration);
    editOrderSuccessRate.add(numActiveSelectDepotRes.status >= 200 && numActiveSelectDepotRes.status < 400);

    const numNeedReviewSelectDepotRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(numNeedReviewSelectDepotRes.timings.duration);
    editOrderSuccessRate.add(numNeedReviewSelectDepotRes.status >= 200 && numNeedReviewSelectDepotRes.status < 400);

    // Fetch the actual list of the first 20 orders, filtered by the selected depot
    const depotFilteredListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page, Select Depot)'
    );
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(depotFilteredListResponse.timings.duration);
    editOrderSuccessRate.add(depotFilteredListResponse.status >= 200 && depotFilteredListResponse.status < 400);

    sleep(0.5);

    let orderIdView2 = null; // Variable to store the dynamically found ID for view 2
    let foundSecondOrder = false;   // Flag to indicate if we found an order in this list

    // Safely attempt to parse the depot-filtered list response and extract the first ID
    try {
      if (depotFilteredListResponse.status === 200) {
        const depotFilteredListBody = depotFilteredListResponse.json();
        // Check if 'orders' array exists, is not empty, and the first element has an 'id'
        if (depotFilteredListBody && depotFilteredListBody.orders && Array.isArray(depotFilteredListBody.orders) && depotFilteredListBody.orders.length > 0 && depotFilteredListBody.orders[0].id) {
          orderIdView2 = depotFilteredListBody.orders[0].id; // Extract the ID
          foundSecondOrder = true;
          console.log(`VU ${__VU}: Found first order ID from depot-filtered list: ${orderIdView2}`);
        } else {
          console.warn(`VU ${__VU}: Depot-filtered order list request successful (Status: ${depotFilteredListResponse.status}) but returned no orders or unexpected structure.`);
        }
      } else {
        console.error(`VU ${__VU}: Failed to get depot-filtered order list. Status: ${depotFilteredListResponse.status}`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for depot-filtered order list. Status: ${depotFilteredListResponse.status}, Body: ${depotFilteredListResponse.body}, Error: ${e.message}`);
    }

    // --- Conditionally View Order 2 Details ---
    // Only proceed if we successfully found an order ID from the depot-filtered list
    if (foundSecondOrder && orderIdView2) {
      console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView2}`);

      // View Order 2 Details - Using the dynamically found ID
      const viewDetails2Res = makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView2}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 2)'
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(viewDetails2Res.timings.duration);
      editOrderSuccessRate.add(viewDetails2Res.status >= 200 && viewDetails2Res.status < 400);

      const orderEvent2Res = makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView2}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 2)'
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(orderEvent2Res.timings.duration);
      editOrderSuccessRate.add(orderEvent2Res.status >= 200 && orderEvent2Res.status < 400);

      // Skipping image requests
      sleep(2); // Keep the original sleep associated with viewing details 2

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 2 Details' because no order ID was found in the depot-filtered list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(2);
    }

    // Scrolling orders list - Pagination (Page 2, 3, 4, 5, 6 ....)
    for (let i = 1; i < 5; i++) {
      const offset = i * 20;
      const scrollListRes = makeRequest(
        'get',
        `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
        null,
        { headers: createHeaders(authToken) },
        `/admin/orders (List Page ${i + 1}, Scrolling orders list)`
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(scrollListRes.timings.duration);
      editOrderSuccessRate.add(scrollListRes.status >= 200 && scrollListRes.status < 400);

      sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
    }

    // Filter to Edit
    const order_edit = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing for Edit)');
    // Add custom metrics for Orders Edit group
    editOrderRequestCount.add(1);
    editOrderResponseTime.add(order_edit.timings.duration);
    editOrderSuccessRate.add(order_edit.status >= 200 && order_edit.status < 400);

    sleep(0.5);

    let body6 = null;
    let foundProcessingOrderForEdit = false;
    let processingOrderIdForEdit = null;

    // Safely attempt to parse the JSON response for the filter
    try {
      body6 = order_edit.json();
      if (order_edit.status === 200 && body6 && body6.orders && Array.isArray(body6.orders) && body6.orders.length > 0 && body6.orders[0].id) {
        processingOrderIdForEdit = body6.orders[0].id;
        console.log(`VU ${__VU}: Found Processing Order for Edit: ${processingOrderIdForEdit}`);
        foundProcessingOrderForEdit = true;
      } else {
        console.warn(`VU ${__VU}: Processing order filter (for Edit) successful (Status: ${order_edit.status}) but returned no orders or unexpected structure.`);
      }
    } catch (e) {
      console.error(`VU ${__VU}: Failed to parse JSON response for processing orders filter (for Edit). Status: ${order_edit.status}, Body: ${order_edit.body}, Error: ${e.message}`);
    }

    // --- Conditionally View, Prepare, and Edit Order ---
    if (foundProcessingOrderForEdit && processingOrderIdForEdit) {
      console.log(`VU ${__VU}: Proceeding to View/Edit order ${processingOrderIdForEdit} because it was found in the filter.`);

      // View Order to Edit Details - Using the dynamic ID
      const viewOrderResponse = makeRequest(
        'get',
        // Ensure outlet_id is included in fields or implicitly via expand=outlet
        `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Before Edit)'
      );
      // Add custom metrics for Orders Edit group
      editOrderRequestCount.add(1);
      editOrderResponseTime.add(viewOrderResponse.timings.duration);
      editOrderSuccessRate.add(viewOrderResponse.status >= 200 && viewOrderResponse.status < 400);


      let outlet_Id = null; // Variable to store the outlet ID from the response

      // Safely parse the View Order response and extract the outlet ID
      try {
        // ... (Existing code to extract outlet_Id) ...
        if (viewOrderResponse.status === 200) {
          const viewOrderBody = viewOrderResponse.json();
          outlet_Id = viewOrderBody?.order?.outlet_id;
          // ... (logging) ...
        } else { /* ... error logging ... */ }
      } catch (e) { /* ... error logging ... */ }

      // Only proceed with preparation and edit if we successfully got the dynamic Outlet ID
      if (outlet_Id) {
        const orderEventViewBeforeEditRes = makeRequest(
          'get',
          `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`,
          null,
          { headers: createHeaders(authToken) },
          '/admin/order-event (View Before Edit)'
        );
        // Add custom metrics for Orders Edit group
        editOrderRequestCount.add(1);
        editOrderResponseTime.add(orderEventViewBeforeEditRes.timings.duration);
        editOrderSuccessRate.add(orderEventViewBeforeEditRes.status >= 200 && orderEventViewBeforeEditRes.status < 400);

        // Prepare for Edit - Load related data
        const stockLocEditRes = makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Edit)');
        // Add custom metrics for Orders Edit group
        editOrderRequestCount.add(1);
        editOrderResponseTime.add(stockLocEditRes.timings.duration);
        editOrderSuccessRate.add(stockLocEditRes.status >= 200 && stockLocEditRes.status < 400);

        const depotVariantsEditRes = makeRequest(
          'get',
          // Use the extracted outlet_Id here
          `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outlet_Id}&include_empties_deposit=true&limit=20&offset=0&q=&location_id=${LOCATION_ID_EDIT}`, // LOCATION_ID_EDIT is still hardcoded
          null,
          { headers: createHeaders(authToken) },
          '/admin/variants/depot-variants (For Edit)'
        );
        // Add custom metrics for Orders Edit group
        editOrderRequestCount.add(1);
        editOrderResponseTime.add(depotVariantsEditRes.timings.duration);
        editOrderSuccessRate.add(depotVariantsEditRes.status >= 200 && depotVariantsEditRes.status < 400);

        sleep(3); // Existing sleep

        // Perform Edit - Using the dynamic processingOrderIdForEdit
        const editPayload = {
          metadata: { external_doc_number: `editing order` },
          items: [ // Using hardcoded variant IDs
            { variant_id: VARIANT_ID_EDIT_1, quantity: 1, metadata: { item_category: 'YLGA' } },
            { variant_id: VARIANT_ID_EDIT_2, quantity: 8, metadata: { item_category: 'YLGA' } },
            { variant_id: VARIANT_ID_EDIT_3, quantity: 60, metadata: { item_category: 'YLGA' } },
            { variant_id: VARIANT_ID_EDIT_4, quantity: 16, metadata: { item_category: 'YLGA' } },
            { variant_id: VARIANT_ID_EDIT_5, quantity: 1, metadata: { item_category: 'YRLN' } },
            { variant_id: VARIANT_ID_EDIT_6, quantity: 1, metadata: { item_category: 'YVGA' } },
            { variant_id: VARIANT_ID_EDIT_7, quantity: 2, metadata: { item_category: 'YVGA' } },
            { variant_id: VARIANT_ID_EDIT_8, quantity: 3, metadata: { item_category: 'YVGA' } },
            { variant_id: VARIANT_ID_EDIT_9, quantity: 4, metadata: { item_category: 'YVGO' } },
            { variant_id: VARIANT_ID_EDIT_10, quantity: 5, metadata: { item_category: 'YVGA' } }
          ],
          location_id: LOCATION_ID_EDIT, // Still uses hardcoded LOCATION
        };
        // --- Capture the edit response ---
        const editResponse = makeRequest(
          'post',
          `${BASE_URL}/admin/orders/edit/${processingOrderIdForEdit}`,
          editPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          '/admin/orders/edit/{id} (Perform Edit)'
        );
        // Add custom metrics for Orders Edit group
        editOrderRequestCount.add(1);
        editOrderResponseTime.add(editResponse.timings.duration);
        editOrderSuccessRate.add(editResponse.status === 200); // Specific check for edit success

        sleep(3); // Keep sleep immediately after the edit attempt

        // --- Check if the edit was successful (assuming 200 OK indicates success) ---
        const isEditSuccessful = check(editResponse, {
          'Edit Order - status is 200': (r) => r.status === 200,
          // Optional: Add more checks here based on the expected response body for a successful edit
          // 'Edit Order - response contains updated order': (r) => r.json('order.id') === processingOrderIdForEdit,
        });

        // --- Conditionally Refresh counts and view order after edit ---
        if (isEditSuccessful) {
          console.log(`VU ${__VU}: Edit successful for order ${processingOrderIdForEdit}. Proceeding with post-edit checks.`);

          const numReadyAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
          // Add custom metrics for Orders Edit group
          editOrderRequestCount.add(1);
          editOrderResponseTime.add(numReadyAfterEditRes.timings.duration);
          editOrderSuccessRate.add(numReadyAfterEditRes.status >= 200 && numReadyAfterEditRes.status < 400);

          const numNeedReviewAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Edit)');
          // Add custom metrics for Orders Edit group
          editOrderRequestCount.add(1);
          editOrderResponseTime.add(numNeedReviewAfterEditRes.timings.duration);
          editOrderSuccessRate.add(numNeedReviewAfterEditRes.status >= 200 && numNeedReviewAfterEditRes.status < 400);

          const viewAfterEditRes = makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Edit)');
          // Add custom metrics for Orders Edit group
          editOrderRequestCount.add(1);
          editOrderResponseTime.add(viewAfterEditRes.timings.duration);
          editOrderSuccessRate.add(viewAfterEditRes.status >= 200 && viewAfterEditRes.status < 400);

          const orderEventAfterEditRes = makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Edit)');
          // Add custom metrics for Orders Edit group
          editOrderRequestCount.add(1);
          editOrderResponseTime.add(orderEventAfterEditRes.timings.duration);
          editOrderSuccessRate.add(orderEventAfterEditRes.status >= 200 && orderEventAfterEditRes.status < 400);

          sleep(2); // Keep sleep associated with viewing after edit

        } else {
          // Log that the post-edit steps are skipped because the edit failed
          console.warn(`VU ${__VU}: Edit failed for order ${processingOrderIdForEdit} (Status: ${editResponse.status}). Skipping post-edit checks and views.`);
          // Compensate for the skipped sleep if necessary for timing consistency
          sleep(2);
        }
        // --- End Conditional Refresh/View ---

      } else {
        // Log that the preparation and edit steps are skipped because outlet_id wasn't found
        console.warn(`VU ${__VU}: Skipping 'Prepare/Perform Edit' for order ${processingOrderIdForEdit} because its outlet_id could not be determined.`);
        sleep(3 + 3 + 2); // Compensate for sleeps in prepare(3), edit(3), and post-edit(2) blocks
      }

    } else {
      // Log that the entire edit block is being skipped because no processing order was found initially
      console.warn(`VU ${__VU}: Skipping 'Order Edit' sequence because no processing order was found in the filter.`);
      sleep(0.5 + 3 + 3 + 2); // Compensate for sleeps in filter(0.5), prepare(3), edit(3), and post-edit(2) blocks
    }

  });

  // --- Orders Export ---
  group('Orders Export', function () {
    /*
    1. Export Order all Depots and in March 2025
    2. Trigger the export job.
    3. If successful, poll the status using the returned job ID.
    */
    const exportJobPayloadObject = {
      dry_run: false,
      type: 'line-items-orders-export',
      context: {
        list_config: {
          skip: 0,
          take: 100, // Consider if this limit is appropriate or should be larger/parameterized
          order: {
            order_created_at: 'DESC'
          },
          select: [
            'line_item_id', 'order_id', 'order_display_id', 'order_status',
            'order_created_at', 'order_currency_code', 'order_fulfillment_status',
            'order_payment_status', 'order_extended_status', 'order_external_number',
            'order_source_system', 'order_promotion_code', 'order_coupon_code',
            'order_current_invoiced_number', 'order_historical_invoiced_number',
            'address_address_1', 'address_address_2', 'address_country_code',
            'address_city', 'address_postal_code', 'store_depot_name',
            'outlet_outlet_id', 'outlet_outlet_name', 'outlet_external_id',
            'outlet_customer_type', 'outlet_business_organizational_segment',
            'outlet_channels', 'outlet_sub_channels', 'outlet_business_segments',
            'outlet_classifications', 'depot_external_id', 'delivery_date',
            'order_subtotal', 'order_shipping_total', 'order_discount_total',
            'order_gift_card_total', 'order_refunded_total', 'order_tax_total',
            'order_total', 'order_region_id', 'customer_id', 'customer_first_name',
            'customer_last_name', 'customer_email', 'variant_sku', 'product_title',
            'line_item_quantity', 'line_item_total', 'line_item_total_volume',
            'uom', 'product_volume', 'order_external_doc_number', 'order_invoiced_date',
            'brand_name', 'product_pack_size', 'variant_sku_type',
            'geographical_location_region', 'order_invoiced_status',
            'depot_business_unit', 'outlet_sale_area', 'contact_external_id',
            'order_cancellation_reason', 'order_cancellation_reason_others_description'
          ],
          relations: [
            'customer',
            'shipping_address'
          ],
          export_type: 'csv'
        },
        filterable_fields: {
          created_at: {
            // id-qa --30214 line-items,1 min
            gt: '2025-03-01T00:00:00.000Z', // Consider parameterizing dates
            lt: '2025-03-31T23:59:59.999Z'
          }
        }
      }
    };

    // Then stringify it when making the request
    const payloadExportOrders = JSON.stringify(exportJobPayloadObject);

    // --- Trigger the Export Job ---
    const triggerResponse = makeRequest( // Capture the response
      'post',
      `${BASE_URL}/admin/batch-jobs`,
      payloadExportOrders,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/batch-jobs (Trigger Orders Export)'
    );
    // Add custom metrics for Orders Export group
    exportOrderRequestCount.add(1);
    exportOrderResponseTime.add(triggerResponse.timings.duration);
    exportOrderSuccessRate.add(triggerResponse.status === 201); // Specific check for trigger success

    let batchJobId = null; // Variable to hold the ID from the response
    let triggerBody = null;

    // --- Check Trigger Success and Extract ID ---
    try {
      triggerBody = triggerResponse.json(); // Safely attempt to parse JSON
    } catch (e) {
      console.error(`VU ${__VU} - Export Trigger: Failed to parse JSON response. Status: ${triggerResponse.status}, Body: ${triggerResponse.body}, Error: ${e.message}`);
    }

    const triggerCheck = check(triggerResponse, {
      'Export Trigger - status is 201': (r) => r.status === 201, // Expect 201 Created
      'Export Trigger - response has batch_job.id': (r) => triggerBody?.batch_job?.id != null, // Check if ID exists in parsed body
    });

    if (triggerCheck && triggerBody?.batch_job?.id) {
      batchJobId = triggerBody.batch_job.id; // Assign the dynamic ID
      console.log(`VU ${__VU} - Export Job Triggered Successfully. Batch Job ID: ${batchJobId}`);
    } else {
      console.error(`VU ${__VU} - Export Trigger Failed or ID not found! Status: ${triggerResponse.status}, Body: ${triggerResponse.body}`);
      // Optionally, you might want to 'return;' here to stop the rest of the 'Export' group
      // return;
    }

    // --- Poll Batch Job Status (Only if Trigger was successful and ID was obtained) ---
    if (batchJobId) {
      console.log(`VU ${__VU} - Proceeding to poll job ID: ${batchJobId}`);
      sleep(2.0); // Wait a bit before first poll

      // Poll 1: Get list (optional, but kept from original logic)
      const pollList1Res = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Poll List 1)');
      // Add custom metrics for Orders Export group
      exportOrderRequestCount.add(1);
      exportOrderResponseTime.add(pollList1Res.timings.duration);
      exportOrderSuccessRate.add(pollList1Res.status >= 200 && pollList1Res.status < 400);

      sleep(2.0);

      // Poll 2: Check the specific dynamic job ID
      const pollJob1Res = makeRequest(
        'get',
        `${BASE_URL}/admin/batch-jobs/${batchJobId}`, // Use the dynamic ID
        null,
        { headers: createHeaders(authToken) },
        `/admin/batch-jobs/{id} (Poll Job ${batchJobId} - 1)` // Dynamic name
      );
      // Add custom metrics for Orders Export group
      exportOrderRequestCount.add(1);
      exportOrderResponseTime.add(pollJob1Res.timings.duration);
      exportOrderSuccessRate.add(pollJob1Res.status >= 200 && pollJob1Res.status < 400);

      sleep(2.0);

      // Poll 3: Check the specific dynamic job ID again (example)
      const pollJob2Res = makeRequest(
        'get',
        `${BASE_URL}/admin/batch-jobs/${batchJobId}`, // Use the dynamic ID again
        null,
        { headers: createHeaders(authToken) },
        `/admin/batch-jobs/{id} (Poll Job ${batchJobId} - 2)` // Dynamic name
      );
      // Add custom metrics for Orders Export group
      exportOrderRequestCount.add(1);
      exportOrderResponseTime.add(pollJob2Res.timings.duration);
      exportOrderSuccessRate.add(pollJob2Res.status >= 200 && pollJob2Res.status < 400);

      sleep(2.0);

      // Poll 4: Get list again (optional)
      const pollList2Res = makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Poll List 2)');
      // Add custom metrics for Orders Export group
      exportOrderRequestCount.add(1);
      exportOrderResponseTime.add(pollList2Res.timings.duration);
      exportOrderSuccessRate.add(pollList2Res.status >= 200 && pollList2Res.status < 400);

      sleep(3); // Original sleep

      // --- Recommended: Implement proper polling loop ---
      // The above is a direct replacement. A better approach would be:
      /*
      const POLLING_INTERVAL_SECONDS = 5;
      const POLLING_TIMEOUT_SECONDS = 180; // 3 minutes
      const startTime = Date.now();
      let jobStatus = '';
      let jobResultUrl = null; // To store the download URL if completed

      while (Date.now() - startTime < POLLING_TIMEOUT_SECONDS * 1000) {
          const pollRes = makeRequest(
              'get',
              `${BASE_URL}/admin/batch-jobs/${batchJobId}`,
              null,
              { headers: createHeaders(authToken) },
              `/admin/batch-jobs/{id} (Polling Loop ${batchJobId})`
          );
          // Add custom metrics for Orders Export group
          exportOrderRequestCount.add(1);
          exportOrderResponseTime.add(pollRes.timings.duration);
          exportOrderSuccessRate.add(pollRes.status === 200); // Expect 200 for status check

          let pollBody = null;
          try { pollBody = pollRes.json(); } catch(e) {}

          const pollCheck = check(pollRes, {
              'Polling Status is 200': (r) => r.status === 200,
              'Polling Response has status': (r) => pollBody?.batch_job?.status != null
          });

          if (!pollCheck || !pollBody) {
               console.error(`VU ${__VU} - Polling job ${batchJobId} failed! Status: ${pollRes.status}`);
               break; // Exit loop on poll failure
          }

          jobStatus = pollBody.batch_job.status;
          console.log(`VU ${__VU} - Job ${batchJobId} status: ${jobStatus}`);

          if (jobStatus === 'completed') {
              jobResultUrl = pollBody.batch_job?.result?.file_key; // Adjust path if needed
              console.log(`VU ${__VU} - Job ${batchJobId} completed. File key: ${jobResultUrl}`);
              break;
          } else if (jobStatus === 'failed' || jobStatus === 'canceled') {
              console.error(`VU ${__VU} - Job ${batchJobId} ended with status: ${jobStatus}`);
              break; // Exit loop on final status
          }

          sleep(POLLING_INTERVAL_SECONDS);
      }

      if (jobStatus !== 'completed' && jobStatus !== 'failed' && jobStatus !== 'canceled') {
           console.error(`VU ${__VU} - Polling job ${batchJobId} timed out after ${POLLING_TIMEOUT_SECONDS}s.`);
      }

      // --- Optionally Download File ---
      if (jobStatus === 'completed' && jobResultUrl) {
          console.log(`VU ${__VU} - Attempting to get download URL for ${jobResultUrl}`);
          const downloadUrlPayload = { file_key: jobResultUrl };
          const downloadUrlRes = makeRequest(
              'post',
              `${BASE_URL}/admin/uploads/download-url`,
              downloadUrlPayload,
              { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
              '/admin/uploads/download-url (Get Export URL)'
          );
          // Add custom metrics for Orders Export group
          exportOrderRequestCount.add(1);
          exportOrderResponseTime.add(downloadUrlRes.timings.duration);
          exportOrderSuccessRate.add(downloadUrlRes.status === 200); // Expect 200

          let downloadUrlBody = null;
          try { downloadUrlBody = downloadUrlRes.json(); } catch(e) {}

          const downloadUrlCheck = check(downloadUrlRes, {
              'Get Download URL status is 200': (r) => r.status === 200,
              'Get Download URL response has url': (r) => downloadUrlBody?.download_url != null
          });

          if (downloadUrlCheck && downloadUrlBody?.download_url) {
              console.log(`VU ${__VU} - Download URL received: ${downloadUrlBody.download_url}. Downloading...`);
              // Note: k6 doesn't typically *save* the file, but it will perform the GET request
              const downloadRes = makeRequest(
                  'get',
                  downloadUrlBody.download_url, // Use the actual URL from the response
                  null,
                  { headers: {} }, // No auth needed for Azure Blob URL usually
                  'Download Exported File'
              );
              // Add custom metrics for Orders Export group
              exportOrderRequestCount.add(1);
              exportOrderResponseTime.add(downloadRes.timings.duration);
              exportOrderSuccessRate.add(downloadRes.status === 200); // Expect 200 for successful download

              check(downloadRes, { 'Download status is 200': (r) => r.status === 200 });
          } else {
              console.error(`VU ${__VU} - Failed to get download URL. Status: ${downloadUrlRes.status}, Body: ${downloadUrlRes.body}`);
          }
          sleep(1); // Add a small sleep after download attempt
      }
      */
      // --- End Recommended Polling Loop & Download ---

    } else {
      console.warn(`VU ${__VU} - Skipping polling because Export Trigger failed or did not return a valid Batch Job ID.`);
      // Add sleeps here if you need to maintain similar timing even when skipping polling
      sleep(2.0 + 2.0 + 2.0 + 2.0 + 5.3); // Sum of original sleeps
    }
  });


  // --- Promotions ---
  // group('Promotions', function () {
  //   makeRequest('get', `${BASE_URL}/admin/promotions/info`, null, { headers: createHeaders(authToken) }, '/admin/promotions/info');
  //   makeRequest(
  //     'get',
  //     `${BASE_URL}/admin/promotions/promotion-allocations?offset=0&limit=20&start_after=2025-03-01T00:00:00.000Z&end_before=2025-06-01T23:59:59.999Z`,
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/promotions/promotion-allocations'
  //   );
  //   sleep(2.2);
  // });

  // --- Performance (Overall) ---
  // group('Performance - Overall', function () {
  //   const start = "2025-03-25T00:00:00.000Z"; // Consider making dynamic
  //   const end = "2025-04-25T23:59:59.999Z";   // Consider making dynamic
  //   const startYear = "2025-01-01T00:00:00.000Z";
  //   const endYear = "2025-04-30T23:59:59.999Z";

  //   makeRequest('get', `${BASE_URL}/admin/performance/chart-settings?depot_id=null&distributor_id=null`, null, { headers: createHeaders(authToken) }, '/admin/performance/chart-settings');
  //   makeRequest('get', `${BASE_URL}/admin/performance/sales-volume-information?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/sales-volume-information');
  //   makeRequest('get', `${BASE_URL}/admin/performance/sales-case-fill-rate?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/sales-case-fill-rate');
  //   makeRequest('get', `${BASE_URL}/admin/performance/transaction-capture?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/transaction-capture');
  //   makeRequest('get', `${BASE_URL}/admin/performance/distribution-transaction-capture-and-call-compliance?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/distribution-transaction-capture-and-call-compliance');
  //   makeRequest('get', `${BASE_URL}/admin/performance/order-sla?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/order-sla');
  //   makeRequest('get', `${BASE_URL}/admin/performance/chart-aso`, null, { headers: createHeaders(authToken) }, '/admin/performance/chart-aso');
  //   makeRequest('get', `${BASE_URL}/admin/performance/call-effectiveness?start=${start}&end=${end}`, null, { headers: createHeaders(authToken) }, '/admin/performance/call-effectiveness');
  //   sleep(1.4);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Performance Page)');
  //   sleep(12.8); // Long sleep

  //   // Change Date Range
  //   makeRequest('get', `${BASE_URL}/admin/performance/sales-volume-information?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/sales-volume-information (Year)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/sales-case-fill-rate?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/sales-case-fill-rate (Year)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/transaction-capture?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/transaction-capture (Year)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/distribution-transaction-capture-and-call-compliance?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/distribution-transaction-capture-and-call-compliance (Year)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/order-sla?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/order-sla (Year)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/call-effectiveness?start=${startYear}&end=${endYear}`, null, { headers: createHeaders(authToken) }, '/admin/performance/call-effectiveness (Year)');
  //   sleep(7.6);
  // });

  // --- Performance (Execution) ---
  // group('Performance - Execution', function () {
  //   const startYear = "2025-01-01T00:00:00.000Z";
  //   const endYear = "2025-04-30T23:59:59.999Z";

  //   // Select Depot 1
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 1)');
  //   sleep(6.7);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Performance Exec Page)');
  //   sleep(2.9);

  //   // Select Depot 2
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_2}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 2)');
  //   sleep(7.3);

  //   // Select Depot 3
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_3}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 3)');
  //   sleep(9.2);

  //   // Select Depot 3 + Sales Rep 1
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_FILTER}&sales_rep_ids=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 3, Rep 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 3, Rep 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 3, Rep 1)');
  //   sleep(9.9);

  //   // Select Depot 3 + Sales Rep 2
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_FILTER}&sales_rep_ids=${SALES_REP_ID_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 3, Rep 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 3, Rep 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 3, Rep 2)');
  //   sleep(5.4);
  // });

  // --- Inventory ---
  // group('Inventory', function () {
  //   makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=20`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (Inventory Page)');

  //   // Get Inventory Data for Depot 1
  //   const depot1Payload = { depot_id: DEPOT_ID_INVENTORY_1 };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/inventory/get-stock-overview`,
  //     depot1Payload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/inventory/get-stock-overview (Depot 1)'
  //   );
  //   makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_INVENTORY_1}&offset=0&limit=20`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (Depot 1)');
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/inventory/focus-of-the-day`,
  //     depot1Payload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/inventory/focus-of-the-day (Depot 1)'
  //   );

  //   const inventoryLevelsPayload = {
  //       offset: 0, limit: 20, stock_level: "in_stock",
  //       include_stock_level: true, include_history_incoming: true,
  //       depot_id: DEPOT_ID_INVENTORY_1
  //   };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/inventory/inventory-levels`,
  //     inventoryLevelsPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/inventory/inventory-levels (Depot 1)'
  //   );

  //   const pendingSentPayload = { depot_id: DEPOT_ID_INVENTORY_1, type: "stock_sent" };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/inventory-transfer-request/get-total-of-pendings`,
  //     pendingSentPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/inventory-transfer-request/get-total-of-pendings (Sent, Depot 1)'
  //   );

  //   const pendingReceivedPayload = { depot_id: DEPOT_ID_INVENTORY_1, type: "stock_received" };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/inventory-transfer-request/get-total-of-pendings`,
  //     pendingReceivedPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/inventory-transfer-request/get-total-of-pendings (Received, Depot 1)'
  //   );
  //   sleep(7.1);
  // });

  // --- Logout ---
  group('Logout', function () {
    // Perform the actual logout action
    const checkLogoutResponse = makeRequest(
      'del', // Use DELETE method for logout
      `${BASE_URL}/admin/auth`,
      null, // No body for DELETE
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) }, // Pass token
      '/admin/auth - DELETE (Logout)'
    );

    // Optionally, verify logout by trying to access a protected resource
    // const checkLogoutResponse = makeRequest(
    //     'get',
    //     `${BASE_URL}/admin/auth`, // Try getting user info again
    //     null,
    //     { headers: createHeaders(authToken) }, // Use the (now potentially invalid) token
    //     '/admin/auth - GET (Verify Logout)'
    // );

    // Expecting a 401 Unauthorized or similar error
    check(checkLogoutResponse, {
      'Logout verification returns 200': (r) => r.status === 200,
    });
    sleep(1.1);
  });
}

// Reports: HTML + Console + CSV
export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
  const reportName = `./summary_report${timestamp}.html`;
  return {
    [reportName]: htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
