import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// let counter = 0;
// let usernames = ['dat-tran-niteco@outlook.com','dat.tran@niteco.se','dat.tran-bbi@yopmail.com','dat.tran-bjs@yopmail.com','dat.tran-bsr@yopmail.com'];
// let passwords = ['A@a123456789','A@a123456789','A@a123456789','A@a123456789','A@a123456789'];

// let usernames = ['dat-tran-niteco@outlook.com', 'dat.tran-bbi@yopmail.com'];
// let passwords = ['A@a123456789', 'A@a123456789'];

// let rand = Math.floor(Math.random() * usernames.length);
// let username = usernames[rand];
// let password = passwords[rand];

let username = 'dat.tran-alldp@yopmail.com';
let password = 'A@a123456789';

// console.log(`VU#${__VU} - username: ${username}, password: ${password}`);
// console.info(`VU#${__VU} - username: ${username}, password: ${password}`);

const baseUrl = 'https://hei-oms-apac-qa-mm-backend.azurewebsites.net';
const authUrl = 'admin/auth'
const createUrl = 'admin/orders/create'

//load Outlet master data
const csvData = new SharedArray('outletId', function () {
   // Load CSV file and parse it using Papa Parse
  return papaparse.parse(open('./MM-QA-create_order.csv'), { header: true }).data;
});

// //load variant_id
// const csvData2 = new SharedArray('variant_id', function () {
//   // Load CSV file and parse it using Papa Parse
//   return papaparse.parse(open('../K6_Files/variant_id.csv'), { header: true }).data;
// });

//Pick a random order_Id
// const randomSku = csvData2[Math.floor(Math.random() * csvData2.length)];
// const order_Id = randomSku.order_Id;
// console.log('order_Id:', order_Id);

// //Pick a random outletId
// const randomOutlet = csvData[Math.floor(Math.random() * csvData.length)];
// const outletId = randomOutlet.outlet_id;
// console.log('Random Outlet: ', outletId);

// //Pick a random variant_id
// const randomSku = csvData2[Math.floor(Math.random() * csvData2.length)];
// const variant_id = randomSku.variant_id;
// console.log('Random Sku: ', variant_id);

// //Pick a random number of qty
// const randomQty = Math.floor(Math.random() * 10) + 1;
// console.log('Random Qty: ', randomQty);

// //ID-QA
// const emailAdress = 'mulianaagus641@gmail.com';
// const customerId = 'cus_01HDFXDP6Y55G3SCNRBCPDCBVS';
// const depotId = 'depot_01H6X2SJQBKCBW1HKAEFSB42WD';
// // const outletId = 'outlet_01HDFWZ7GB2KSMRPWWKZ2ZRVCJ';
// const region_id = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
// const option_id = 'so_01H5P53FY82T6HVEPB37Z8PFPZ';
// // const variant_id = 'variant_01H5PS9EVF5915DRCDD8NDKJAT';
// // const sku_1867 = 'variant_01H6DTJPTN4HQYKAGN9KRVZ4YY';
// // const sku_10163 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';

// export const options = {
//   discardResponseBodies: true,
//   scenarios: {
//     contacts: {
//       executor: 'externally-controlled',
//       vus: 20,
//       maxVUs: 20,
//       duration: '20m',
//     },
//   },
//   thresholds: {
//         http_req_duration: [{ threshold: 'p(95)<=3000', abortOnFail: false },],
//         http_req_failed: [{ threshold: 'rate<=0.01', abortOnFail: false },]
//       }
// };

export const options = {
  // discardResponseBodies: true,
  scenarios: {
    scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '1s',
      stages: [
        { target: 5, duration: '1m' },
        { target: 10, duration: '10m' },
        { target: 20, duration: '20m' },
        { target: 30, duration: '20m' },
        { target: 40, duration: '20m' },
        { target: 50, duration: '20m' },
        { target: 5, duration: '1m' },
      ],
      gracefulRampDown: '1s',
      // exec: 'login',
    },
  },
  thresholds: {
    http_req_duration: [{ threshold: 'p(95)<=3000', abortOnFail: false },],
    http_req_failed: [{ threshold: 'rate<=0.01', abortOnFail: false },]
  }
};

// export const options = {
//   discardResponseBodies: true,
//   scenarios: {
//     contacts: {
//       executor: 'shared-iterations',
//       vus: 20,
//       iterations: 20,
//       maxDuration: '5m',
//     },
//   },
//     thresholds: {
//     http_req_duration: [{ threshold: 'p(95)<=3000', abortOnFail: false },],
//     http_req_failed: [{ threshold: 'rate<=0.01', abortOnFail: false },]
//   }
// };

// export function login() {
//   const payload = JSON.stringify({
//     email: `${username}`,
//     password: `${password}`,
//   });
//   console.log(`VU#${__VU} - username: ${username}`);

//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     }
//   };

export default function () {
  //Pick a random outletId
  const randomOutlet = csvData[Math.floor(Math.random() * csvData.length)];
  const outletId = randomOutlet.outletId;
  // console.log('Random Outlet: ', outletId);

  const payload = JSON.stringify({
    email: `${username}`,
    password: `${password}`,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  const payloadCreateOrder = JSON.stringify({
    order_type: 'standard',
    email: 'generic.outlet.contact1@hnk-oms.com',
    items: [
      {
        variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
        quantity: 4,
        metadata: {}
      },
      {
        variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
        quantity: 1,
        metadata: {
          promotionCodes: 'PROMO00258_216',
          item_category: 'YSRG',
          promotionOverride: false
        }
      }
    ],
    region_id: 'reg_01HES8WCK97EWB0BZSXT60DSA2',
    shipping_methods: [
      {
        option_id: 'so_01HF3ZZTSBNP3FBMN82NE10C0T'
      }
    ],
    shipping_address: {
      address_1: 'No.1,Bld -11,Yankin Rd,1 Qtr',
      country_code: 'mm',
      first_name: 'Generic Contact1',
      last_name: 'Generic Contact1'
    },
    billing_address: {
      address_1: 'No.1,Bld -11,Yankin Rd,1 Qtr',
      country_code: 'mm',
      first_name: 'Generic Contact1',
      last_name: 'Generic Contact1'
    },
    customer_id: 'cus_01HQSXB1GYPQA43AP9SY3YRRJH',
    depot_id: 'depot_01HES9APM60R2D27MW39GHT6YC', //'{{depotId}}'
    outlet_id: `${outletId}`,
    metadata: {
      source_system: 'OMS'
    },
    location_id: 'sloc_01HV3J179CG8PSS92N3446W6RQ'
  });

  let response;
  group(
    'page_1 - login page',
    function () {
      response = http.post(`${baseUrl}/${authUrl}`, payload, params);
      //console.log('show log response body', response.body);
      check(response, {
        'verify status equals 200': (response) => response.status.toString() === '200',
        // 'verify is correct user': (r) => r.json().user.email === username,
        // 'verify VU#': (r) => r.body.includes (`${__VU}`),
        // 'verify username': (r) => r.body.includes (`${username}`),
        // 'verify is correct first name': (r) => r.json().user.first_name.includes ('dat'),
      });
      // console.log('show log headers', response.headers);
      // return response.headers['Set-Cookie'];
      //console.log('show log Saved-Cookie', response.cookies);
    },
  )
  group(
    'page_2 - Create orders',
    function () {
      const response = http.post(`${baseUrl}/${createUrl}`, payloadCreateOrder, params);
      const body = JSON.parse(response.body)
      console.log('status: ', response.status.toString());
      console.log('order_Id: ', body.order.id);
      console.log('display_id: ', body.order.display_id);
      check(response, {
        'verify status equals 200': (response) => response.status.toString() === '200',
        'verify create successfully': (r2) => r2.body.id,
        'verify create order included promotion_codes': (r2) => r2.body.includes('PROMO00258_216'), //$.order.items[*].promotion_codes[0]
      });
    },
    sleep(2)
  )
  // group(
  //   'page_3 - logout',
  //   function () {
  //     let response = http.del(`${baseUrl}/${authUrl}`, params);
  //     check(response, {
  //       'verify status equals 200': (response) => response.status.toString() === '200',
  //       'verify logout successfully': (r2) => r2.body.includes('OK'),
  //     });
  //     //console.log('show log Saved-Cookie is removed', response.cookies);
  //   },
  // )
}

export function handleSummary(data) {
  return {
    'externally-controlled_TestSummaryReport.html(2)': htmlReport(data, { debug: false }) //true
  }
}