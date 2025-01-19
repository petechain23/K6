// import necessary module
import http from "k6/http";
import { check } from "k6";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// define configuration
export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ["p(99)<1000"], // 99% of requests should be below 1s
  },

  // define scenarios
  scenarios: {
    // arbitrary name of scenario
    average_load: {
      executor: "ramping-vus",
      stages: [
        // ramp up to average load of 20 virtual users
        { duration: "5s", target: 1 },
        // maintain load
        { duration: "10s", target: 2 },
        // ramp down to zero
        { duration: "5s", target: 0 },
      ],
    },
  }
};
/*
.Run the test with no command-line flags:
k6 run api-test.js

.Run the test with an argument of 10 iterations command-line flags:
k6 run --iterations 10 api-test.js

.To output results to a JSON file, use the --out flag.
k6 run --out json=results.json api-test.js

.Then run this jq command to filter the latency results; http_req_duration metric.
jq '. | select(.type == "Point" and .metric == "http_req_duration")' results.json

*/

//set baseURL
// const baseUrl = 'https://acc-id.omni-admin.heiway.com';
// const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
// const baseUrl = 'https://acc-mm.omni-admin.heiway.com';
const baseUrl = 'https://hei-oms-apac-qa-mm-backend.azurewebsites.net';
const authUrl = 'admin/auth'
const createUrl = 'admin/orders/create'

//payload
//ID-QA
// const emailAdress = 'mulianaagus641@gmail.com';
// const customerId = 'cus_01HDFXDP6Y55G3SCNRBCPDCBVS';
// const depotId = 'depot_01H6X2SJQBKCBW1HKAEFSB42WD';
// const outletId = 'outlet_01HDFWZ7GB2KSMRPWWKZ2ZRVCJ';
// const region_id = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
// const option_id = 'so_01H5P53FY82T6HVEPB37Z8PFPZ';
// const sku_53993 = 'variant_01H5PS9EVF5915DRCDD8NDKJAT';
// const sku_1867 = 'variant_01H6DTJPTN4HQYKAGN9KRVZ4YY';
// const sku_10163 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';
// const E1830 = '';
// const E1819 = '';

// ID-ACC
// const emailAdress = 'uyuputih@gmail.com';
// const customerId = 'cus_01HDFYWYNSSKAQ791Y63YDPD10';
// const depotId = 'depot_01H947XH9CMGV4M056VMTS3F6Q';
// const outletId = 'outlet_01HDFYXN679R39AWDMRJMFKC37';
// const region_id = 'reg_01H947VXJS2KT4D6JWWSQ8Y3BC';
// const option_id = 'so_01H94C6CDZH2A9V525B5GHH1GC';
// const sku_53993 = 'variant_01H983TMHNXKG97PEH8CEHX6MH';
// const sku_1867 = 'variant_01H983T3WRA401A7320K0NW8RD';
// const sku_10163 = 'variant_01H983RRKZ5R9EW3891JTFAC8Y';
// const E1828 = '';
// const E1819 = '';

//MM-QA
const emailAdress = 'load.test.qa@yopmail.com';
const customerId = 'cus_01J1H9PRR6VGSDVGSQNQBCKEX2';
const depotId = 'depot_01HES9APM60R2D27MW39GHT6YC';
const outletId = 'outlet_01HGFWR8EWDHX4DGWCGRZ3NCS9';
const region_id = 'reg_01HES8WCK97EWB0BZSXT60DSA2';
const option_id = 'so_01HF3ZZTSBNP3FBMN82NE10C0T';
const sku_NCFTGCBS01 = 'variant_01HES9RP94FJZMY6XQ3S15N751';
const sku_NKFABCKS01 = 'variant_01HES9RS6PXVNRCH2FS2NM0E6G';
const sku_NPCTGOCL01 = 'variant_01HES9RPDZKQ95E57E6NF7C1TH';
const TGEC02 = 'variant_01HSSZZ0J6R8TNGCZVYEF1MGH0';
const TGEB02 = 'variant_01HSSZZ0FYVJKTBDCGWDH9R2QG';

// MM-ACC
// const emailAdress = 'generic.outlet.contact1@hnk-oms.com';
// const customerId = 'cus_01HDA861ZFMK3NB0N6GWN7G4NE';
// const depotId = 'depot_01HD15W71C0WNKKHRC08HS5G9E';
// const outletId = 'outlet_01HD5JF0SESFWCY8EKDYQ3X4RG';
// const region_id = 'reg_01HD15A159770F707ZQ5EA9FBA';
// const option_id = 'so_01HD15BDWXVVDQD8Q69C5059A1';
// const sku_NCFTGCBS01 = 'variant_01HD1BZE7C38MC7SY8SBAGCJBS';
// const sku_NKFABCKS01 = 'variant_01HD1BMVCC8KZMD83BQEWWC05Y';
// const sku_NPCTGOCL01 = 'variant_01HD1BZAQ2Y4SAFZDYED503QQS';

//ID
// export default function () {
//   const payload = JSON.stringify({
//     email: "adminoms@oms.com",
//     password: "Pass@1234",
//   });

//   const payloadCreateOrder = JSON.stringify({
//     email: `${emailAdress}`,
//     items: [
//       {
//         quantity: 1,
//         variant_id: `${sku_10163}`
//       },
//       {
//         quantity: 99,
//         variant_id: `${sku_53993}`
//       }
//     ],
//     metadata: {
//       source_system: "OMS",
//     },
//     order_type: "standard", //returned or standard
//     region_id: `${region_id}`,
//     shipping_methods: [
//       {
//         option_id: `${option_id}`
//       }
//     ],
//     shipping_address: {
//       address_1: "JLN RAYA ULUWATU II DEPAN POLTEK UNUD",
//       first_name: null,
//       last_name: null,
//       city: null,
//       postal_code: "30101",
//       country_code: "id",
//     },
//     billing_address: {
//       address_1: "JLN RAYA ULUWATU II DEPAN POLTEK UNUD",
//       first_name: null,
//       last_name: null,
//       city: null,
//       postal_code: "30101",
//       country_code: "id",
//     },
//     customer_id: `${customerId}`,
//     depot_id: `${depotId}`,
//     outlet_id: `${outletId}`
//   });

//   const params = {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     tags: {
//       "my-custom-tag": "auth-api",
//     },
//   };

//   // send a post request and save response as a variable
//   // const res = http.post(url, payload, params);
//   const res = http.post(`${baseUrl}/${authUrl}`, payload, params);
//   sleep(1);

//   check(res, {
//     "response code was 200": (res) =>
//       res.status == 200,
//   });

//   check(res, {
//     "verify Login success": (r) =>
//       r.body.includes('user'),
//   });

//   const res1 = http.post(`${baseUrl}/${createUrl}`, payloadCreateOrder, params);
//   sleep(2);

//   // Log the request body
//   // console.log(res1.body);

//   check(res1, {
//     "response code was 200": (res) =>
//       res.status == 200,
//   });

//   check(res1, {
//     'verify Create success': (r) =>
//       r.body.includes('order'),
//   });
// }

//MM
export default function () {
  const payload = JSON.stringify({
    email: "mm_adminoms@oms.com",
    password: "Pass@1234",
  });

  const payloadCreateOrder = JSON.stringify({
    email: `${emailAdress}`,
    items: [
      {
        quantity: 1,
        variant_id: `${sku_NCFTGCBS01}`
      },
      {
        quantity: 99,
        variant_id: `${sku_NKFABCKS01}`
      }
    ],
    metadata: {
      source_system: 'OMS',
    },
    order_type: 'standard', //returned or standard
    region_id: `${region_id}`,
    shipping_methods: [
      {
        option_id: `${option_id}`
      }
    ],
    shipping_address: {
      address_1: 'No.166, Shwegoneding Road, Bahan',
      first_name: null,
      last_name: null,
      city: 'Yangon',
      postal_code: 'MMR013044',
      country_code: 'mm'
    },
    billing_address: {
      address_1: 'No.166, Shwegoneding Road, Bahan',
      first_name: null,
      last_name: null,
      city: 'Yangon',
      postal_code: 'MMR013044',
      country_code: 'mm'
    },
    customer_id: `${customerId}`,
    depot_id: `${depotId}`,
    outlet_id: `${outletId}`
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: {
      "my-custom-tag": "auth-api",
    },
  };

  // send a post request and save response as a variable
  // const res = http.post(url, payload, params);
  const res = http.post(`${baseUrl}/${authUrl}`, payload, params);
  sleep(1);

  check(res, {
    "response code was 200": (res) =>
      res.status == 200,
  });

  check(res, {
    "verify Login success": (r) =>
      r.body.includes('user'),
  });

  const res1 = http.post(`${baseUrl}/${createUrl}`, payloadCreateOrder, params);
  sleep(1);

  // Log the request body
  console.log(res1.body);

  check(res1, {
    "response code was 200": (res) =>
      res.status == 200,
  });

  check(res1, {
    'verify Create success': (r) =>
      r.body.includes('order'),
  });
}

export function handleSummary(data) {
  return {
    'TestSummaryReport.html': htmlReport(data, { debug: false }) //true
  }
}