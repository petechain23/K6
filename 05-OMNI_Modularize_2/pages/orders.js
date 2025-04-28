import { sleep, check } from 'k6'
import http from 'k6/http'
import {
    BASE_URL, ORDER_CREATE_URL,
    masterData, customTrendRequestCount, customTrendResponseTime, customTrendSuccessRate
} from '../config.js';

export function orderCreate(cookies) {
    const vuID = __VU;

    // Pick a random outletId
    const { outletId } = masterData[Math.floor(Math.random() * masterData.length)];

    // Order payload config (ID-QA example, use flags/env to switch if needed)
    const payload = {
        order_type: 'standard',
        email: 'nengahpuspayoga23@yopmail.com',
        items: [
            { variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80', quantity: 1, metadata: {} },
            { variant_id: 'variant_01H5PMH3V5H3BQDM49D8K88MMJ', quantity: 2, metadata: {} },
            { variant_id: 'variant_01H5XTJ97RNCWNM9HAR02D257T', quantity: 3, metadata: {} },
            { variant_id: 'variant_01H5XWXT9KJ7DN1MFSVX778KDA', quantity: 4, metadata: {} }
        ],
        region_id: 'reg_01H5P3E6X97YGENVSW4Z7A5446',
        shipping_methods: [{ option_id: 'so_01H5P53FY82T6HVEPB37Z8PFPZ' }],
        shipping_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
        billing_address: { address_1: 'BR. UMA DAWE PEJENG KANGIN - TAMPAKSIRING 3022302738 Block A TAMPAK SIRING - GIANYAR, 30104', country_code: 'id', first_name: 'NENGAH', last_name: '-' },
        customer_id: 'cus_01JM74671R0812YXBZEP4W2KKC',
        depot_id: 'depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        outlet_id: outletId,
        include_brand: true,
        metadata: { source_system: 'OMS' },
        location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9'
    };

    const res = http.post(`${BASE_URL}/${ORDER_CREATE_URL}`, JSON.stringify(payload), {
        headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    if (!res.body) {
        console.error(`Empty response body. Status: ${res.status}`);
        return;
    }

    const body = JSON.parse(res.body);

    check(res, {
        'Order Create - status is 200': (r) => r.status === 200,
        'Order Create - contains display_id': (r) => r.body.includes('display_id')
    });

    customTrendResponseTime.add(res.timings.duration, { vu: vuID });
    customTrendSuccessRate.add(res.status === 200, { vu: vuID });
    customTrendRequestCount.add(1, { vu: vuID });

    sleep(2);
}
