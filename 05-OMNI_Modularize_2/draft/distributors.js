import { sleep, group, check } from 'k6';
import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';
// import { uuidv4 } from 'k6/x/uuid'; // Import for dynamic idempotency keys
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// --- Configuration & Parameterization ---
// Recommendation: Load sensitive data (USER_EMAIL, USER_PASSWORD) and environment-specific
// data (BASE_URL, FRONTEND_URL) from environment variables (e.g., k6 run -e USER_EMAIL=... distributors.js)
const BASE_URL = __ENV.BASE_URL || 'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net';
const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net';
const USER_EMAIL = __ENV.USER_EMAIL || 'dat-tran-niteco@outlook.com';
const USER_PASSWORD = __ENV.USER_PASSWORD || 'A@a123456789';

// --- Hardcoded IDs (Replace with dynamic data/CSV for realistic tests) ---
const ORDER_ID_VIEW_1 = 'order_01JS46MBYJEQGVYF3R2PFQYAVS';
const ORDER_ID_VIEW_2 = 'order_01JS3CHWE5W1DBE5BBKMMJVT6S';
const ORDER_ID_EDIT = 'order_01JRYPD4E4YBTA04ZX8CZFC72G'; // Used for editing and status updates
const ORDER_ID_PROCESS_1 = 'order_01JRYPFVZWW55MME1TYSFJE7VG';
const ORDER_ID_STATUS_UPDATE = 'order_01HQ5F0X3D86PA76A2HJP8WWWH'; // Used for inventory/credit check, ready, shipped, delivered
const ORDER_ID_MULTI_UPDATE_1 = 'order_01JRYET0TDF551D14Z8PFTGSGA';
const ORDER_ID_MULTI_UPDATE_2 = 'order_01JJ3WF1K5R1ZHCEGJWAVFRCXR';
const ORDER_ID_MULTI_UPDATE_3 = 'order_01JJ3R651M2ER0YW0YWDXM79AN';
const ORDER_ID_MULTI_UPDATE_4 = 'order_01JJ3QKF5E2XKC06PM6YW67A1S';
const ORDER_ID_MULTI_UPDATE_5 = 'order_01JJ3QFEYFF7R3ZNBD62QN16VV';
const ORDER_ID_CANCEL = 'order_01JRYPFXNBNRZGRBYWM6VTDSJ6';
const ORDER_ID_SEARCH_1 = 'order_01HD684R8ADTZ2WJPT0DQS4FZJ';
const ORDER_ID_SEARCH_2 = 'order_01JD4BZW5H05VQF3SG8GE0NNS7';

const DEPOT_ID_FILTER = 'depot_01H6X2SJQBKCBW1HKAEFSB42WD';
const DEPOT_ID_INVENTORY_1 = 'depot_01H5W4GM01MGFA8QK8BXBD9NB8';
const DEPOT_ID_INVENTORY_2 = 'depot_01HGYXPR1M5HQ229XGC8RDQSJE'; // Used in Export and Performance/Execution

const REGION_ID_EDIT = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
const OUTLET_ID_EDIT = 'outlet_01HDFYPV8SVAC9FZYXFVCM7RE6';
const LOCATION_ID_EDIT = 'sloc_01H71WS83VG35Q4Y5876D5G8ZE';
const VARIANT_ID_EDIT_1 = 'variant_01H7717FZZYW6JD56EZP6D58YF';
const VARIANT_ID_EDIT_2 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';
const VARIANT_ID_EDIT_3 = 'variant_01H771AVVG9NQMV4VZZ2TK7DTB';
const VARIANT_ID_EDIT_4 = 'variant_01H5PPNH4P1DSY1TA5F2Z8AE3R';

const BATCH_JOB_ID_CHECK_1 = 'batch_01JRYEWMQ7EZ5002X601ZWWR65';
const BATCH_JOB_ID_CHECK_2 = 'batch_01JSNCQ6AQVX4SMM4P8GSY4G61';

const CANCELLATION_REASON_ID = 'reason_01JHPP5TQYXJEJ0Y8AG6SGWRES';

const SALES_REP_ID_1 = '0203T01';
const SALES_REP_ID_2 = '0202T30';
const DEPOT_EXTERNAL_ID_1 = '000-MAIN';
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
    'request_duration{group:::Orders}': ['p(95)<2000'], // All requests in Orders group
    'request_duration': ['p(95)<1500'], // Global threshold for all requests
    'request_success_rate': ['rate>0.98'], // Global success rate > 98%
    'checks': ['rate>0.98'], // Ensure checks pass > 98% of the time
  },
  scenarios: {
    Overall: {
      executor: 'per-vu-iterations', // Good for debugging, change for load testing
      gracefulStop: '30s',
      vus: 1, // Start with 1 VU for debugging/testing
      iterations: 1,
      maxDuration: '5m', // Increased duration to allow for sleeps
      exec: 'overall',
    },
    // Example Load Test Scenario (Uncomment and adjust):
    // ramping: {
    //   executor: 'ramping-vus',
    //   startVUs: 5,
    //   stages: [
    //     { duration: '2m', target: 20 }, // Ramp up to 20 VUs over 2 minutes
    //     { duration: '5m', target: 20 }, // Stay at 20 VUs for 5 minutes
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
    [`${name} - status is 2xx/3xx`]: (r) => r.status >= 200 && r.status < 400,
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
        'accept': 'application/json'
        // More specific accept for login
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

  // --- Orders ---
  group('Orders', function () {
    // Initial data loading for Orders page
    makeRequest('get', `${BASE_URL}/admin/depots/current-user`, null, { headers: createHeaders(authToken) }, '/admin/depots/current-user');
    makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Initial)');
    makeRequest('get', `${BASE_URL}/admin/store/`, null, { headers: createHeaders(authToken) }, '/admin/store/');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review');

    // Get initial order list (page 1)
    makeRequest(
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List Page 1)'
    );
    sleep(0.8);

    // View Order 1 Details
    makeRequest(
      'get',
      `${BASE_URL}/admin/orders/${ORDER_ID_VIEW_1}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders/{id} (View Details 1)'
    );
    makeRequest(
      'get',
      `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_VIEW_1}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/order-event (View Details 1)'
    );
    // Skipping image requests for brevity and focus on API calls
    sleep(4.2);

    // Filter by Depot
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (Filtered)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (Filtered)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (Filtered)');
    makeRequest(
      'get',
      `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders (List Page 1, Filtered)'
    );
    // Skipping image requests
    sleep(0.5);

    // View Order 2 Details
    makeRequest(
      'get',
      `${BASE_URL}/admin/orders/${ORDER_ID_VIEW_2}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders/{id} (View Details 2)'
    );
    makeRequest(
      'get',
      `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_VIEW_2}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/order-event (View Details 2)'
    );
    // Skipping image requests
    sleep(2.2);

    // Pagination (Page 2, 3, 4, 5, 6 - Filtered)
    for (let i = 1; i < 6; i++) {
        const offset = i * 20;
        makeRequest(
            'get',
            `${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=${offset}&limit=20&order=-created_at&include_count=false&depot_id=${DEPOT_ID_FILTER}`,
            null,
            { headers: createHeaders(authToken) },
            `/admin/orders (List Page ${i + 1}, Filtered)`
        );
        sleep(Math.random() * 1 + 0.5); // Random sleep between 0.5s and 1.5s
    }

    /*
    // View Order to Edit Details
    makeRequest(
      'get',
      `${BASE_URL}/admin/orders/${ORDER_ID_EDIT}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/orders/{id} (View Before Edit)'
    );
    makeRequest(
      'get',
      `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_EDIT}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/order-event (View Before Edit)'
    );

    // Mark Order as Processing (Before Edit)
    makeRequest(
      'post',
      `${BASE_URL}/admin/orders/${ORDER_ID_EDIT}`,
      { is_processing: true },
      { headers: createHeaders(authToken, { 'content-type': 'application/json'}) },
      '/admin/orders/{id} (Mark Processing)'
    );
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (After Mark Processing)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_EDIT}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Mark Processing)');
    sleep(1.6);

    // Prepare for Edit - Load related data
    makeRequest('get', `${BASE_URL}/admin/stock-locations?depot_id=${DEPOT_ID_FILTER}&offset=0&limit=1000`, null, { headers: createHeaders(authToken) }, '/admin/stock-locations (For Edit)');
    makeRequest(
      'get',
      `${BASE_URL}/admin/variants/depot-variants?region_id=${REGION_ID_EDIT}&depot_id=${DEPOT_ID_FILTER}&outlet_id=${OUTLET_ID_EDIT}&include_empties_deposit=true&limit=20&offset=0&q=&location_id=${LOCATION_ID_EDIT}`,
      null,
      { headers: createHeaders(authToken) },
      '/admin/variants/depot-variants (For Edit)'
    );
    sleep(10.5);

    // Perform Edit
    const editPayload = {
        metadata: { external_doc_number: "editing order " }, // Add dynamic part
        items: [
            { variant_id: VARIANT_ID_EDIT_1, quantity: 1, metadata: { item_category: "YRLN" } },
            { variant_id: VARIANT_ID_EDIT_2, quantity: 1, metadata: { item_category: "YVGA" } },
            { variant_id: VARIANT_ID_EDIT_3, quantity: 1, metadata: { item_category: "YLGA" } },
            { variant_id: VARIANT_ID_EDIT_1, quantity: 16, metadata: { item_category: "YLGA" } }, // Duplicate variant, check if allowed
            { variant_id: VARIANT_ID_EDIT_4, quantity: 2, metadata: {} }
        ],
        location_id: LOCATION_ID_EDIT
    };
    makeRequest(
      'post',
      `${BASE_URL}/admin/orders/edit/${ORDER_ID_EDIT}`,
      editPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/orders/edit/{id} (Perform Edit)'
    );
    sleep(2.7);

    // Refresh counts and view order after edit
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Edit)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Edit)');
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_EDIT}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Edit)'); // Use shorter name for brevity
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_EDIT}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Edit)');
    sleep(7.6);

    // --- Status Updates ---
    // Mark another order as processing
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_PROCESS_1}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Process 1)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_PROCESS_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Process 1)');
    makeRequest(
      'post',
      `${BASE_URL}/admin/orders/${ORDER_ID_PROCESS_1}`,
      { is_processing: true },
      // { headers: createHeaders(authToken, { 'content-type': 'application/json', 'idempotency-key': uuidv4() }) },
      // '/admin/orders/{id} (Mark Processing 1)'
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/orders/{id} (Mark Processing 1)'
    );
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-active?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-active (After Mark Processing 1)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_PROCESS_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Mark Processing 1)');
    sleep(2.6);

    
    // Navigate through filtered lists (Active, Need Review)
    makeRequest('get', `${BASE_URL}/admin/orders/order-active?expand=...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/order-active (List)');
    sleep(0.8);
    makeRequest('get', `${BASE_URL}/admin/orders/order-need-review?expand=...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/order-need-review (List)');
    sleep(1.8);

    
    // Search Orders
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}&q=123456`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search 123456)');
    sleep(0.5);
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_SEARCH_1}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Search Result 1)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_SEARCH_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Search Result 1)');
    sleep(6.2);
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}&q=OMS`, null, { headers: createHeaders(authToken) }, '/admin/orders (Search OMS)');
    sleep(0.5);
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_SEARCH_2}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Search Result 2)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_SEARCH_2}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Search Result 2)');
    sleep(2.9);

    // Clear search, go back to default list
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders (List After Search)');
    sleep(3.9);
    */
    // Filter by Status: Pending
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=pending`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Pending)');
    sleep(0.5);

    // Mark Order for Status Updates as Processing
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_STATUS_UPDATE}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Status Updates)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Status Updates)');
    makeRequest(
      'post',
      `${BASE_URL}/admin/orders/${ORDER_ID_STATUS_UPDATE}`,
      { is_processing: true },
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/orders/{id} (Mark Processing for Status Updates)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Mark Processing)');
    sleep(4.8);

    // Filter by Status: Processing
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=processing`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Processing)');
    sleep(0.7);

    // Check Inventory and Credit
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_STATUS_UPDATE}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Inv/Credit Check)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Inv/Credit Check)');
    sleep(3.0);
    makeRequest('post', `${BASE_URL}/admin/orders/inventory-checked/${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/orders/inventory-checked/{id}');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Inv Check)');
    sleep(1.1);
    makeRequest('post', `${BASE_URL}/admin/orders/credit-checked/${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/orders/credit-checked/{id}');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Credit Check)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-need-review?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-need-review (After Credit Check)');
    makeRequest('get', `${BASE_URL}/admin/orders/number-of-order-ready-invoiced?depot_id=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/orders/number-of-order-ready-invoiced (After Credit Check)');
    sleep(1.4);

    /*
    // Update Status: Ready for Delivery (Single Order)
    const readyPayload = {
        order_ids: [ORDER_ID_STATUS_UPDATE],
        status: "ready_for_delivery",
        expected_delivery_date: "2025-04-26T02:31:33.058Z", // Consider making this dynamic relative to current date
        term_of_payments: "current_credit_terms"
    };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      readyPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Ready for Delivery)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Ready)');
    sleep(1.9);
    makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (After Ready)');
    sleep(5.2);

    // Update Status: Shipped (Single Order)
    const shippedPayload = { order_ids: [ORDER_ID_STATUS_UPDATE], status: "shipped" };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      shippedPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Shipped)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Shipped)');
    sleep(2.8);

    // Update Status: Delivered (Single Order)
    const deliveredPayload = { order_ids: [ORDER_ID_STATUS_UPDATE], status: "delivered" };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      deliveredPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Delivered)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_STATUS_UPDATE}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Delivered)');
    sleep(16.3); // Long sleep, review if necessary

    // Filter by Status: Invoiced
    makeRequest('get', `${BASE_URL}/admin/orders?expand=...&depot_id=${DEPOT_ID_FILTER}&extended_status[0]=invoiced`, null, { headers: createHeaders(authToken) }, '/admin/orders (Filter Status: Invoiced)');
    sleep(0.5);

    // Multi-Update Status: Shipped
    const multiShippedPayload = {
        order_ids: [ORDER_ID_MULTI_UPDATE_1, ORDER_ID_MULTI_UPDATE_2, ORDER_ID_MULTI_UPDATE_3, ORDER_ID_MULTI_UPDATE_4, ORDER_ID_MULTI_UPDATE_5],
        status: "shipped",
        expected_delivery_date: "2025-04-26T02:29:47.951Z", // Consider making dynamic
        term_of_payments: "current_credit_terms"
    };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      multiShippedPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Multi-Shipped)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_MULTI_UPDATE_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Multi-Shipped)');
    sleep(6.1);

    // Multi-Update Status: Delivered
    const multiDeliveredPayload = {
        order_ids: [ORDER_ID_MULTI_UPDATE_1, ORDER_ID_MULTI_UPDATE_2, ORDER_ID_MULTI_UPDATE_3, ORDER_ID_MULTI_UPDATE_4, ORDER_ID_MULTI_UPDATE_5],
        status: "delivered"
    };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      multiDeliveredPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Multi-Delivered)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_MULTI_UPDATE_1}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Multi-Delivered)');
    sleep(0.9);
    makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (After Multi-Delivered)');
    sleep(12.0); // Long sleep, review if necessary

    // Cancel Order
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_CANCEL}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View Before Cancel)');
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_CANCEL}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (View Before Cancel)');
    sleep(1.8);
    makeRequest('get', `${BASE_URL}/admin/cancellation-reasons`, null, { headers: createHeaders(authToken) }, '/admin/cancellation-reasons');
    sleep(9.0); // Long sleep, review if necessary
    const cancelPayload = {
        order_ids: [ORDER_ID_CANCEL],
        status: "cancelled",
        cancellation_reason_id: CANCELLATION_REASON_ID
    };
    makeRequest(
      'post',
      `${BASE_URL}/admin/order-extend-status/update`,
      cancelPayload,
      { headers: createHeaders(authToken, { 'content-type': 'application/json' }) },
      '/admin/order-extend-status/update (Cancel Order)'
    );
    makeRequest('get', `${BASE_URL}/admin/order-event?order_id=${ORDER_ID_CANCEL}`, null, { headers: createHeaders(authToken) }, '/admin/order-event (After Cancel)');
    makeRequest('get', `${BASE_URL}/admin/orders/${ORDER_ID_CANCEL}?expand=...`, null, { headers: createHeaders(authToken) }, '/admin/orders/{id} (View After Cancel)');
    sleep(14.5); // Long sleep, review if necessary

    */
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

  //   // Filter by Depot 1
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_INVENTORY_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 1)');
  //   sleep(6.7);
  //   makeRequest('get', `${BASE_URL}/admin/batch-jobs?limit=100`, null, { headers: createHeaders(authToken) }, '/admin/batch-jobs (Performance Exec Page)');
  //   sleep(2.9);

  //   // Filter by Depot 2
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_2}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 2)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_INVENTORY_2}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 2)');
  //   sleep(7.3);

  //   // Filter by Depot 3
  //   makeRequest('get', `${BASE_URL}/admin/contacts/sales-rep-by-depot?depot_external_ids=${DEPOT_EXTERNAL_ID_3}`, null, { headers: createHeaders(authToken) }, '/admin/contacts/sales-rep-by-depot (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 3)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_FILTER}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 3)');
  //   sleep(9.2);

  //   // Filter by Depot 3 + Sales Rep 1
  //   makeRequest('get', `${BASE_URL}/admin/performance/360-kpi-dashboard?start=${startYear}&end=${endYear}&depot_ids=${DEPOT_ID_FILTER}&sales_rep_ids=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/360-kpi-dashboard (Depot 3, Rep 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-sales-rep?start=${startYear}&end=${endYear}&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-sales-rep (Depot 3, Rep 1)');
  //   makeRequest('get', `${BASE_URL}/admin/performance/brand-volume-by-name?start=${startYear}&end=${endYear}&include_brand=true&offset=0&limit=3&depot_ids[0]=${DEPOT_ID_FILTER}&sales_rep_external_id=${SALES_REP_ID_1}`, null, { headers: createHeaders(authToken) }, '/admin/performance/brand-volume-by-name (Depot 3, Rep 1)');
  //   sleep(9.9);

  //   // Filter by Depot 3 + Sales Rep 2
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
