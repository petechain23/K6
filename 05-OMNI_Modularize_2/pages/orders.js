import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { BASE_URL, ORDER_CREATE_URL, masterData } from '../config.js';

export function orderCreate(cookies) {
    // //Pick a random outletId
    const randomOutlet = masterData[Math.floor(Math.random() * masterData.length)];
    const outletId = randomOutlet.outletId;
    // console.log('Random Outlet: ', outletId);

    const payloadCreateOrder = JSON.stringify({
        order_type: 'standard',
        email: 'generic.outlet.contact1@hnk-oms.com',
        items: [
            {
                variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
                quantity: 2, //4
                metadata: {}
            },
            {
                variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
                quantity: 2, //1
                metadata: {
                    // promotionCodes: 'PROMO00258_216',
                    // item_category: 'YSRG',
                    // promotionOverride: false
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
        location_id: 'sloc_01HV3J179CG8PSS92N3446W6RQ'
    });

    // const res = http.post(`${BASE_URL}/${ORDER_CREATE_URL}`, payloadCreateOrder, { headers: { 'Cookie': `session=${sessionCookie}`, 'Content-Type': 'application/json' } });
    const res = http.post(`${BASE_URL}/${ORDER_CREATE_URL}`, payloadCreateOrder, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    console.log('Create Order Response status: ', res.status);
    const body = JSON.parse(res.body)
    console.log('Create Order - Response id: ', body.order.id);
    console.log('Create Order - Response display_id: ', body.order.display_id);
    check(res, { 
        'Create Order - verify response status': (r) => r.status === 200,
        'Create Order - verify orders successfully': (r2) => r2.body.includes('display_id'),
        'Create Order - verify promotion code included': (r2) => r2.body.includes('PROMO00258_216')
    });
    sleep(2);
}