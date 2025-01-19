import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Load credentials
let counter = 0;
let usernames = ['dat-tran-niteco@outlook.com', 'dat.tran@niteco.se', 'dat.tran-bbi@yopmail.com', 'dat.tran-bjs@yopmail.com', 'dat.tran-bsr@yopmail.com'];
let passwords = ['A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789'];
let rand = Math.floor(Math.random() * usernames.length);
let username = usernames[rand];
let password = passwords[rand];

// let username = 'dat-tran-niteco@outlook.com';
// let password = 'A@a123456789';

//load Outlet master data
const sharedArrayOutletId = new SharedArray('outletId', function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../../02-K6 Files/outlet_id.csv'), { header: true }).data;
});

//load variant_id
const sharedArrayVariantId = new SharedArray('variant_id', function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../../02-K6 Files/variant_id.csv'), { header: true }).data;
});

// //Pick a random outletId
const randomOutlet = sharedArrayOutletId[Math.floor(Math.random() * sharedArrayOutletId.length)];
export const outletId = randomOutlet.outlet_id;
// console.log('Random Outlet: ', outletId);

// //Pick a random variant_id
const randomSku = sharedArrayVariantId[Math.floor(Math.random() * sharedArrayVariantId.length)];
export const variant_id = randomSku.variant_id;
// console.log('Random Sku: ', variant_id);

// //Pick a random number of qty
export const randomQty = Math.floor(Math.random() * 10) + 1;
// console.log('Random Qty: ', randomQty);

export const payload = {
    email: username,
    password: password,
};
// console.log(`VU#${__VU} - username: ${username}`);

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 2,
    iterations: 2,
    maxDuration: '5s'
}

export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '5s',
    stages: [
        { target: 5, duration: '10s' },
        { target: 10, duration: '20s' },
        { target: 5, duration: '10s' },
    ],
    gracefulRampDown: '5s',
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

export const thresholdsSettings = {
    // thresholds: {
    //     'http_req_duration{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
    //       { threshold: 'p(99)<=300', abortOnFail: true },
    //     ],
    //     'http_req_failed{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
    //       { threshold: 'rate<=0.01', abortOnFail: true },
    //     ],
    //   }


    thresholds: {
        http_req_duration: [{ threshold: 'p(95)<=300', abortOnFail: false }],
        http_req_failed: [{ threshold: 'rate<=0.5', abortOnFail: false }]

    }

    // http_req_failed: ["rate<0.1"],
    // http_req_duration: ["p(99)<3000"]
}

export function handleSummary(data) {
    return {
        '../Reprots/TestSummaryReport.html': htmlReport(data, { debug: true }), //true
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
}