// v2/config.js
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { Trend, Rate, Counter } from 'k6/metrics'; // Keep Metric if used directly

// --- Base URLs & Endpoints ---
export const BASE_URL = __ENV.BASE_URL || 'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net';
export const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors';
// export const BASE_URL = __ENV.BASE_URL || 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
// export const FRONTEND_URL = __ENV.FRONTEND_URL || 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors';

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
    return papaparse.parse(open('../../../../02-K6 Files/id_credentals.csv'), { header: true }).data.filter(row => row.username);
});

export const masterData = new SharedArray('masterData', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_create.csv'), { header: true }).data.filter(row => row.outlet_id);
});

export const masterData_2 = new SharedArray('masterData_2', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_create_2.csv'), { header: true }).data.filter(row => row.outlet_id);
});

export const masterData_3 = new SharedArray('masterData_3', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_create_3.csv'), { header: true }).data.filter(row => row.outlet_id);
});

export const orderId = new SharedArray('orderId', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_edit.csv'), { header: true }).data.filter(row => row.order_id);
});

export const orderId_2 = new SharedArray('orderId_2', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_edit_2.csv'), { header: true }).data.filter(row => row.order_id);
});

export const orderId_3 = new SharedArray('orderId_3', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_edit_3.csv'), { header: true }).data.filter(row => row.order_id);
});

export const orderIdUpdate = new SharedArray('orderIdUpdate', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_update_status.csv'), { header: true }).data.filter(row => row.order_id);
});

export const orderIdUpdate_2 = new SharedArray('orderIdUpdate_2', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_update_status_2.csv'), { header: true }).data.filter(row => row.order_id);
});

export const orderIdUpdate_3 = new SharedArray('orderIdUpdate_3', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_order_update_status_3.csv'), { header: true }).data.filter(row => row.order_id);
});

export const outlet_depot = new SharedArray('outlet_depot', function () {
    return papaparse.parse(open('../../../../02-K6 Files/id_qa_promotion_outlet_depot.csv'), { header: true }).data.filter(row => row.outlet_external_id && row.depot_external_id);
});


export const DEPOT_ID_FILTER = [
    'depot_01HGYXPR1M5HQ229XGC8RDQSJE' // Klungkung 302-BBI-D02-MAIN masterdata
    // 'depot_01H6X2SJQBKCBW1HKAEFSB42WD' /// NUSA DUA 302-BBI-D03-MAIN masterdata_2
    // 'depot_01HH18JASWRK89BAGE3VN59SK1', // Singagar 302-BBI-001-MAIN masterdata_3
    // 'depot_01H77DYEYMRGXJ86ZRZF7WJM87' // D01-MAIN - test invalid case
];

// --- Hardcoded IDs ---
export const REGION_ID = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
export const LOCATION_ID = 'sloc_01HGYYZND43JR5B4F1D0HG80Z9';// Klungkung
export const VARIANT_ID_1 = 'variant_01H771AVVG9NQMV4VZZ2TK7DTB'; //variant_01H771AVVG9NQMV4VZZ2TK7DTB - ID Hotfix //variant_01H771AV5J5D62ZAKQ340JQJ7S E1830 - ID QA
export const VARIANT_ID_2 = 'variant_01H729MHHAW56JTRXCC8HYCV1X'; //E1838
export const VARIANT_ID_3 = 'variant_01H7717GHMWJNHPHAEJVXRN8CS'; //E1819C
export const VARIANT_ID_4 = 'variant_01H7717FZZYW6JD56EZP6D58YF'; //E1819
export const VARIANT_ID_5 = 'variant_01H7717FZZYW6JD56EZP6D58YF'; //E1819
export const VARIANT_ID_6 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80'; //10163
export const VARIANT_ID_7 = 'variant_01H77192YY9TWRM0GB6F479YQX'; //1884
export const VARIANT_ID_8 = 'variant_01HAB20FVGTTJVH12WRE725AC0'; //65398
export const VARIANT_ID_9 = 'variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9'; //L65403
export const VARIANT_ID_10 = 'variant_01H5PMH3V5H3BQDM49D8K88MMJ'; //10164
export const VARIANT_ID_11 = 'variant_01H5XTJ97RNCWNM9HAR02D257T'; //53076
export const VARIANT_ID_12 = 'variant_01H5XWXT9KJ7DN1MFSVX778KDA'; //54026


//Create
// items: [
//     { variant_id: VARIANT_ID_6, quantity: 1, metadata: {} },
//     { variant_id: VARIANT_ID_10, quantity: 2, metadata: {} },
//     { variant_id: VARIANT_ID_11, quantity: 3, metadata: {} },
//     { variant_id: VARIANT_ID_12, quantity: 4, metadata: {} }
// ]

//Edit
// [	[
//       "E1830",	  "variant_01H771AVVG9NQMV4VZZ2TK7DTB",
//       "E1819",	  "variant_01H7717FZZYW6JD56EZP6D58YF",
//       "E1838",	  "variant_01H729MHHAW56JTRXCC8HYCV1X",
//       "E1819C",	  "variant_01H7717GHMWJNHPHAEJVXRN8CS",
//       "E1819",	  "variant_01H7717FZZYW6JD56EZP6D58YF",
//       "65398",	  "variant_01HAB20FVGTTJVH12WRE725AC0",
//       "10163",	  "variant_01H5PMESX1AR52H7BJ4CTHHE80",
//       "10164",	  "variant_01H5PMH3V5H3BQDM49D8K88MMJ",
//       "L65403",	  "variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9",
//       "1884"	      "variant_01H77192YY9TWRM0GB6F479YQX"
//     ]	]
    
// --- Workload Settings ---
export const pervuIterationsWorkload = {
    executor: 'per-vu-iterations', //thresdhold configures based this mode vus: 1, iterations: 2
    vus: 50,
    iterations: 1
    // maxDuration: '1m' // default = 10m
}

export const constantWorkload = {
    executor: 'constant-vus',
    vus: 15,
    duration: '5m'
}

export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '30s',
    stages: [
        { target: 5, duration: '1m' },  // Ramp up to 5 VUs over 1 min
        { target: 10, duration: '10m' }, // Ramp up from 5 to 10 VUs over 10 mins
        { target: 10, duration: '15m' }, // Ramp up from 10 to 15 VUs over 10 mins
        { target: 15, duration: '15m' }, // Ramp up from 15 to 20 VUs over 15 mins
        { target: 10, duration: '5mm' }, // Ramp up from 20 to 30 VUs over 20 mins
        { target: 0, duration: '1m' },   // Ramp down from 30 to 5 VUs over 1 min
    ],
    gracefulRampDown: '30s'
}

export const constantArrivalRateWorkload = {
    executor: 'constant-arrival-rate',
    rate: 60, // Target iterations per timeUnit (e.g., 60 iterations per minute)
    timeUnit: '1m', // The period during which 'rate' iterations should start
    duration: '10m', // Total duration of this scenario
    preAllocatedVUs: 10, // Start with 10 VUs, k6 will scale up if needed
    maxVUs: 50, // Allow k6 to scale up to 50 VUs to maintain the rate
}

export const rampingArrivalRateWorkload = {
    executor: 'ramping-arrival-rate',
    startRate: 30, // Start at 30 iterations per timeUnit
    timeUnit: '1m',
    preAllocatedVUs: 5, // Initial VUs
    maxVUs: 100, // Max VUs k6 can use
    stages: [
        { target: 120, duration: '5m' }, // Ramp up to 120 iterations/min over 5 minutes
        { target: 120, duration: '10m' }, // Stay at 120 iterations/min for 10 minutes
        { target: 0, duration: '2m' },   // Ramp down to 0 iterations/min over 2 minutes
    ],
}

export const shortBurstSharedWorkload = {
    executor: 'shared-iterations',
    vus: 20, // Use 20 VUs
    iterations: 200, // Complete a total of 200 iterations among the VUs
    maxDuration: '2m', // Stop after 2 minutes even if iterations aren't done
}

// --- Threshold Settings ---
export const thresholdsSettings = {
    thresholds: {
        // --- Built-in Metrics ---
        'http_req_duration': ['p(95)<1500'], // Global default
        'http_req_failed': ['rate<0.02'], // Global failure rate
        'checks': ['rate>0.98'], // Global check pass rate

        // --- Custom Metrics (For certain Group URL) ---
        'http_req_duration{group:::Login}': ['p(99)<1500'],
        'http_req_duration{group:::Orders Create}': ['p(95)<7000'],
        'http_req_duration{group:::Orders Edit}': ['p(95)<7000'],
        'http_req_duration{group:::Orders Update}': ['p(95)<4000'],
        'http_req_duration{group:::Orders Filter}': ['p(95)<1000'],
        'http_req_duration{group:::Orders Scrolling}': ['p(95)<1000'],
        'http_req_duration{group:::Orders Search}': ['p(95)<1500'],
        'http_req_duration{group:::Orders Export}': ['p(95)<1500'],
        'http_req_duration{group:::Outlets Search}': ['p(95)<1000'],
        'http_req_duration{group:::Orders Promotions Get List}': ['p(95)<2000'],
        'http_req_duration{group:::Orders PL Scrolling}': ['p(95)<3000'],
        'http_req_duration{group:::Performance Distributor}': ['p(95)<3000'],
        'http_req_duration{group:::Orders Update To Delivered}': ['p(95)<4000'],
        'http_req_duration{group:::Orders Invoice Generation}': ['p(95)<4000'],

        // --- Custom Metrics (For certain URL) ---
        // 'http_req_duration{name:/admin/auth - POST (Login)}': ['p(99)<1500'],

        // --- Custom Metrics ---
        // Login
        'login_success_rate': ['rate>0.95'],
        'login_response_time': ['p(95)<1000'],

        // Order Create
        'order_creation_success_rate': ['rate>0.95'],// Check the rate of the 'Order Create Success Rate' metric
        'order_creation_response_time': ['p(95)<1500'],// Check the p(95) of the 'Order Create Response Time' trend

        // Order Edit
        'order_editing_success_rate': ['rate>0.95'],
        'order_editing_response_time': ['p(95)<1800'],

        // Order Update
        // These will now primarily cover the initial checks (inventory, credit, promo) in ordersUpdateFlow
        'order_updating_success_rate': ['rate>0.95'],
        'order_updating_response_time': ['p(95)<1500'],

        // Order Update - Specific Statuses
        'order_update_rfd_success_rate': ['rate>0.95'],         'order_update_rfd_response_time': ['p(95)<1500'],
        'order_update_shipped_success_rate': ['rate>0.95'],     'order_update_shipped_response_time': ['p(95)<1500'],
        'order_update_delivered_success_rate': ['rate>0.95'],   'order_update_delivered_response_time': ['p(95)<1500'],
        'order_update_paid_success_rate': ['rate>0.95'],        'order_update_paid_response_time': ['p(95)<1500'],

        // Order Filter
        'order_filter_success_rate': ['rate>0.99'],
        'order_filter_response_time': ['p(95)<1000'],

        // Order Scrolling
        'order_scrolling_success_rate': ['rate>0.99'],
        'order_scrolling_response_time': ['p(95)<1000'],

        // Order Search
        'order_search_success_rate': ['rate>0.95'],
        'order_search_response_time': ['p(95)<1500'],

        // Order Export
        'order_export_success_rate': ['rate>0.95'],
        'order_export_response_time': ['p(95)<1500'],

        // Outlet Search
        'outlet_search_success_rate': ['rate>0.95'],
        'outlet_search_response_time': ['p(95)<1000'],

        // Orders Promotions Get List
        'promo_get_list_success_rate': ['rate>0.98'],
        'promo_get_list_response_time': ['p(95)<2000'],

        // Orders PL Scrolling
        'pl_scrolling_success_rate': ['rate>0.98'],
        'pl_scrolling_response_time': ['p(95)<3000'],

        // Order Update To Delivered
        'order_update_to_delivered_success_rate': ['rate>0.95'],
        'order_update_to_delivered_response_time': ['p(95)<3500'],

        // Order Edit Retries
        'order_editing_retry_success_rate': ['rate>0.80'],
        'order_editing_retry_response_time': ['p(95)<2000'],

        // Orders Invoice Generation
        'order_invoice_success_rate': ['rate>0.80'],
        'order_invoice_response_time': ['p(95)<2000'],

                
        // --- Performance Distributor - Specific Endpoints ---
        // Chart Settings
        'perf_dist_chart_settings_response_time': ['p(95)<1000'],
        'perf_dist_chart_settings_success_rate': ['rate>0.98'],
        // Sales Volume Information
        'perf_dist_sales_vol_info_response_time': ['p(95)<1000'],
        'perf_dist_sales_vol_info_success_rate': ['rate>0.98'],
        // Sales Case Fill Rate
        'perf_dist_sales_case_fill_rate_response_time': ['p(95)<1000'],
        'perf_dist_sales_case_fill_rate_success_rate': ['rate>0.98'],
        // Transaction Capture
        'perf_dist_trans_capture_response_time': ['p(95)<1000'],
        'perf_dist_trans_capture_success_rate': ['rate>0.98'],
        // Distribution Compliance
        'perf_dist_dist_compliance_response_time': ['p(95)<3500'],
        'perf_dist_dist_compliance_success_rate': ['rate>0.98'],
        // Order SLA
        'perf_dist_order_sla_response_time': ['p(95)<1000'],
        'perf_dist_order_sla_success_rate': ['rate>0.98'],
        // Call Effectiveness
        'perf_dist_call_effectiveness_response_time': ['p(95)<1000'],
        'perf_dist_call_effectiveness_success_rate': ['rate>0.98'],
        // Chart ASO
        'perf_dist_chart_aso_response_time': ['p(95)<1000'],
        'perf_dist_chart_aso_success_rate': ['rate>0.98'],
    }
};

// --- Custom Metrics Definitions ---

// Generic
export const defaultCustomResponseTime = new Trend('default_custom_response_time');
export const defaultCustomSuccessRate = new Rate('default_custom_success_rate');
export const defaultCustomRequestCount = new Counter('default_custom_request_count');

// Login
export const loginResponseTime = new Trend('login_response_time');
export const loginSuccessRate = new Rate('login_success_rate');
export const loginRequestCount = new Counter('login_request_count');

// Orders Create
export const orderCreationResponseTime = new Trend('order_creation_response_time');
export const orderCreationSuccessRate = new Rate('order_creation_success_rate');
export const orderCreationRequestCount = new Counter('order_creation_request_count');

// Orders Edit
export const orderEditingResponseTime = new Trend('order_editing_response_time');
export const orderEditingSuccessRate = new Rate('order_editing_success_rate');
export const orderEditingRequestCount = new Counter('order_editing_request_count');

// Orders Update
export const orderUpdatingResponseTime = new Trend('order_updating_response_time');
export const orderUpdatingSuccessRate = new Rate('order_updating_success_rate');
export const orderUpdatingRequestCount = new Counter('order_updating_request_count');

// Orders Update - Ready For Delivery status
export const orderUpdateReadyForDeliveryResponseTime = new Trend('order_update_rfd_response_time');
export const orderUpdateReadyForDeliverySuccessRate = new Rate('order_update_rfd_success_rate');
export const orderUpdateReadyForDeliveryRequestCount = new Counter('order_update_rfd_request_count');

// Orders Update - Shipped status
export const orderUpdateShippedResponseTime = new Trend('order_update_shipped_response_time');
export const orderUpdateShippedSuccessRate = new Rate('order_update_shipped_success_rate');
export const orderUpdateShippedRequestCount = new Counter('order_update_shipped_request_count');

// Orders Update - Delivered status
export const orderUpdateDeliveredResponseTime = new Trend('order_update_delivered_response_time');
export const orderUpdateDeliveredSuccessRate = new Rate('order_update_delivered_success_rate');
export const orderUpdateDeliveredRequestCount = new Counter('order_update_delivered_request_count');

// Orders Update - Paid status
export const orderUpdatePaidResponseTime = new Trend('order_update_paid_response_time');
export const orderUpdatePaidSuccessRate = new Rate('order_update_paid_success_rate');
export const orderUpdatePaidRequestCount = new Counter('order_update_paid_request_count');


// Orders Filter
export const orderFilterResponseTime = new Trend('order_filter_response_time');
export const orderFilterSuccessRate = new Rate('order_filter_success_rate');
export const orderFilterRequestCount = new Counter('order_filter_request_count');

// Orders Scrolling
export const orderScrollingResponseTime = new Trend('order_scrolling_response_time');
export const orderScrollingSuccessRate = new Rate('order_scrolling_success_rate');
export const orderScrollingRequestCount = new Counter('order_scrolling_request_count');

// Orders Search
export const orderSearchResponseTime = new Trend('order_search_response_time');
export const orderSearchSuccessRate = new Rate('order_search_success_rate');
export const orderSearchRequestCount = new Counter('order_search_request_count');

// Orders Export
export const orderExportResponseTime = new Trend('order_export_response_time');
export const orderExportSuccessRate = new Rate('order_export_success_rate');
export const orderExportRequestCount = new Counter('order_export_request_count');

// Outlets Search
export const outletSearchResponseTime = new Trend('outlet_search_response_time');
export const outletSearchSuccessRate = new Rate('outlet_search_success_rate');
export const outletSearchRequestCount = new Counter('outlet_search_request_count');

// Orders Promotions Get List
export const promoGetListResponseTime = new Trend('promo_get_list_response_time');
export const promoGetListSuccessRate = new Rate('promo_get_list_success_rate');
export const promoGetListRequestCount = new Counter('promo_get_list_request_count');

// Orders PL Scrolling
export const plScrollingResponseTime = new Trend('pl_scrolling_response_time');
export const plScrollingSuccessRate = new Rate('pl_scrolling_success_rate');
export const plScrollingRequestCount = new Counter('pl_scrolling_request_count');

// Orders Update To Delivered
export const orderUpdateToDeliveredResponseTime = new Trend('order_update_to_delivered_response_time');
export const orderUpdateToDeliveredSuccessRate = new Rate('order_update_to_delivered_success_rate');
export const orderUpdateToDeliveredRequestCount = new Counter('order_update_to_delivered_request_count');

// Orders Edit Retry
export const orderEditingRetryResponseTime = new Trend('order_editing_retry_response_time');
export const orderEditingRetrySuccessRate = new Rate('order_editing_retry_success_rate');
export const orderEditingRetryRequestCount = new Counter('order_editing_retry_request_count');

// Orders Invoice Generation
export const orderInvoiceResponseTime = new Trend('order_invoice_response_time');
export const orderInvoiceSuccessRate = new Rate('order_invoice_success_rate');
export const orderInvoiceRequestCount = new Counter('order_invoice_request_count');

// --- Performance Distributor ---
export const performanceDistributorResponseTime = new Trend('performance_distributor_response_time', true);
export const performanceDistributorSuccessRate = new Rate('performance_distributor_success_rate');
export const performanceDistributorRequestCount = new Counter('performance_distributor_request_count'); // Keep this for overall count if needed

// --- Performance Distributor - Specific Endpoints ---
// Chart Settings
export const perfDistChartSettingsResponseTime = new Trend('perf_dist_chart_settings_response_time', true);
export const perfDistChartSettingsSuccessRate = new Rate('perf_dist_chart_settings_success_rate');
export const perfDistChartSettingsRequestCount = new Counter('perf_dist_chart_settings_request_count');
// Sales Volume Information
export const perfDistSalesVolInfoResponseTime = new Trend('perf_dist_sales_vol_info_response_time', true);
export const perfDistSalesVolInfoSuccessRate = new Rate('perf_dist_sales_vol_info_success_rate');
export const perfDistSalesVolInfoRequestCount = new Counter('perf_dist_sales_vol_info_request_count');
// Sales Case Fill Rate
export const perfDistSalesCaseFillRateResponseTime = new Trend('perf_dist_sales_case_fill_rate_response_time', true);
export const perfDistSalesCaseFillRateSuccessRate = new Rate('perf_dist_sales_case_fill_rate_success_rate');
export const perfDistSalesCaseFillRateRequestCount = new Counter('perf_dist_sales_case_fill_rate_request_count');
// Transaction Capture
export const perfDistTransCaptureResponseTime = new Trend('perf_dist_trans_capture_response_time', true);
export const perfDistTransCaptureSuccessRate = new Rate('perf_dist_trans_capture_success_rate');
export const perfDistTransCaptureRequestCount = new Counter('perf_dist_trans_capture_request_count');
// Distribution Compliance
export const perfDistDistComplianceResponseTime = new Trend('perf_dist_dist_compliance_response_time', true);
export const perfDistDistComplianceSuccessRate = new Rate('perf_dist_dist_compliance_success_rate');
export const perfDistDistComplianceRequestCount = new Counter('perf_dist_dist_compliance_request_count');
// Order SLA
export const perfDistOrderSlaResponseTime = new Trend('perf_dist_order_sla_response_time', true);
export const perfDistOrderSlaSuccessRate = new Rate('perf_dist_order_sla_success_rate');
export const perfDistOrderSlaRequestCount = new Counter('perf_dist_order_sla_request_count');
// Call Effectiveness
export const perfDistCallEffectivenessResponseTime = new Trend('perf_dist_call_effectiveness_response_time', true);
export const perfDistCallEffectivenessSuccessRate = new Rate('perf_dist_call_effectiveness_success_rate');
export const perfDistCallEffectivenessRequestCount = new Counter('perf_dist_call_effectiveness_request_count');
// Chart ASO
export const perfDistChartAsoResponseTime = new Trend('perf_dist_chart_aso_response_time', true);
export const perfDistChartAsoSuccessRate = new Rate('perf_dist_chart_aso_success_rate');
export const perfDistChartAsoRequestCount = new Counter('perf_dist_chart_aso_request_count');