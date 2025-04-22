import { sleep, check } from 'k6'
import http from 'k6/http'
import {
    BASE_URL, ORDER_CREATE_URL,
    masterData, customTrendRequestCount, customTrendResponseTime, customTrendSuccessRate
} from '../config.js';

// Create custom trends
// const createOrderTrend = new Trend('create_order_duration');
export function orderCreate(cookies) {
    const vuID = __VU;
    // console.log(`VU#${__VU}`);
    // //Pick a random outletId
    const randomOutlet = masterData[Math.floor(Math.random() * masterData.length)];
    const outletId = randomOutlet.outletId;
    // console.log('Random Outlet: ', outletId);
    // MM-prod 1413 Orders/DAY
    // const payloadCreateOrder = JSON.stringify({
    //     order_type: 'standard',
    //     email: 'generic.outlet.contact1@hnk-oms.com',
    //     items: [
    //         {
    //             variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
    //             quantity: 4, //4, 2
    //             metadata: {}
    //         },
    //         {
    //             variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
    //             quantity: 1, //1, 2
    //             metadata: {
    //                 // promotionCodes: 'PROMO00258_216',
    //                 // item_category: 'YSRG',
    //                 // promotionOverride: false
    //             }
    //         }
    //     ],
    //     region_id: 'reg_01HES8WCK97EWB0BZSXT60DSA2',
    //     shipping_methods: [
    //         {
    //             option_id: 'so_01HF3ZZTSBNP3FBMN82NE10C0T'
    //         }
    //     ],
    //     shipping_address: {
    //         address_1: 'No.1,Bld -11,Yankin Rd,1 Qtr',
    //         country_code: 'mm',
    //         first_name: 'Generic Contact1',
    //         last_name: 'Generic Contact1'
    //     },
    //     billing_address: {
    //         address_1: 'No.1,Bld -11,Yankin Rd,1 Qtr',
    //         country_code: 'mm',
    //         first_name: 'Generic Contact1',
    //         last_name: 'Generic Contact1'
    //     },
    //     customer_id: 'cus_01HQSXB1GYPQA43AP9SY3YRRJH',
    //     depot_id: 'depot_01HES9APM60R2D27MW39GHT6YC',
    //     outlet_id: `${outletId}`,
    //     metadata: {
    //         source_system: 'OMS'
    //     },
    //     location_id: 'sloc_01HEW6AGSSH0GCG8XZDC1A7YH0'
    // });

    // MM-ID
    // const payloadCreateOrder = JSON.stringify({

    //     order_type: 'standard',
    //     email: 'generic.outlet.contact1@hnk-oms.com',
    //     items: [
    //         {
    //             variant_id: 'variant_01HES9RS0RYC1ZDQVKQRVZMQ21',
    //             quantity: 4,
    //             metadata: {}
    //         },
    //         {
    //             variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
    //             quantity: 5,
    //             metadata: {}
    //         }
    //     ],
    //     region_id: 'reg_01HES8WCK97EWB0BZSXT60DSA2',
    //     shipping_methods: [
    //         {
    //             option_id: 'so_01HF3ZZTSBNP3FBMN82NE10C0T'
    //         }
    //     ],
    //     shipping_address: {
    //         address_1: 'Bo Gyoke Aung San St',
    //         country_code: 'mm',
    //         first_name: 'Generic Contact1',
    //         last_name: 'Generic Contact1'
    //     },
    //     billing_address: {
    //         address_1: 'Bo Gyoke Aung San St',
    //         country_code: 'mm',
    //         first_name: 'Generic Contact1',
    //         last_name: 'Generic Contact1'
    //     },
    //     customer_id: 'cus_01HQSXB1GYPQA43AP9SY3YRRJH',
    //     depot_id: 'depot_01HES9APM60R2D27MW39GHT6YC',
    //     outlet_id: `${outletId}`,
    //     metadata: {
    //         source_system: 'OMS'
    //     },
    //     location_id: 'sloc_01HEW6AGSSH0GCG8XZDC1A7YH0'

    // });

    //ID-QA (Klungkung-302-BBI-D02-MAIN)
    const payloadCreateOrder = JSON.stringify({
        order_type: 'standard',
        email: 'nengahpuspayoga23@yopmail.com',
        items: [
            {
                variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80',
                quantity: 1,
                metadata: {}
            },
            {
                variant_id: 'variant_01H5PMH3V5H3BQDM49D8K88MMJ',
                quantity: 2,
                metadata: {}
            },
            {
                variant_id: 'variant_01H5XTJ97RNCWNM9HAR02D257T',
                quantity: 3,
                metadata: {}
            },
            {
                variant_id: 'variant_01H5XWXT9KJ7DN1MFSVX778KDA',
                quantity: 4,
                metadata: {}
            }
        ],
        region_id: 'reg_01H5P3E6X97YGENVSW4Z7A5446',
        shipping_methods: [
            {
                option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ'
            }
        ],
        shipping_address: {
            address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104',
            country_code: 'id',
            first_name: 'NENGAH',
            last_name: '-'
        },
        billing_address: {
            address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104',
            country_code: 'id',
            first_name: 'NENGAH',
            last_name: '-'
        },
        customer_id: 'cus_01JM74671R0812YXBZEP4W2KKC',
        depot_id: 'depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        outlet_id: `${outletId}`,
        include_brand: true,
        metadata: {
            source_system: 'OMS'
        },
        location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9'
    });

    //ID-Hotfix
    // const payloadCreateOrder = JSON.stringify({
    //     order_type: 'standard',
    //     email: 'wayansugiartana23@gmail.com',
    //     items: [
    //         {
    //             variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80',
    //             quantity: 1,
    //             metadata: {}
    //         },
    //         {
    //             variant_id: 'variant_01H5PS9EVF5915DRCDD8NDKJAT',
    //             quantity: 2,
    //             metadata: {}
    //         }
    //     ],
    //     region_id: 'reg_01H5P3E6X97YGENVSW4Z7A5446',
    //     shipping_methods: [
    //         {
    //             option_id: 'so_01HB5WGVS4S2RM078NJWCQMYD5'
    //         }
    //     ],
    //     shipping_address: {
    //         address_1: 'RAYA GUNUNG ABANG LODTUNDUH',
    //         country_code: 'id',
    //         first_name: 'Wayan',
    //         last_name: 'Sugiartana'
    //     },
    //     billing_address: {
    //         address_1: 'RAYA GUNUNG ABANG LODTUNDUH',
    //         country_code: 'id',
    //         first_name: 'Wayan',
    //         last_name: 'Sugiartana'
    //     },
    //     customer_id: 'cus_01HGYYE93B39P94P1SV3ECZQZ5',
    //     depot_id: 'depot_01HGYXPR1M5HQ229XGC8RDQSJE',
    //     outlet_id: `${outletId}`,
    //     metadata: {
    //         source_system: 'OMS'
    //     },
    //     location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9'
    // });

    const res = http.post(`${BASE_URL}/${ORDER_CREATE_URL}`, payloadCreateOrder, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    // console.log('Order Create - Response status: ', res.status);
    const body = JSON.parse(res.body)
    // console.log('Order Create - Response id: ', body.order.id);
    // console.log('Order Create - Response display_id: ', body.order.display_id);
    if (!res.body) {
        console.log(`Empty Response Body for Request`, res.status);
    } else {
        check(res, {
            'Order Create - verify response status': (r) => r.status === 200,
            'Order Create - verify orders successfully': (r2) => r2.body.includes('display_id')
            // 'Order Create - verify promotion code included': (r2) => r2.body.includes('PROMO00258_216')
        });
        customTrendResponseTime.add(res.timings.duration, { vu: vuID });
        customTrendSuccessRate.add(res.status === 200, { vu: vuID });
        customTrendRequestCount.add(1, { vu: vuID });
        sleep(2);
    }
}