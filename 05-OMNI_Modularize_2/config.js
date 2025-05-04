import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { Trend, Rate, Counter, Metric } from 'k6/metrics';
export const BASE_URL = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net'
export const AUTH_URL = 'admin/auth'
export const ORDER_CREATE_URL = 'admin/orders/create'
export const ORDER_EDIT_URL = 'admin/orders/edit'
export const ORDER_EXPORT_URL = 'admin/batch-jobs'
export const ORDER_EXTEND_STATUS_UPDATE_URL = 'admin/order-extend-status/update'
export const ORDER_PENDINGTOPROCESSING_URL = 'admin/orders'
export const ORDER_INVENTORY_CHECK_URL = 'admin/orders/inventory-checked'
export const ORDER_CREDIT_CHECK_URL = 'admin/orders/credit-checked'
export const ORDER_PROMOTION_CHECK_URL = 'admin/orders/promotion-checked'
export const ORDER_INVOICE_GENERATE_URL = 'admin/invoices/generate'
// export const PROMOTIONS_URL = 'admin/promotions/get-list'


// Load credentials from CSV
export const users = new SharedArray('users', function () {
    return papaparse.parse(open('../../02-K6 Files/id_credentals.csv'), { header: true }).data.filter(row => row.username);
});

// Load master data (Outlet IDs)
export const masterData = new SharedArray('masterData', function () {
    return papaparse.parse(open('../../02-K6 Files/id_qa_order_create.csv'), { header: true }).data.filter(row => row.outletId) //.map(row => row.outletId);
});

// Load order_id for edit order
export const orderId = new SharedArray('orderId', function () {
    return papaparse.parse(open('../../02-K6 Files/id_qa_order_edit.csv'), { header: true }).data.filter(row => row.order_id)
});

// Load order_id for update order status
export const orderId2 = new SharedArray('orderId2', function () {
    return papaparse.parse(open('../../02-K6 Files/id_qa_order_update_status.csv'), { header: true }).data.filter(row => row.order_id)
});

// Load outlet_external_id for query promotions
export const outlet_depot = new SharedArray('outlet_depot', function () {
    return papaparse.parse(open('../../02-K6 Files/id_qa_promotion_outlet_depot.csv'), { header: true }).data.filter(row => row.outlet_external_id)
});

//Settings for different workloads
export const pervuiterations = {
    executor: 'per-vu-iterations',
    vus: 2,
    iterations: 1,
    // maxDuration: '30s'
}

export const constantWorkload = {
    executor: 'constant-vus',
    vus: 5,
    duration: '5m'
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
        { target: 10, duration: '5m' },
        { target: 15, duration: '5m' },
        { target: 20, duration: '5m' },
        { target: 30, duration: '20m' },
        { target: 10, duration: '5m' },
        { target: 5, duration: '1m' },
    ],
    gracefulRampDown: '5s'
}

export const thresholdsSettings = {
    // thresholds: {
    //     http_req_duration: [{ threshold: 'p(99)<3500', abortOnFail: false }], //1000ms = 1s
    //     http_req_failed: [{ threshold: 'rate<=0.1', abortOnFail: false }]
    // }
    thresholds: {
        // --- Built-in Metrics (These were mostly correct) ---
        'http_req_duration{name:/admin/auth - POST (Login)}': ['p(99)<1500'],
        'http_req_duration{group:::Orders Create}': ['p(95)<2000'],
        'http_req_duration{group:::Orders Update}': ['p(95)<2000'],
        'http_req_duration{group:::Orders Edit}': ['p(95)<2000'],
        'http_req_duration{group:::Login}': ['p(99)<1500'],
        'http_req_duration{group:::Orders Export}': ['p(99)<1500'], // Consider if 1500ms is realistic for export trigger/poll
        'http_req_duration': ['p(95)<1500'], // Global default
        'http_req_failed': ['rate<0.02'], // Global failure rate
        'checks': ['rate>0.98'], // Global check pass rate

        // --- Custom Metrics (Corrected Syntax) ---

        // Order Create
        'orderCreate_SuccessRate': ['rate>0.95'], // Check the rate of the 'orderCreate_SuccessRate' metric
        'orderCreate_ResponseTime': ['p(95)<2500'], // Check the p(95) of the 'orderCreate_ResponseTime' trend

        // Order Edit
        'editOrder_SuccessRate': ['rate>0.95'],
        'editOrder_ResponseTime': ['p(95)<2500'],

        // Order Update
        'updateOrder_SuccessRate': ['rate>0.95'],
        'updateOrder_ResponseTime': ['p(95)<2500'],

        // Order Export
        'exportOrder_SuccessRate': ['rate>0.95'],
        'exportOrder_ResponseTime': ['p(95)<3000'], // Allow slightly more time for export-related requests
    }
}

//Generic custom trend
// Track Response Time
export const customTrendResponseTime = new Trend('customTrendResponseTime');
// Track Success Rate
export const customTrendSuccessRate = new Rate('customTrendSuccessRate');
// Count Total Requests
export const customTrendRequestCount = new Counter('customTrendRequestCount');

//Create Orders
export const orderCreateResponseTime = new Trend('orderCreate_ResponseTime');
export const orderCreateSuccessRate = new Rate('orderCreate_SuccessRate');
export const orderCreateRequestCount = new Counter('orderCreate_RequestCount');

//Export Orders
export const exportOrderResponseTime = new Trend('exportOrder_ResponseTime');
export const exportOrderSuccessRate = new Rate('exportOrder_SuccessRate');
export const exportOrderRequestCount = new Counter('exportOrder_RequestCount');

//Edit Orders
export const editOrderResponseTime = new Trend('editOrder_ResponseTime');
export const editOrderSuccessRate = new Rate('editOrder_SuccessRate');
export const editOrderRequestCount = new Counter('editOrder_RequestCount');

//Update Status
export const pendingToProcessingResponseTime = new Trend('update_PendingToProcessing_ResponseTime');
export const pendingToProcessingSuccessRate = new Trend('update_PendingToProcessing_SuccessRate');
export const pendingToProcessingRequestCount = new Trend('update_PendingToProcessing_RequestCount');

export const updateInventoryCheckResponseTime = new Trend('update_InventoryCheck_ResponseTime');
export const updateInventoryCheckSuccessRate = new Trend('update_InventoryCheck_SuccessRate');
export const updateInventoryCheckRequestCount = new Trend('update_InventoryCheck_RequestCount');

export const updateCreditCheckResponseTime = new Trend('update_CreditCheck_ResponseTime');
export const updateCreditCheckSuccessRate = new Trend('update_CreditCheck_SuccessRate');
export const updateCreditCheckRequestCount = new Trend('update_CreditCheck_RequestCount');

export const updatePromotionCheckResponseTime = new Trend('update_PromotionCheck_ResponseTime');
export const updatePromotionCheckSuccessRate = new Trend('update_PromotionCheck_SuccessRate');
export const updatePromotionCheckRequestCount = new Trend('update_PromotionCheck_RequestCount');

export const updateOrderResponseTime = new Trend('updateOrder_ResponseTime');
export const updateOrderSuccessRate = new Rate('updateOrder_SuccessRate');
export const updateOrderRequestCount = new Counter('updateOrder_RequestCount');

export const generateInvoiceTime = new Trend('generateInvoice_ResponseTime');
export const generateInvoiceSuccessRate = new Rate('generateInvoice_SuccessRate');
export const generateInvoiceRequestCount = new Counter('generateInvoice_RequestCount');

//Get order list
export const orderGetListResponseTime = new Trend('orderGetList_ResponseTime');
export const orderGetListSuccessRate = new Rate('orderGetList_SuccessRate');
export const orderGetListRequestCount = new Counter('orderGetList_RequestCount');

//Get order list
export const promoGetListResponseTime = new Trend('promoGetList_ResponseTime');
export const promoGetListSuccessRate = new Rate('promoGetList_SuccessRate');
export const promoGetListRequestCount = new Counter('promoGetList_RequestCount');