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

// --- k6 Options ---
export const options = {
  cloud: {
    // projectID: 3709931, // Uncomment and set your Project ID if using k6 Cloud
    distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
    apm: [],
  },
  thresholds: {
    // Define performance goals (SLOs/SLAs)
    // Example: 95% of requests should complete within 800ms
    'request_duration{name:/admin/auth}': ['p(95)<2000'], // Login specific
    'request_duration{group:::Orders Create}': ['p(95)<2000'], // All requests in Orders Create
    'request_duration{group:::Orders Update}': ['p(95)<2000'], // All requests in Orders Update
    'request_duration{group:::Orders Edit}': ['p(95)<2000'], // All requests in Orders Edit
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
    //   startVUs: 5,
    //   stages: [
    //     { duration: '2m', target: 20 }, // Ramp up to 20 VUs over 2 minutes
    //     { duration: '5m', target: 2000 }, // Stay at 20 VUs for 5 minutes
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

  // // --- Orders Update ---
  // group('Orders Update', function () {
  //   // Initial data loading for Orders page - All Depots
  //   makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken) }, '/admin/depots/current-user');
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Initial)');
  //   makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken) }, '/admin/store/');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review');

  //   // Get initial order list (orders page)
  //   const initialListResponse = makeRequest( // Assign response to a variable
  //     'get',
  //     `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/orders (List orders page)'
  //   );
  //   sleep(1);

  //   let orderIdView1 = null; // Variable to store the dynamically found ID
  //   let foundFirstOrder = false;    // Flag to indicate if we found an order

  //   // Safely attempt to parse the initial list response and extract the first ID
  //   try {
  //     if (initialListResponse.status === 200) {
  //       const initialListBody = initialListResponse.json();
  //       // Check if 'orders' array exists, is not empty, and the first element has an 'id'
  //       if (initialListBody && initialListBody.orders && Array.isArray(initialListBody.orders) && initialListBody.orders.length > 0 && initialListBody.orders[0].id) {
  //         orderIdView1 = initialListBody.orders[0].id; // Extract the ID
  //         foundFirstOrder = true;
  //         console.log(`VU ${__VU}: Found first order ID from list: ${orderIdView1}`);
  //       } else {
  //         console.warn(`VU ${__VU}: Initial order list request successful (Status: ${initialListResponse.status}) but returned no orders or unexpected structure.`);
  //       }
  //     } else {
  //       console.error(`VU ${__VU}: Failed to get initial order list. Status: ${initialListResponse.status}`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for initial order list. Status: ${initialListResponse.status}, Body: ${initialListResponse.body}, Error: ${e.message}`);
  //   }

  //   // --- Conditionally View Order 1 Details ---
  //   // Only proceed if we successfully found an order ID from the list
  //   if (foundFirstOrder && orderIdView1) {
  //     console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView1}`);

  //     // View Order 1 Details - Using the dynamically found ID
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders/${orderIdView1}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Details 1)'
  //     );
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/order-event?order_id=${orderIdView1}`, // Use dynamic ID
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/order-event (View Details 1)'
  //     );
  //     // Skipping image requests for brevity and focus on API calls
  //     sleep(1);

  //   } else {
  //     // Log that the detail view is being skipped
  //     console.warn(`VU ${__VU}: Skipping 'View Order 1 Details' because no order ID was found in the initial list or the list request failed.`);
  //     // Compensate for the skipped sleep if necessary for timing consistency
  //     sleep(1);
  //   }

  //   // Select Depot
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');

  //   // Fetch the actual list of the first 20 orders, filtered by the selected depot
  //   const depotFilteredListResponse = makeRequest( // Assign response to a variable
  //     'get',
  //     `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/orders (List orders page, Select Depot)'
  //   );
  //   sleep(0.5);

  //   let orderIdView2 = null; // Variable to store the dynamically found ID for view 2
  //   let foundSecondOrder = false;   // Flag to indicate if we found an order in this list

  //   // Safely attempt to parse the depot-filtered list response and extract the first ID
  //   try {
  //     if (depotFilteredListResponse.status === 200) {
  //       const depotFilteredListBody = depotFilteredListResponse.json();
  //       // Check if 'orders' array exists, is not empty, and the first element has an 'id'
  //       if (depotFilteredListBody && depotFilteredListBody.orders && Array.isArray(depotFilteredListBody.orders) && depotFilteredListBody.orders.length > 0 && depotFilteredListBody.orders[0].id) {
  //         orderIdView2 = depotFilteredListBody.orders[0].id; // Extract the ID
  //         foundSecondOrder = true;
  //         console.log(`VU ${__VU}: Found first order ID from depot-filtered list: ${orderIdView2}`);
  //       } else {
  //         console.warn(`VU ${__VU}: Depot-filtered order list request successful (Status: ${depotFilteredListResponse.status}) but returned no orders or unexpected structure.`);
  //       }
  //     } else {
  //       console.error(`VU ${__VU}: Failed to get depot-filtered order list. Status: ${depotFilteredListResponse.status}`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for depot-filtered order list. Status: ${depotFilteredListResponse.status}, Body: ${depotFilteredListResponse.body}, Error: ${e.message}`);
  //   }

  //   // --- Conditionally View Order 2 Details ---
  //   // Only proceed if we successfully found an order ID from the depot-filtered list
  //   if (foundSecondOrder && orderIdView2) {
  //     console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView2}`);

  //     // View Order 2 Details - Using the dynamically found ID
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders/${orderIdView2}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Details 2)'
  //     );
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/order-event?order_id=${orderIdView2}`, // Use dynamic ID
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/order-event (View Details 2)'
  //     );
  //     // Skipping image requests
  //     sleep(2); // Keep the original sleep associated with viewing details 2

  //   } else {
  //     // Log that the detail view is being skipped
  //     console.warn(`VU ${__VU}: Skipping 'View Order 2 Details' because no order ID was found in the depot-filtered list or the list request failed.`);
  //     // Compensate for the skipped sleep if necessary for timing consistency
  //     sleep(2);
  //   }

  //   // Scrolling orders list - Pagination (Page 2, 3, 4, 5, 6 ....)
  //   for (let i = 1; i < 5; i++) {
  //     const offset = i * 20;
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       `/admin/orders (List Page ${i + 1}, Scrolling orders list)`
  //     );
  //     sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
  //   }

  //   // Filter to Edit
  //   const order_edit = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing for Edit)');
  //   sleep(0.5);

  //   let body6 = null;
  //   let foundProcessingOrderForEdit = false;
  //   let processingOrderIdForEdit = null;

  //   // Safely attempt to parse the JSON response for the filter
  //   try {
  //     body6 = order_edit.json();
  //     if (order_edit.status === 200 && body6 && body6.orders && Array.isArray(body6.orders) && body6.orders.length > 0 && body6.orders[0].id) {
  //       processingOrderIdForEdit = body6.orders[0].id;
  //       console.log(`VU ${__VU}: Found Processing Order for Edit: ${processingOrderIdForEdit}`);
  //       foundProcessingOrderForEdit = true;
  //     } else {
  //       console.warn(`VU ${__VU}: Processing order filter (for Edit) successful (Status: ${order_edit.status}) but returned no orders or unexpected structure.`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for processing orders filter (for Edit). Status: ${order_edit.status}, Body: ${order_edit.body}, Error: ${e.message}`);
  //   }

  //   // --- Conditionally View, Prepare, and Edit Order ---
  //   if (foundProcessingOrderForEdit && processingOrderIdForEdit) {
  //     console.log(`VU ${__VU}: Proceeding to View/Edit order ${processingOrderIdForEdit} because it was found in the filter.`);

  //     // View Order to Edit Details - Using the dynamic ID
  //     const viewOrderResponse = makeRequest( // Assign response to a variable
  //       'get',
  //       // Ensure outlet_id is included in fields or implicitly via expand=outlet
  //       `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Before Edit)'
  //     );

  //     let outlet_Id = null; // Variable to store the outlet ID from the response

  //     // Safely parse the View Order response and extract the outlet ID
  //     try {
  //       if (viewOrderResponse.status === 200) {
  //         const viewOrderBody = viewOrderResponse.json();
  //         // Adjust the path based on your actual API response structure
  //         // Common possibilities: viewOrderBody.order.outlet_id or viewOrderBody.order.outlet.id
  //         outlet_Id = viewOrderBody?.order?.outlet_id;

  //         if (outlet_Id) {
  //           console.log(`VU ${__VU}: Extracted dynamic Outlet ID: ${outlet_Id} for order ${processingOrderIdForEdit}`);
  //         } else {
  //           console.warn(`VU ${__VU}: Could not extract outlet_id from View Order response for order ${processingOrderIdForEdit}. Response body: ${viewOrderResponse.body}`);
  //         }
  //       } else {
  //         console.error(`VU ${__VU}: Failed to view order details for ${processingOrderIdForEdit}. Status: ${viewOrderResponse.status}`);
  //       }
  //     } catch (e) {
  //       console.error(`VU ${__VU}: Failed to parse JSON response for View Order details (Order ${processingOrderIdForEdit}): ${e.message}. Body: ${viewOrderResponse.body}`);
  //     }

  //     // Only proceed with preparation and edit if we successfully got the dynamic Outlet ID
  //     if (outlet_Id) {
  //       makeRequest(
  //         'get',
  //         `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`,
  //         null,
  //         { headers: createHeaders(authToken) },
  //         '/admin/order-event (View Before Edit)'
  //       );

  //       // Prepare for Edit - Load related data
  //       makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Edit)');
  //       makeRequest(
  //         'get',
  //         // Use the extracted outlet_Id here
  //         `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outlet_Id}&include_empties_deposit=true&limit=20&offset=0&q=&location_id=${LOCATION_ID_EDIT}`, // LOCATION_ID_EDIT is still hardcoded
  //         null,
  //         { headers: createHeaders(authToken) },
  //         '/admin/variants/depot-variants (For Edit)'
  //       );
  //       sleep(3);

  //       // Perform Edit - Using the dynamic processingOrderIdForEdit
  //       const editPayload = {
  //         metadata: { external_doc_number: `editing order ${processingOrderIdForEdit}` },
  //         items: [ // Using hardcoded variant IDs
  //           { variant_id: VARIANT_ID_EDIT_1, quantity: 1, metadata: { item_category: 'YLGA' } },
  //           { variant_id: VARIANT_ID_EDIT_2, quantity: 8, metadata: { item_category: 'YLGA' } },
  //           { variant_id: VARIANT_ID_EDIT_3, quantity: 60, metadata: { item_category: 'YLGA' } },
  //           { variant_id: VARIANT_ID_EDIT_4, quantity: 16, metadata: { item_category: 'YLGA' } },
  //           { variant_id: VARIANT_ID_EDIT_5, quantity: 1, metadata: { item_category: 'YRLN' } },
  //           { variant_id: VARIANT_ID_EDIT_6, quantity: 1, metadata: { item_category: 'YVGA' } },
  //           { variant_id: VARIANT_ID_EDIT_7, quantity: 2, metadata: { item_category: 'YVGA' } },
  //           { variant_id: VARIANT_ID_EDIT_8, quantity: 3, metadata: { item_category: 'YVGA' } },
  //           { variant_id: VARIANT_ID_EDIT_9, quantity: 4, metadata: { item_category: 'YVGO' } },
  //           { variant_id: VARIANT_ID_EDIT_10, quantity: 5, metadata: { item_category: 'YVGA' } }
  //         ],
  //         location_id: LOCATION_ID_EDIT, // Still uses hardcoded LOCATION
  //       };
  //       makeRequest(
  //         'post',
  //         `${BASE_URL}/admin/orders/edit/${processingOrderIdForEdit}`,
  //         editPayload,
  //         { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //         '/admin/orders/edit/{id} (Perform Edit)'
  //       );
  //       sleep(3);

  //       // Refresh counts and view order after edit - Using the dynamic processingOrderIdForEdit
  //       makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
  //       makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Edit)');
  //       makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Edit)');
  //       makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Edit)');
  //       sleep(2);

  //     } else {
  //       // Log that the preparation and edit steps are skipped because outlet_id wasn't found
  //       console.warn(`VU ${__VU}: Skipping 'Prepare/Perform Edit' for order ${processingOrderIdForEdit} because its outlet_id could not be determined.`);
  //       // Compensate for skipped sleeps if needed
  //       sleep(3);
  //     }

  //   } else {
  //     // Log that the entire edit block is being skipped because no processing order was found initially
  //     console.warn(`VU ${__VU}: Skipping 'Order Edit' sequence because no processing order was found in the filter.`);
  //     // Compensate for the skipped sleeps if necessary for timing consistency
  //     sleep(3);
  //   }

  //   // --- Search Orders by number --- 

  //   const search_numeric = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&q=12345`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search 12345)');

  //   let search_number = null; // Declare search_number variable
  //   let body4 = null;

  //   // Safely attempt to parse the JSON response
  //   try {
  //     body4 = search_numeric.json();
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for order search '12345'. Status: ${search_numeric.status}, Error: ${e.message}`);
  //     // Decide how to handle parse failure - maybe return or fail the iteration
  //     // return; // Example: Stop this iteration if JSON parsing fails
  //   }

  //   // Check if the search request was successful (e.g., status 200) AND
  //   // if the response body was parsed AND
  //   // if the 'orders' array exists, is not empty, and the first element has an 'id'
  //   if (search_numeric.status === 200 && body4 && body4.orders && body4.orders.length > 0 && body4.orders[0].id) {
  //     search_number = body4.orders[0].id; // Assign the found order ID
  //     console.log(`VU ${__VU}: Processing Order found by search: ${search_number}`);
  //     sleep(0.5);

  //     // Now, make the request to view the details of the found order
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders/${search_number}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Search Result by number)'
  //     );

  //   } else {
  //     // Log a warning if the search failed or returned no results
  //     console.warn(`VU ${__VU}: Order search for '12345' failed (Status: ${search_numeric.status}) or returned no results. Skipping detail view.`);
  //     // Optionally, you could fail the iteration here if finding an order is critical
  //     // fail('Order search returned no results, cannot proceed.');
  //   }
  //   sleep(0.5);

  //   // Clear search, go back to default list
  //   makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders (List After CLear Search1)');
  //   sleep(1);

  //   // Search Orders by Free Text
  //   const search_text = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&q=OMS`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search OMS)');

  //   let search_freeText = null; // Declare search_freeText variable
  //   let body5 = null;

  //   // Safely attempt to parse the JSON response
  //   try {
  //     body5 = search_text.json();
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for order search 'OMS'. Status: ${search_text.status}, Error: ${e.message}`);
  //     // Decide how to handle parse failure - maybe return or fail the iteration
  //     // return; // Example: Stop this iteration if JSON parsing fails
  //   }

  //   // Check if the search request was successful (e.g., status 200) AND
  //   // if the response body was parsed AND
  //   // if the 'orders' array exists, is not empty, and the first element has an 'id'
  //   if (search_text.status === 200 && body5 && body5.orders && body5.orders.length > 0 && body5.orders[0].id) {
  //     search_freeText = body5.orders[0].id; // Assign the found order ID
  //     console.log(`VU ${__VU}: Processing Order found by search: ${search_freeText}`);
  //     sleep(0.5);

  //     // Now, make the request to view the details of the found order
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders/${search_freeText}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Search Result by number)'
  //     );

  //   } else {
  //     // Log a warning if the search failed or returned no results
  //     console.warn(`VU ${__VU}: Order search for 'OMS' failed (Status: ${search_text.status}) or returned no results. Skipping detail view.`);
  //     // Optionally, you could fail the iteration here if finding an order is critical
  //     // fail('Order search returned no results, cannot proceed.');
  //   }
  //   sleep(0.5);

  //   // Clear search, go back to default list
  //   makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders (List After CLear Search2)');
  //   sleep(1);

  //   // Filter by Status: Pending
  //   const status_pending = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=pending`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Pending)');
  //   sleep(0.5);

  //   let body1 = null;
  //   let foundPendingOrder = false;
  //   let pendingOrderId = null; // Variable to store the found pending order ID

  //   // Safely attempt to parse the JSON response
  //   try {
  //     body1 = status_pending.json();
  //     // Check if the request was successful AND the response body was parsed AND 'orders' array exists and is not empty
  //     if (status_pending.status === 200 && body1 && body1.orders && Array.isArray(body1.orders) && body1.orders.length > 0 && body1.orders[0].id) {
  //       pendingOrderId = body1.orders[0].id; // Store the first pending order ID
  //       console.log(`VU ${__VU}: Found Pending Order: ${pendingOrderId}`);
  //       foundPendingOrder = true;
  //     } else {
  //       console.warn(`VU ${__VU}: Pending order filter request successful (Status: ${status_pending.status}) but returned no orders or unexpected structure.`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for pending orders filter. Status: ${status_pending.status}, Body: ${status_pending.body}, Error: ${e.message}`);
  //     // body1 remains null, foundPendingOrder remains false, pendingOrderId remains null
  //   }

  //   // --- Conditionally Mark Order for Status Updates as Processing ---
  //   // Only proceed if the pending filter was successful and returned at least one order ID
  //   if (foundPendingOrder && pendingOrderId) { // Ensure we have the ID
  //     console.log(`VU ${__VU}: Proceeding to mark order ${pendingOrderId} as processing because it was found in the pending filter.`);

  //     // Mark the *found* Pending Order as Processing
  //     makeRequest('get', `${BASE_URL}/admin/orders/${pendingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Status Updates)'); // Adjusted expand slightly
  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${pendingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Status Updates)');
  //     sleep(0.5); // Optional short sleep before action

  //     makeRequest(
  //       'post',
  //       `${BASE_URL}/admin/orders/${pendingOrderId}`, // Use the dynamically found ID
  //       { is_processing: true },
  //       { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //       '/admin/orders/{id} (Mark Processing for Status Updates)'
  //     );
  //     sleep(0.5); // Optional short sleep after action

  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${pendingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Mark Processing)');
  //     sleep(1); // Original sleep duration

  //   } else {
  //     // Log that the block is being skipped
  //     // Kept the original log message for context, but it could be simplified.
  //     console.warn(`VU ${__VU}: Skipping 'Mark Processing for Status Updates' block because no pending orders were successfully found or filter failed.`);
  //     // You might want to add a sleep here to compensate for the skipped block's duration
  //     sleep(3);
  //   }

  //   // Filter by Status: Processing

  //   const status_processing = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing)');
  //   sleep(0.5);

  //   let body2 = null;
  //   let foundProcessingOrder = false;
  //   let processingOrderId = null; // Variable to store the found processing order ID

  //   // Safely attempt to parse the JSON response
  //   try {
  //     body2 = status_processing.json();
  //     // Check if the request was successful AND the response body was parsed AND 'orders' array exists and is not empty
  //     // Note: Corrected the HTML entity '&gt;' to '>'
  //     if (status_processing.status === 200 && body2 && body2.orders && Array.isArray(body2.orders) && body2.orders.length > 0 && body2.orders[0].id) {
  //       processingOrderId = body2.orders[0].id; // Store the first processing order ID
  //       console.log(`VU ${__VU}: Found Processing Order: ${processingOrderId}`);
  //       foundProcessingOrder = true;
  //     } else {
  //       console.warn(`VU ${__VU}: Processing order filter request successful (Status: ${status_processing.status}) but returned no orders or unexpected structure.`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for processing orders filter. Status: ${status_processing.status}, Body: ${status_processing.body}, Error: ${e.message}`);
  //     // body2 remains null, foundProcessingOrder remains false, processingOrderId remains null
  //   }

  //   // --- Conditionally Check Inventory, Credit, Promotion AND Update Status ---
  //   // Only proceed if the processing filter was successful and returned at least one order ID
  //   if (foundProcessingOrder && processingOrderId) { // Ensure we have the ID
  //     console.log(`VU ${__VU}: Proceeding to check inventory, credit, promotion, and update status for order ${processingOrderId} because it was found in the processing filter.`);

  //     // Check Inventory and Credit and Promotion using the dynamically found processingOrderId
  //     // ... (Inventory, Credit, Promotion checks remain the same) ...
  //     makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderId}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Inv/Credit/Promo Check)');
  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Inv/Credit/Promo Check)');
  //     sleep(1);

  //     makeRequest('post', `${BASE_URL}/admin/orders/inventory-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/inventory-checked/{id}');
  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Inv Check)');
  //     sleep(1);

  //     makeRequest('post', `${BASE_URL}/admin/orders/credit-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/credit-checked/{id}');
  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Credit Check)');
  //     makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Credit Check)');
  //     makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Credit Check)');
  //     sleep(1);

  //     makeRequest('post', `${BASE_URL}/admin/orders/promotion-checked/${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/orders/promotion-checked/{id}');
  //     makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Promotion Check)');
  //     makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Promotion Check)');
  //     makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Promotion Check)');
  //     sleep(1);
  //     // --- End of Inventory/Credit/Promotion Checks ---

  //     // --- Status Updates (Now conditional on finding the processing order AND previous step success) ---
  //     let isPreviousStatusUpdateSuccessful = true; // Start assuming checks passed
  //     let targetStatus = ''; // To hold the status we are trying to update to

  //     // --- Update Status: Ready for Delivery ---
  //     if (isPreviousStatusUpdateSuccessful) {
  //       targetStatus = "ready_for_delivery";
  //       console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
  //       const readyPayload = {
  //         order_ids: [processingOrderId],
  //         status: targetStatus,
  //         expected_delivery_date: "2025-04-26T02:31:33.058Z", // Consider dynamic date
  //         term_of_payments: "current_credit_terms"
  //       };
  //       const resReady = makeRequest(
  //         'post',
  //         `${BASE_URL}/admin/order-extend-status/update`,
  //         readyPayload,
  //         { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //         `/admin/order-extend-status/update (${targetStatus})`
  //       );

  //       // --- Perform Detailed Check ---
  //       isPreviousStatusUpdateSuccessful = false; // Assume failure unless checks pass
  //       let updateBody = null;
  //       let apiErrorMsg = null;

  //       try { updateBody = resReady.json(); } catch (e) {
  //         console.error(`VU ${__VU}: Failed to parse JSON response for '${targetStatus}' update (Order ${processingOrderId}): ${e.message}. Body: ${resReady.body}`);
  //       }

  //       if (updateBody && updateBody.errors && Array.isArray(updateBody.errors) && updateBody.errors.length > 0) {
  //         apiErrorMsg = updateBody.errors[0]?.error?.message || JSON.stringify(updateBody.errors); // Get specific message if possible
  //         console.error(`VU ${__VU}: API Error updating order ${processingOrderId} to '${targetStatus}': ${apiErrorMsg}`);
  //       } else if (resReady.status === 201 && updateBody?.saved?.[0]) {
  //         const savedOrder = updateBody.saved[0];
  //         if (savedOrder.id === processingOrderId && savedOrder.extended_status === targetStatus) {
  //           console.log(`VU ${__VU}: Successfully verified update to '${targetStatus}' for order ${processingOrderId}`);
  //           isPreviousStatusUpdateSuccessful = true; // Mark as successful
  //         } else {
  //           console.warn(`VU ${__VU}: Update to '${targetStatus}' for order ${processingOrderId} response mismatch. Expected ID '${processingOrderId}', Status '${targetStatus}'. Got ID '${savedOrder.id}', Status '${savedOrder.extended_status}'.`);
  //         }
  //       } else {
  //         console.error(`VU ${__VU}: Unexpected response or structure for '${targetStatus}' update (Order ${processingOrderId}). Status: ${resReady.status}, Body: ${resReady.body}`);
  //       }
  //       // --- End Detailed Check ---

  //       // Add specific check result based on detailed validation
  //       check(resReady, {
  //         [`Update to ${targetStatus} - Verified Success`]: () => isPreviousStatusUpdateSuccessful,
  //       });

  //       if (isPreviousStatusUpdateSuccessful) {
  //         makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
  //         sleep(1);
  //         makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, `/admin/batch-jobs (After ${targetStatus})`);
  //         sleep(1);
  //       } else {
  //         console.warn(`VU ${__VU}: Halting status updates for order ${processingOrderId} after failure at '${targetStatus}'.`);
  //         // Optionally add a sleep here if needed when halting
  //         sleep(3);
  //       }
  //     } // End if (isPreviousStatusUpdateSuccessful) for Ready

  //     // --- Update Status: Shipped ---
  //     if (isPreviousStatusUpdateSuccessful) {
  //       targetStatus = "shipped";
  //       console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
  //       const shippedPayload = { order_ids: [processingOrderId], status: targetStatus };
  //       const resShipped = makeRequest(
  //         'post',
  //         `${BASE_URL}/admin/order-extend-status/update`,
  //         shippedPayload,
  //         { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //         `/admin/order-extend-status/update (${targetStatus})`
  //       );

  //       // --- Perform Detailed Check ---
  //       isPreviousStatusUpdateSuccessful = false; // Assume failure
  //       let updateBody = null;
  //       let apiErrorMsg = null;

  //       try { updateBody = resShipped.json(); } catch (e) {
  //         console.error(`VU ${__VU}: Failed to parse JSON response for '${targetStatus}' update (Order ${processingOrderId}): ${e.message}. Body: ${resShipped.body}`);
  //       }

  //       if (updateBody && updateBody.errors && Array.isArray(updateBody.errors) && updateBody.errors.length > 0) {
  //         apiErrorMsg = updateBody.errors[0]?.error?.message || JSON.stringify(updateBody.errors);
  //         console.error(`VU ${__VU}: API Error updating order ${processingOrderId} to '${targetStatus}': ${apiErrorMsg}`);
  //       } else if (resShipped.status === 201 && updateBody?.saved?.[0]) {
  //         const savedOrder = updateBody.saved[0];
  //         if (savedOrder.id === processingOrderId && savedOrder.extended_status === targetStatus) {
  //           console.log(`VU ${__VU}: Successfully verified update to '${targetStatus}' for order ${processingOrderId}`);
  //           isPreviousStatusUpdateSuccessful = true; // Mark as successful
  //         } else {
  //           console.warn(`VU ${__VU}: Update to '${targetStatus}' for order ${processingOrderId} response mismatch. Expected ID '${processingOrderId}', Status '${targetStatus}'. Got ID '${savedOrder.id}', Status '${savedOrder.extended_status}'.`);
  //         }
  //       } else {
  //         console.error(`VU ${__VU}: Unexpected response or structure for '${targetStatus}' update (Order ${processingOrderId}). Status: ${resShipped.status}, Body: ${resShipped.body}`);
  //       }
  //       // --- End Detailed Check ---

  //       check(resShipped, {
  //         [`Update to ${targetStatus} - Verified Success (201, no errors, saved status match)`]: () => isPreviousStatusUpdateSuccessful,
  //       });

  //       if (isPreviousStatusUpdateSuccessful) {
  //         makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
  //         sleep(1);
  //       } else {
  //         console.warn(`VU ${__VU}: Halting status updates for order ${processingOrderId} after failure at '${targetStatus}'.`);
  //         // sleep(2.8);
  //       }
  //     } else {
  //       console.warn(`VU ${__VU}: Skipping update to 'shipped' for order ${processingOrderId} due to previous failure.`);
  //       sleep(1); // Compensate for skipped sleep if needed
  //     } // End if (isPreviousStatusUpdateSuccessful) for Shipped

  //     // --- Update Status: Delivered ---
  //     if (isPreviousStatusUpdateSuccessful) {
  //       targetStatus = "delivered";
  //       console.log(`VU ${__VU}: Attempting update to '${targetStatus}' for order ${processingOrderId}`);
  //       const deliveredPayload = { order_ids: [processingOrderId], status: targetStatus };
  //       const resDelivered = makeRequest(
  //         'post',
  //         `${BASE_URL}/admin/order-extend-status/update`,
  //         deliveredPayload,
  //         { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //         `/admin/order-extend-status/update (${targetStatus})`
  //       );

  //       // --- Perform Detailed Check ---
  //       isPreviousStatusUpdateSuccessful = false; // Assume failure
  //       let updateBody = null;
  //       let apiErrorMsg = null;

  //       try { updateBody = resDelivered.json(); } catch (e) {
  //         console.error(`VU ${__VU}: Failed to parse JSON response for '${targetStatus}' update (Order ${processingOrderId}): ${e.message}. Body: ${resDelivered.body}`);
  //       }

  //       if (updateBody && updateBody.errors && Array.isArray(updateBody.errors) && updateBody.errors.length > 0) {
  //         apiErrorMsg = updateBody.errors[0]?.error?.message || JSON.stringify(updateBody.errors);
  //         console.error(`VU ${__VU}: API Error updating order ${processingOrderId} to '${targetStatus}': ${apiErrorMsg}`);
  //       } else if (resDelivered.status === 201 && updateBody?.saved?.[0]) {
  //         const savedOrder = updateBody.saved[0];
  //         if (savedOrder.id === processingOrderId && savedOrder.extended_status === targetStatus) {
  //           console.log(`VU ${__VU}: Successfully verified update to '${targetStatus}' for order ${processingOrderId}`);
  //           isPreviousStatusUpdateSuccessful = true; // Mark as successful
  //         } else {
  //           console.warn(`VU ${__VU}: Update to '${targetStatus}' for order ${processingOrderId} response mismatch. Expected ID '${processingOrderId}', Status '${targetStatus}'. Got ID '${savedOrder.id}', Status '${savedOrder.extended_status}'.`);
  //         }
  //       } else {
  //         console.error(`VU ${__VU}: Unexpected response or structure for '${targetStatus}' update (Order ${processingOrderId}). Status: ${resDelivered.status}, Body: ${resDelivered.body}`);
  //       }
  //       // --- End Detailed Check ---

  //       check(resDelivered, {
  //         [`Update to ${targetStatus} - Verified Success (201, no errors, saved status match)`]: () => isPreviousStatusUpdateSuccessful,
  //       });

  //       if (isPreviousStatusUpdateSuccessful) {
  //         makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderId}`, null, { headers: createHeaders(authToken) }, `/admin/order-event (After ${targetStatus})`);
  //         sleep(3); // Long sleep, review if necessary
  //       } else {
  //         console.warn(`VU ${__VU}: Halting status updates for order ${processingOrderId} after failure at '${targetStatus}'.`);
  //         // sleep(16.3);
  //       }
  //     } else {
  //       console.warn(`VU ${__VU}: Skipping update to 'delivered' for order ${processingOrderId} due to previous failure.`);
  //       // sleep(16.3); // Compensate for skipped sleep if needed
  //     } // End if (isPreviousStatusUpdateSuccessful) for Delivered

  //   } else {
  //     // Log that the block (including checks and status updates) is being skipped
  //     console.warn(`VU ${__VU}: Skipping 'Check Inventory/Credit/Promotion' and subsequent 'Status Updates (Ready/Shipped/Delivered)' block because no processing orders were successfully found or filter failed.`);
  //     // You might want to add a sleep here to compensate for the skipped block's duration
  //     // Example: Sum of sleeps inside the skipped block (3.0 + 1.1 + 1.1 + 1.1 + 1.9 + 5.1 + 2.8 + 16.3) = ~32.4s
  //     // sleep(32.4);
  //   } // End if (foundProcessingOrder && processingOrderId)


  //   // Filter by Status: Invoiced

  //   const status_invoice = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Invoiced)');
  //   sleep(0.5);
  //   const body3 = status_invoice.json();
  //   console.log('Invoiced Order', body3.orders[0].id);

  //   // Multi-Update Status: Shipped
  //   /*
  //   const multiShippedPayload = {
  //       order_ids: [ORDER_ID_MULTI_UPDATE_1, ORDER_ID_MULTI_UPDATE_2, ORDER_ID_MULTI_UPDATE_3, ORDER_ID_MULTI_UPDATE_4, ORDER_ID_MULTI_UPDATE_5],
  //       status: "shipped",
  //       expected_delivery_date: "2025-04-26T02:29:47.951Z", // Consider making dynamic
  //       term_of_payments: "current_credit_terms"
  //   };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-extend-status/update`,
  //     multiShippedPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-extend-status/update (Multi-Shipped)'
  //   );
  //   makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_MULTI_UPDATE_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Multi-Shipped)');
  //   sleep(6.1);
  //   */
  //   // Multi-Update Status: Delivered
  //   /*
  //   const multiDeliveredPayload = {
  //       order_ids: [ORDER_ID_MULTI_UPDATE_1, ORDER_ID_MULTI_UPDATE_2, ORDER_ID_MULTI_UPDATE_3, ORDER_ID_MULTI_UPDATE_4, ORDER_ID_MULTI_UPDATE_5],
  //       status: "delivered"
  //   };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-extend-status/update`,
  //     multiDeliveredPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-extend-status/update (Multi-Delivered)'
  //   );
  //   makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_MULTI_UPDATE_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Multi-Delivered)');
  //   sleep(0.9);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (After Multi-Delivered)');
  //   sleep(12.0); // Long sleep, review if necessary
  //   */
  //   // Cancel Order
  //   /*
  //   makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_CANCEL}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Cancel)');
  //   makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_CANCEL}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Cancel)');
  //   sleep(1.8);
  //   makeRequest('get', `${BASE_URL}/admin/cancellation-reasons`, null, { headers: createHeaders(authToken) }, '/admin/cancellation-reasons');
  //   sleep(9.0); // Long sleep, review if necessary
  //   const cancelPayload = {
  //       order_ids: [ORDER_ID_CANCEL],
  //       status: "cancelled",
  //       cancellation_reason_id: CANCELLATION_REASON_ID
  //   };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-extend-status/update`,
  //     cancelPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-extend-status/update (Cancel Order)'
  //   );
  //   makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_CANCEL}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Cancel)');
  //   makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_CANCEL}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Cancel)');
  //   sleep(14.5); // Long sleep, review if necessary
  //   */
  // });
  // --- Orders Create ---
  // group('Orders Create', function () {
  //   // Select Depot
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
  //   makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');

  //   // Fetch the actual list of the first 20 orders, filtered by the selected depot
  //   const depotFilteredOrderCreate = makeRequest( // Assign response to a variable
  //     'get',
  //     `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/orders (List orders page, Select Depot)'
  //   );
  //   sleep(0.5);

  //   let orderIdView3 = null; // Variable to store the dynamically found ID for view 2
  //   let foundThirdOrder = false;   // Flag to indicate if we found an order in this list

  //   // Safely attempt to parse the depot-filtered list response and extract the first ID
  //   try {
  //     if (depotFilteredOrderCreate.status === 200) {
  //       const depotFilteredListBody = depotFilteredOrderCreate.json();
  //       // Check if 'orders' array exists, is not empty, and the first element has an 'id'
  //       if (depotFilteredListBody && depotFilteredListBody.orders && Array.isArray(depotFilteredListBody.orders) && depotFilteredListBody.orders.length > 0 && depotFilteredListBody.orders[0].id) {
  //         orderIdView3 = depotFilteredListBody.orders[0].id; // Extract the ID
  //         foundThirdOrder = true;
  //         console.log(`VU ${__VU}: Found first order ID from depot-filtered list: ${orderIdView3}`);
  //       } else {
  //         console.warn(`VU ${__VU}: Depot-filtered order list request successful (Status: ${depotFilteredOrderCreate.status}) but returned no orders or unexpected structure.`);
  //       }
  //     } else {
  //       console.error(`VU ${__VU}: Failed to get depot-filtered order list. Status: ${depotFilteredOrderCreate.status}`);
  //     }
  //   } catch (e) {
  //     console.error(`VU ${__VU}: Failed to parse JSON response for depot-filtered order list. Status: ${depotFilteredOrderCreate.status}, Body: ${depotFilteredOrderCreate.body}, Error: ${e.message}`);
  //   }

  //   // --- Conditionally View Order 2 Details ---
  //   // Only proceed if we successfully found an order ID from the depot-filtered list
  //   if (foundThirdOrder && orderIdView3) {
  //     console.log(`VU ${__VU}: Proceeding to view details for order ${orderIdView3}`);

  //     // View Order 2 Details - Using the dynamically found ID
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/orders/${orderIdView3}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/orders/{id} (View Details 2)'
  //     );
  //     makeRequest(
  //       'get',
  //       `${BASE_URL}/admin/order-event?order_id=${orderIdView3}`, // Use dynamic ID
  //       null,
  //       { headers: createHeaders(authToken) },
  //       '/admin/order-event (View Details 2)'
  //     );
  //     // Skipping image requests
  //     sleep(2); // Keep the original sleep associated with viewing details 2

  //   } else {
  //     // Log that the detail view is being skipped
  //     console.warn(`VU ${__VU}: Skipping 'View Order 2 Details' because no order ID was found in the depot-filtered list or the list request failed.`);
  //     // Compensate for the skipped sleep if necessary for timing consistency
  //     sleep(2);
  //   }

  //   // Scrolling Outlet list - Pagination (Page 2, 3, 4, 5, 6 ....)
  //   for (let i = 0; i < 5; i++) { // Start from i=0 to include the first page dynamically
  //     const offset = i * 20;

  //     // Define the payload object
  //     const outletPayload = {
  //         outletDepots: [DEPOT_ID_FILTER], // Use the variable from config
  //         include_address: true
  //     };

  //     // Make the request using the helper function
  //     makeRequest(
  //       'post', // Method
  //       `${BASE_URL}/admin/outlets/fetch?offset=${offset}&limit=20&q=`, // Dynamic URL
  //       outletPayload, // Payload as JS object
  //       { headers: createHeaders(authToken, { 'content-type': 'application/json' }) }, // Params with headers
  //       `/admin/outlets/fetch (List Outlets ${i + 1}, Scrolling Outlets list)` // Name tag
  //     );
  //     sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
  //   }

  //   // Prepare for Order Create
  //   makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Order Create)');
  //   makeRequest(
  //     'get',
  //     // Use the extracted outlet_Id here
  //     `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outletId}&location_id=${LOCATION_ID_EDIT}&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand`, // LOCATION_ID_EDIT is still hardcoded
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/variants/depot-variants (For Order Create)'
  //   );
  //   sleep(1);
  //   makeRequest(
  //     'get',
  //     // Use the extracted outlet_Id here
  //     `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${outletId}&location_id=${LOCATION_ID_EDIT}&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand&last_id=variant_01H77162NRR4FXV8QPWKMFSPJD`, // LOCATION_ID_EDIT is still hardcoded
  //     null,
  //     { headers: createHeaders(authToken) },
  //     '/admin/variants/depot-variants (For Order Create -last_id)'
  //   );
  //   sleep(1);

  //   // Perform Create Order
  //   const createPayload = {
  //     order_type: 'standard',
  //     email: 'nengahpuspayoga23@yopmail.com',
  //     region_id: `${REGION_ID}`,
  //     shipping_methods: [{ option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ' }],
  //     shipping_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
  //     billing_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
  //     customer_id: 'cus_01JM74671R0812YXBZEP4W2KKC',
  //     depot_id: 'depot_01HGYXPR1M5HQ229XGC8RDQSJE',
  //     outlet_id: outletId,
  //     include_brand: true,
  //     metadata: { source_system: 'OMS' },
  //     location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9',
  //     items: [
  //       { variant_id: VARIANT_ID_EDIT_6, quantity: 1, metadata: {} },
  //       { variant_id: VARIANT_ID_EDIT_10, quantity: 2, metadata: {} },
  //       { variant_id: VARIANT_ID_EDIT_11, quantity: 3, metadata: {} },
  //       { variant_id: VARIANT_ID_EDIT_12, quantity: 4, metadata: {} }
  //     ]
  //   };
  //   // --- Capture the create response ---
  //   const createOrderResponse = makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/orders/create`,
  //     createPayload,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/orders/create (Order Create)'
  //   );
  //   sleep(1.5); // Keep sleep immediately after the create attempt

  //   // --- Check if the creation was successful (expecting 200 Created) ---
  //   let createdOrderId = null;
  //   const isCreateSuccessful = check(createOrderResponse, {
  //       'Create Order - status is 200': (r) => r.status === 200,
  //       'Order Create - contains display_id': (r) => r.body.includes('display_id')
  //   });

  //   // Optional: More robust check including parsing the response ID
  //   if (isCreateSuccessful) {
  //       try {
  //           const body = createOrderResponse.json();
  //           createdOrderId = body?.order?.id; // Adjust path if needed
  //           if (!createdOrderId) {
  //                console.warn(`VU ${__VU}: Create Order status 201 but ID not found in response. Body: ${createOrderResponse.body}`);
  //                // Consider setting isCreateSuccessful = false here if ID is mandatory
  //           } else {
  //                console.log(`VU ${__VU}: Order created successfully with ID: ${createdOrderId}`);
  //           }
  //       } catch (e) {
  //            console.error(`VU ${__VU}: Failed to parse successful Create Order response JSON: ${e.message}. Body: ${createOrderResponse.body}`);
  //            // Consider setting isCreateSuccessful = false here
  //       }
  //   }
  //   // --- End Check ---
  //   // --- Conditionally Refresh counts and list after create ---
  //   if (isCreateSuccessful) {
  //       console.log(`VU ${__VU}: Order creation successful. Proceeding with post-create checks.`);

  //       makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (After Order Created)');
  //       makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Order Created)');
  //       makeRequest(
  //         'get',
  //         `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
  //         null,
  //         { headers: createHeaders(authToken) },
  //         '/admin/orders (List orders page, After Order Created)'
  //       );
  //       sleep(0.5); // Keep sleep associated with refreshing the list

  //   } else {
  //       // Log that the post-create steps are skipped because the creation failed
  //       console.warn(`VU ${__VU}: Order creation failed (Status: ${createOrderResponse.status}). Skipping post-create checks.`);
  //       // Compensate for the skipped sleep if necessary for timing consistency
  //       sleep(0.5);
  //   }
  //   // --- End Conditional Refresh ---
  // });

  // --- Orders Edit ---
  group('Orders Edit', function () {
    // Initial data loading for Orders page - All Depots
    makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken) }, '/admin/depots/current-user');
    makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Initial)');
    makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken) }, '/admin/store/');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review');

    // Get initial order list (orders page)
    const initialListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page)'
    );
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
      makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView1}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 1)'
      );
      makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView1}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 1)'
      );
      // Skipping image requests for brevity and focus on API calls
      sleep(1);

    } else {
      // Log that the detail view is being skipped
      console.warn(`VU ${__VU}: Skipping 'View Order 1 Details' because no order ID was found in the initial list or the list request failed.`);
      // Compensate for the skipped sleep if necessary for timing consistency
      sleep(1);
    }

    // Select Depot
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Select Depot)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Select Depot)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Select Depot)');

    // Fetch the actual list of the first 20 orders, filtered by the selected depot
    const depotFilteredListResponse = makeRequest( // Assign response to a variable
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List orders page, Select Depot)'
    );
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
      makeRequest(
        'get',
        `${BASE_URL}/admin/orders/${orderIdView2}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
        null,
        { headers: createHeaders(authToken) },
        '/admin/orders/{id} (View Details 2)'
      );
      makeRequest(
        'get',
        `${BASE_URL}/admin/order-event?order_id=${orderIdView2}`, // Use dynamic ID
        null,
        { headers: createHeaders(authToken) },
        '/admin/order-event (View Details 2)'
      );
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
      makeRequest(
        'get',
        `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
        null,
        { headers: createHeaders(authToken) },
        `/admin/orders (List Page ${i + 1}, Scrolling orders list)`
      );
      sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
    }

    // Filter to Edit
    const order_edit = makeRequest('get', `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing for Edit)');
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
      const viewOrderResponse = makeRequest( /* ... */); // Existing code

      let outlet_Id = null;
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
        makeRequest(/* ... get order event ... */); // Existing code

        // Prepare for Edit - Load related data
        makeRequest(/* ... get stock locations ... */); // Existing code
        makeRequest(/* ... get depot variants ... */); // Existing code
        sleep(3); // Existing sleep

        // Perform Edit - Using the dynamic processingOrderIdForEdit
        const editPayload = {
          metadata: { external_doc_number: `editing order` },
          items: [ /* ... item definitions ... */],
          location_id: LOCATION_ID_EDIT,
        };
        // --- Capture the edit response ---
        const editResponse = makeRequest(
          'post',
          `${BASE_URL}/admin/orders/edit/${processingOrderIdForEdit}`,
          editPayload,
          { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
          '/admin/orders/edit/{id} (Perform Edit)'
        );
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

          makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
          makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Edit)');
          makeRequest('get', `${BASE_URL}/admin/orders/${processingOrderIdForEdit}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,outlet_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Edit)');
          makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${processingOrderIdForEdit}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Edit)');
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
  // --- Export ---
  // group('Export', function () {
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Export Page Load)');

  //   const exportListPayloadBase = {
  //       selectedFields: ["order_id", "order_display_id", "order_created_at", "order_extended_status", "outlet_outlet_name", "customer_full_name", "total_skus", "order_external_number", "order_total", "order_currency_code", "order_type"],
  //       offset: 0,
  //       limit: 20,
  //       search_columns: ["order_display_id", "order_external_number", "order_extended_status", "outlet_outlet_name", "customer_full_name"],
  //       order: { order_created_at: "DESC" }
  //   };

  //   // Get Export List - Date Range 1
  //   let exportListPayload1 = { ...exportListPayloadBase, created_at: { gt: "2025-03-25T00:00:00.000Z", lt: "2025-04-25T23:59:59.999Z" } };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-export/get-list`,
  //     exportListPayload1,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-export/get-list (Date Range 1)'
  //   );
  //   sleep(11.9);

  //   // Get Export List - Date Range 2
  //   let exportListPayload2 = { ...exportListPayloadBase, created_at: { gt: "2025-03-01T00:00:00.000Z", lt: "2025-03-31T23:59:59.999Z" } };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-export/get-list`,
  //     exportListPayload2,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-export/get-list (Date Range 2)'
  //   );
  //   sleep(7.5);

  //   // Get Export List - Date Range 2 + Depot 1
  //   let exportListPayload3 = { ...exportListPayload2, depot_id: [DEPOT_ID_INVENTORY_2] };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-export/get-list`,
  //     exportListPayload3,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-export/get-list (Date Range 2, Depot 1)'
  //   );
  //   sleep(7.2);

  //   // Get Export List - Date Range 2 + Depot 2
  //   let exportListPayload4 = { ...exportListPayload2, depot_id: [DEPOT_ID_FILTER] };
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-export/get-list`,
  //     exportListPayload4,
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-export/get-list (Date Range 2, Depot 2)'
  //   );
  //   sleep(10.3);

  //   // Get Export List - Date Range 2 (Reset Depot Filter)
  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/order-export/get-list`,
  //     exportListPayload2, // Use payload without depot_id
  //     { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/order-export/get-list (Date Range 2, Reset Depot)'
  //   );
  //   sleep(3.2);

  //   // Trigger Export Job
  //   const exportJobPayload = {
  //       dry_run: false,
  //       type: "line-items-orders-export",
  //       context: {
  //           list_config: { /* ... huge config object ... */ }, // Keep the original config or simplify if possible
  //           filterable_fields: {
  //               created_at: { gt: "2025-03-01T00:00:00.000Z", lt: "2025-03-31T23:59:59.999Z" }
  //           }
  //       }
  //   };
  //   // Note: The list_config is very large, ensure it's correct or use a simplified version if acceptable
  //   exportJobPayload.context.list_config = {
  //       skip: 0, take: 100, order: { order_created_at: "DESC" },
  //       select: ["line_item_id", "order_id", /* ... many other fields ... */ "order_cancellation_reason_others_description"],
  //       relations: ["customer", "shipping_address"], export_type: "csv"
  //   }; // Simplified representation

  //   makeRequest(
  //     'post',
  //     `${BASE_URL}/admin/batch-jobs`,
  //     exportJobPayload,
  //     // { headers: createHeaders(authToken, { 'content-type': 'application/json', 'idempotency-key': uuidv4() }) },
  //     // '/admin/batch-jobs (Trigger Export)'
  //           { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
  //     '/admin/batch-jobs (Trigger Export)'
  //   );

  //   // Poll Batch Job Status (Example - poll a few times)
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Poll 1)');
  //   sleep(2.0);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs/${BATCH_JOB_ID_CHECK_1}`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs/{id} (Check Job 1)');
  //   sleep(2.0);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs/${BATCH_JOB_ID_CHECK_2}`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs/{id} (Check Job 2)');
  //   sleep(2.0);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Poll 2)');
  //   sleep(5.3);
  // });

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
