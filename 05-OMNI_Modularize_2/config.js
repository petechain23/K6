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


//Settings for different workloads
export const pervuiterations = {
    executor: 'per-vu-iterations',
    vus: 50,
    iterations: 1,
    // maxDuration: '30s'
}

export const constantWorkload = {
    executor: 'constant-vus',
    vus: 100,
    duration: '5m'
}

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 50,
    iterations: 1000,
    maxDuration: '5m'
}

export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '30s',
    stages: [
        { target: 5, duration: '1m' },
        { target: 20, duration: '3m' },
        { target: 100, duration: '5m' },
        { target: 50, duration: '3m' },
        { target: 5, duration: '1m' }
    ],
    gracefulRampDown: '30s'
}

export const thresholdsSettings = {
    thresholds: {
        http_req_duration: [{ threshold: 'p(99)<3500', abortOnFail: false }], //1000ms = 1s
        http_req_failed: [{ threshold: 'rate<=0.1', abortOnFail: false }]
    }
}

//Create Orders
// Track Response Time
export const orderCreateResponseTime = new Trend('orderCreate_ResponseTime');
// Track Success Rate
export const orderCreateSuccessRate = new Rate('orderCreate_SuccessRate');
// Count Total Requests
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
export const updateOrderResponseTime = new Trend('updateOrder_ResponseTime');
export const updateOrderSuccessRate = new Rate('updateOrder_SuccessRate');
export const updateOrderRequestCount = new Counter('updateOrder_RequestCount');

//Get order list
export const orderGetListResponseTime = new Trend('orderGetList_ResponseTime');
export const orderGetListSuccessRate = new Rate('orderGetList_SuccessRate');
export const orderGetListRequestCount = new Counter('orderGetList_RequestCount');

//Get order list
export const promoGetListResponseTime = new Trend('promoGetList_ResponseTime');
export const promoGetListSuccessRate = new Rate('promoGetList_SuccessRate');
export const promoGetListRequestCount = new Counter('promoGetList_RequestCount');

// Load credentials from CSV
export const users = new SharedArray('users', function () {
    return papaparse.parse(open('../../02-K6 Files/id-credentals.csv'), { header: true }).data.filter(row => row.username);
});

// Load master data (Outlet IDs)
export const masterData = new SharedArray('masterData', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-create_order.csv'), { header: true }).data.filter(row => row.outletId) //.map(row => row.outletId);
});

// Load order_id for edit order
export const orderId = new SharedArray('orderId', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-edit_order.csv'), { header: true }).data.filter(row => row.order_Id)
});

// Load order_id for update order status
export const orderId2 = new SharedArray('orderId2', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-update_order_status.csv'), { header: true }).data.filter(row => row.order_Id)
});

// Load outlet_external_id for query promotions
export const outlet_depot = new SharedArray('outlet_depot', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-promotion_outlet_depot.csv'), { header: true }).data.filter(row => row.outlet_external_id)
});