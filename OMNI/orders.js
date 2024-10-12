import http from 'k6/http';
import { group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// not using SharedArray here will mean that the code in the function call (that is what loads and
// parses the csv) will be executed per each VU which also means that there will be a complete copy
// per each VU
const csvData = new SharedArray('order ID', function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('./orderId.csv'), { header: true }).data;
  });

// Create custom trends
const orderCreateLatency = new Trend('order_create_duration');
const orderEditLatency = new Trend('order_edit_duration');
const createUrl = 'admin/orders/create'
const editUrl = '/admin/orders/edit'
const listUrl = '/admin/orders'
const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';

const params = {
    headers: {
        "Content-Type": "application/json",
    },
};

// export function orderCreate(baseUrl) {
//     // group("Coinflip game", function () {
//     //     // save response as variable
//     //     let res = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
//     //     // add duration property to metric
//     //     orderCreateLatency.add(res.timings.duration);
//     //     sleep(1);
//     //     // mutate for new request
//     //     res = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
//     //     // add duration property to metric
//     //     orderCreateLatency.add(res.timings.duration);
//     //     sleep(1);
//     // });

//     group('order_create', function () {
//         // ...
//         let res0 = http.get(`${baseUrl}/${createUrl}`);

//         const params = {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         };

//         const payloadCreateOrder = JSON.stringify({
//             email: `${emailAdress}`,
//             items: [
//                 {
//                     quantity: 1,
//                     variant_id: `${sku_NCFTGCBS01}`
//                 },
//                 {
//                     quantity: 99,
//                     variant_id: `${sku_NKFABCKS01}`
//                 }
//             ],
//             metadata: {
//                 source_system: 'OMS',
//             },
//             order_type: 'standard', //returned or standard
//             region_id: `${region_id}`,
//             shipping_methods: [
//                 {
//                     option_id: `${option_id}`
//                 }
//             ],
//             shipping_address: {
//                 address_1: 'No.166, Shwegoneding Road, Bahan',
//                 first_name: null,
//                 last_name: null,
//                 city: 'Yangon',
//                 postal_code: 'MMR013044',
//                 country_code: 'mm'
//             },
//             billing_address: {
//                 address_1: 'No.166, Shwegoneding Road, Bahan',
//                 first_name: null,
//                 last_name: null,
//                 city: 'Yangon',
//                 postal_code: 'MMR013044',
//                 country_code: 'mm'
//             },
//             customer_id: `${customerId}`,
//             depot_id: `${depotId}`,
//             outlet_id: `${outletId}`
//         });

//         const res1 = http.post(`${baseUrl}/${createUrl}`, payloadCreateOrder, params);
//         sleep(1);

//         // Log the request body
//         // console.log(res1.body);

//         check(res1, {
//             "response code was 200": (res) =>
//                 res.status == 200,
//         });

//         check(res1, {
//             'verify Create success': (r) =>
//                 r.body.includes('order'),
//         });
//     });
//     group('order_change_status_to_processing', function () {
//         // ...
//     });
//     group('order_change_status_to_invoices', function () {
//         // ...
//     });
//     group('order_change_status_to_dda', function () {
//         // ...
//     });
//     group('order_change_status_to_shipped', function () {
//         // ...
//     });
//     group('order_change_status_to_delivered', function () {
//         // ...
//     });
//     group('order_change_status_to_paid', function () {
//         // ...
//     });
// }

// let order_ids = [
//     'order_01J7FK80APHRJ5F3BNNT7JRY8X', 'order_01J7MQWC346V6W0N1T12W6V3T0'
// ];

export function orderEdit(baseUrl) {
    let order_ids = [
        'order_01J7FK80APHRJ5F3BNNT7JRY8X', 'order_01J7MQWC346V6W0N1T12W6V3T0'
    ];

    for (let index = 0; index <= order_ids.length; index++) {
        let order_id = order_ids[index];
        console.log (order_id)
        // group('order_edit', function () {
        // const payloadorderEdit = JSON.stringify({
        //     metadata: {
        //         coupon_codes: []
        //     },
        //     items: [
        //         {
        //             variant_id: "variant_01H729MHHAW56JTRXCC8HYCV1X",
        //             quantity: 92,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H729MHHAW56JTRXCC8HYCV1X",
        //             quantity: 480,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H771AV5J5D62ZAKQ340JQJ7S",
        //             quantity: 5,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H7712GPV9HKJH9JDST5HV5XF",
        //             quantity: 3,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H7717FZZYW6JD56EZP6D58YF",
        //             quantity: 80,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H7719AJBGKM6H0H488XM9KN8",
        //             quantity: 3,
        //             metadata: {
        //                 item_category: "YVGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H77192YY9TWRM0GB6F479YQX",
        //             quantity: 23,
        //             metadata: {
        //                 item_category: "YVGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H6DTJPTN4HQYKAGN9KRVZ4YY",
        //             quantity: 20,
        //             metadata: {
        //                 item_category: "YVGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H5PMESX1AR52H7BJ4CTHHE80",
        //             quantity: 5,
        //             metadata: {
        //                 item_category: "YVGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H771AVVG9NQMV4VZZ2TK7DTB",
        //             quantity: 5,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H7717M79C5D5DT7HSQDF4D1J",
        //             quantity: 120,
        //             metadata: {
        //                 item_category: "YLGA"
        //             }
        //         },
        //         {
        //             variant_id: "variant_01H5PS9EVF5915DRCDD8NDKJAT",
        //             quantity: 12,
        //             metadata: {
        //                 item_category: "YVGO"
        //             }
        //         }
        //     ],
        //     location_id: "sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"
        // });

        // let orderId = Math.floor(Math.random() * csvData.length);
        // console.log(`id: ${csvData[random].order_id}`);

        // let orderID = JSON.stringify(orderId)
        // console.log('id 2:', `${orderID}`);

        let res1 = http.post(`${baseUrl}/${listUrl}/${order_id}`, params);
        // orderEditLatency.add(res1.timings.duration);
        sleep(1);
        
        // // Log the request body
        console.log(res1.body);

        check(res1, {
            "response code was 200": (res) => res.status === 200,
        });

        // check(res1, {
        //     'Edit order successed': (r) =>
        //         r.body.includes(`${orderId.}`),
        // });

    // });
        
    }
    
}