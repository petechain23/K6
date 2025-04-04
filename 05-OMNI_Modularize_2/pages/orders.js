import { sleep, check } from 'k6'
import http from 'k6/http'
import {
    BASE_URL, ORDER_CREATE_URL,
    masterData, orderCreateResponseTime, orderCreateSuccessRate, orderCreateRequestCount
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
    const payloadCreateOrder = JSON.stringify({
        order_type: 'standard',
        email: 'generic.outlet.contact1@hnk-oms.com',
        items: [
            {
                variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
                quantity: 4, //4, 2
                metadata: {}
            },
            {
                variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
                quantity: 1, //1, 2
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
        depot_id: 'depot_01HES9APM60R2D27MW39GHT6YC',
        outlet_id: `${outletId}`,
        metadata: {
            source_system: 'OMS'
        },
        location_id: 'sloc_01HEW6AGSSH0GCG8XZDC1A7YH0'
    });

    const res = http.post(`${BASE_URL}/${ORDER_CREATE_URL}`, payloadCreateOrder, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    // console.log('Create Order - Response status: ', res.status);
    const body = JSON.parse(res.body)
    // console.log('Create Order - Response id: ', body.order.id);
    // console.log('Create Order - Response display_id: ', body.order.display_id);
    if (!res.body || res.status === 0) {
        console.log(`Empty Response Body for Request`);
    } else {
        check(res, {
            'Create Order - verify response status': (r) => r.status === 200,
            'Create Order - verify orders successfully': (r2) => r2.body.includes('display_id'),
            'Create Order - verify promotion code included': (r2) => r2.body.includes('PROMO00258_216')
        });
        orderCreateResponseTime.add(res.timings.duration, { vu: vuID });
        orderCreateSuccessRate.add(res.status === 200, { vu: vuID });
        orderCreateRequestCount.add(1, { vu: vuID });
        // sleep(2);
    }
}