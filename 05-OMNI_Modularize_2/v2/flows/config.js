// v2/config.js
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { Trend, Rate, Counter } from 'k6/metrics'; // Keep Metric if used directly

// --- Base URLs & Endpoints ---
export const BASE_URL = __ENV.BASE_URL || 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
export const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net';
export const AUTH_URL = 'admin/auth';
export const ORDER_CREATE_URL = 'admin/orders/create';
export const ORDER_EDIT_URL = 'admin/orders/edit'; // Base path for edit
export const ORDER_EXPORT_URL = 'admin/batch-jobs';
export const ORDER_EXTEND_STATUS_UPDATE_URL = 'admin/order-extend-status/update';
export const ORDER_PENDINGTOPROCESSING_URL = 'admin/orders'; // Base path for marking processing
export const ORDER_INVENTORY_CHECK_URL = 'admin/orders/inventory-checked'; // Base path
export const ORDER_CREDIT_CHECK_URL = 'admin/orders/credit-checked'; // Base path
export const ORDER_PROMOTION_CHECK_URL = 'admin/orders/promotion-checked'; // Base path
export const ORDER_INVOICE_GENERATE_URL = 'admin/invoices/generate';
// export const PROMOTIONS_URL = 'admin/promotions/get-list'; // Uncomment if needed

// --- Data Loading ---
export const users = new SharedArray('users', function () {
    // Use relative path from the project root where k6 is run
    return papaparse.parse(open('../../../02-K6 Files/id_credentals.csv'), { header: true }).data.filter(row => row.username);
});

export const masterData = new SharedArray('masterData', function () {
    return papaparse.parse(open('../../../02-K6 Files/id_qa_order_create.csv'), { header: true }).data.filter(row => row.outletId);
});

export const orderId = new SharedArray('orderId', function () {
    return papaparse.parse(open('../../../02-K6 Files/id_qa_order_edit.csv'), { header: true }).data.filter(row => row.order_Id);
});

export const orderId2 = new SharedArray('orderId2', function () {
    return papaparse.parse(open('../../../02-K6 Files/id_qa_order_update_status.csv'), { header: true }).data.filter(row => row.order_Id);
});

export const outlet_depot = new SharedArray('outlet_depot', function () {
    return papaparse.parse(open('../../../02-K6 Files/id_qa_promotion_outlet_depot.csv'), { header: true }).data.filter(row => row.outlet_external_id);
});

// --- Hardcoded IDs (Parameterize where possible) ---
export const REGION_ID = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
export const DEPOT_ID_FILTER = 'depot_01HGYXPR1M5HQ229XGC8RDQSJE'; // Klungkung
export const LOCATION_ID_EDIT = 'sloc_01HGYYZND43JR5B4F1D0HG80Z9';// Klungkung
export const VARIANT_ID_EDIT_1 = 'variant_01H771AV5J5D62ZAKQ340JQJ7S';
export const VARIANT_ID_EDIT_2 = 'variant_01H729MHHAW56JTRXCC8HYCV1X';
export const VARIANT_ID_EDIT_3 = 'variant_01H7717GHMWJNHPHAEJVXRN8CS';
export const VARIANT_ID_EDIT_4 = 'variant_01H7717FZZYW6JD56EZP6D58YF';
export const VARIANT_ID_EDIT_5 = 'variant_01H7717FZZYW6JD56EZP6D58YF';
export const VARIANT_ID_EDIT_6 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';
export const VARIANT_ID_EDIT_7 = 'variant_01H77192YY9TWRM0GB6F479YQX';
export const VARIANT_ID_EDIT_8 = 'variant_01HAB20FVGTTJVH12WRE725AC0';
export const VARIANT_ID_EDIT_9 = 'variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9';
export const VARIANT_ID_EDIT_10 = 'variant_01H5PMH3V5H3BQDM49D8K88MMJ';
export const VARIANT_ID_EDIT_11 = 'variant_01H5XTJ97RNCWNM9HAR02D257T';
export const VARIANT_ID_EDIT_12 = 'variant_01H5XWXT9KJ7DN1MFSVX778KDA';
export const CANCELLATION_REASON_ID = 'reason_01JHPP5TQYXJEJ0Y8AG6SGWRES';
// ... other IDs ...

// --- Workload Settings ---
export const pervuiterations = {
    executor: 'per-vu-iterations',
    vus: 1,
    iterations: 1,
    // maxDuration: '30s'
}

export const constantWorkload = {
    executor: 'constant-vus',
    vus: 5,
    duration: '20m'
}

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 5,
    iterations: 10000,
    maxDuration: '24h'
}

export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '5s',
    stages: [
        { target: 5, duration: '1m' },
        // { target: 10, duration: '10m' },
        // { target: 15, duration: '10m' },
        // { target: 20, duration: '20m' },
        // { target: 30, duration: '20m' },
        { target: 10, duration: '2m' },
        { target: 5, duration: '1m' },
    ],
    gracefulRampDown: '5s'
}

// --- Threshold Settings ---
export const thresholdsSettings = {
    thresholds: {
        // Use tags for more specific thresholds
        'http_req_duration{name:/admin/auth - POST (Login)}': ['p(99)<1500'],
        'http_req_duration{group:::Orders Create}': ['p(95)<2000'],
        'http_req_duration{group:::Orders Update}': ['p(95)<2000'],
        'http_req_duration{group:::Orders Edit}': ['p(95)<2000'],
        'http_req_duration{group:::Login}': ['p(99)<1500'],
        'http_req_duration{group:::Orders Export}': ['p(99)<1500'],
        'http_req_duration': ['p(95)<1500'], // Global
        'http_req_failed': ['rate<0.02'], // Use k6 built-in
        'checks': ['rate>0.98'],
        // Add thresholds for custom metrics
        'rate(orderCreate_SuccessRate)>0.95': ['threshold>0.95', { abortOnFail: false }],
        'trend(orderCreate_ResponseTime):p(95)<2500': ['threshold<2500', { abortOnFail: false }],
        'rate(editOrder_SuccessRate)>0.95': ['threshold>0.95', { abortOnFail: false }],
        'trend(editOrder_ResponseTime):p(95)<2500': ['threshold<2500', { abortOnFail: false }],
        'rate(updateOrder_SuccessRate)>0.95': ['threshold>0.95', { abortOnFail: false }],
        'trend(updateOrder_ResponseTime):p(95)<2500': ['threshold<2500', { abortOnFail: false }],
        'rate(exportOrder_SuccessRate)>0.95': ['threshold>0.95', { abortOnFail: false }],
        'trend(exportOrder_ResponseTime):p(95)<3000': ['threshold<3000', { abortOnFail: false }], // Allow more time for export potentially
    }
};

// --- Custom Metrics Definitions ---

// Generic
export const customTrendResponseTime = new Trend('customTrendResponseTime');
export const customTrendSuccessRate = new Rate('customTrendSuccessRate');
export const customTrendRequestCount = new Counter('customTrendRequestCount');

// Orders Create
export const orderCreateResponseTime = new Trend('orderCreate_ResponseTime');
export const orderCreateSuccessRate = new Rate('orderCreate_SuccessRate');
export const orderCreateRequestCount = new Counter('orderCreate_RequestCount');

// Orders Edit
export const editOrderResponseTime = new Trend('editOrder_ResponseTime');
export const editOrderSuccessRate = new Rate('editOrder_SuccessRate');
export const editOrderRequestCount = new Counter('editOrder_RequestCount');

// Orders Update (Combined - includes status updates, checks etc. from the original group)
export const updateOrderResponseTime = new Trend('updateOrder_ResponseTime');
export const updateOrderSuccessRate = new Rate('updateOrder_SuccessRate');
export const updateOrderRequestCount = new Counter('updateOrder_RequestCount');

// Orders Export
export const exportOrderResponseTime = new Trend('exportOrder_ResponseTime');
export const exportOrderSuccessRate = new Rate('exportOrder_SuccessRate');
export const exportOrderRequestCount = new Counter('exportOrder_RequestCount');

// Add other specific metrics if needed (e.g., for Promotions, Inventory...)
