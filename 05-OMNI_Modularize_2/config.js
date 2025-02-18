import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

export const BASE_URL = 'https://hei-oms-apac-qa-mm-backend.azurewebsites.net';
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

// Load credentials from CSV
export const users = new SharedArray('users', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-credentals.csv'), { header: true }).data.filter(row => row.username);
});

// Load master data (Outlet IDs)
export const masterData = new SharedArray('masterData', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-create_order.csv'), { header: true }).data.filter(row => row.outletId) //.map(row => row.outletId);
});

// Load order_id for edit order
export const orderId = new SharedArray('orderId', function () {
    return papaparse.parse(open('../../02-K6 Files/mm-qa-edit_order.csv'), { header: true }).data.filter(row => row.order_Id)
});

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 2,
    iterations: 2,
    maxDuration: '20s'
}

// export const constant = {
//     executor: 'constant-vus',
//     vus: 40,
//     duration: '30s',
// }

export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '5s',
    stages: [
        { target: 1, duration: '5s' },
        { target: 5, duration: '5m' },
        { target: 10, duration: '10m' },
        { target: 10, duration: '10m' },
        { target: 20, duration: '10m' },
        { target: 20, duration: '10m' },
        { target: 30, duration: '10m' },
        { target: 30, duration: '10m' },
        { target: 10, duration: '10m' },
        { target: 5, duration: '5m' },
        { target: 1, duration: '5s' },
    ],
    gracefulRampDown: '5s'
}

export const thresholdsSettings = {
    thresholds: {
        http_req_duration: [{ threshold: 'p(99)<=10000', abortOnFail: false }],
        http_req_failed: [{ threshold: 'rate<=0.01', abortOnFail: false }]
    }
}
// export const options = {
//     scenarios: {
//       Authen_login: {
//         executor: 'ramping-vus',
//         gracefulStop: '1s',
//         stages: [
//           { target: 5, duration: '5s' },
//           { target: 5, duration: '10' },
//           { target: 0, duration: '5s' },
//         ],
//         gracefulRampDown: '1s',
//         exec: 'login',
//       },
//     },
//   }

