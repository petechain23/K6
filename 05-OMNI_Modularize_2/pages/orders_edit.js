import { sleep, check, group } from 'k6'
import http from 'k6/http'
import {
  BASE_URL, ORDER_EDIT_URL, orderId,
  editOrderResponseTime, editOrderSuccessRate, editOrderRequestCount,
  customTrendRequestCount, customTrendResponseTime, customTrendSuccessRate
} from '../config.js';

import { addResponseTimeMetric } from '../main.js';

export function orderEdit(cookies) {
  const vuID = __VU;

  const randomOrder = orderId[Math.floor(Math.random() * orderId.length)];
  const order_Id = randomOrder?.order_Id;

  if (!order_Id) {
    console.error(`VU#${vuID}: No order_Id available.`);
    return;
  }

  const payload = {
    metadata: {
      external_doc_number: 'editing order',
    },
    items: [
      { variant_id: 'variant_01H771AV5J5D62ZAKQ340JQJ7S', quantity: 1, metadata: { item_category: 'YLGA' } },
      { variant_id: 'variant_01H729MHHAW56JTRXCC8HYCV1X', quantity: 8, metadata: { item_category: 'YLGA' } },
      { variant_id: 'variant_01H7717GHMWJNHPHAEJVXRN8CS', quantity: 60, metadata: { item_category: 'YLGA' } },
      { variant_id: 'variant_01H7717FZZYW6JD56EZP6D58YF', quantity: 16, metadata: { item_category: 'YLGA' } },
      { variant_id: 'variant_01H7717FZZYW6JD56EZP6D58YF', quantity: 1, metadata: { item_category: 'YRLN' } },
      { variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80', quantity: 1, metadata: { item_category: 'YVGA' } },
      { variant_id: 'variant_01H77192YY9TWRM0GB6F479YQX', quantity: 2, metadata: { item_category: 'YVGA' } },
      { variant_id: 'variant_01HAB20FVGTTJVH12WRE725AC0', quantity: 3, metadata: { item_category: 'YVGA' } },
      { variant_id: 'variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9', quantity: 4, metadata: { item_category: 'YVGO' } },
      { variant_id: 'variant_01H5PMH3V5H3BQDM49D8K88MMJ', quantity: 5, metadata: { item_category: 'YVGA' } },
    ],
    location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9',
  };

  const url = `${BASE_URL}/${ORDER_EDIT_URL}/${order_Id}`;

  const res = http.post(url, JSON.stringify(payload), { 
    headers: { cookies: cookies, 'Content-Type': 'application/json' }});

  editOrderRequestCount.add(1, { vu: vuID });
  editOrderResponseTime.add(res.timings.duration, { vu: vuID });
  editOrderSuccessRate.add(res.status === 200, { vu: vuID });
  addResponseTimeMetric('Order Edit', res.timings.duration, vuID, res.status);

  let isValid = false;
  if (res.status === 200 && res.body) {
    try {
      const body = JSON.parse(res.body);
      const displayId = body?.order?.display_id;
      const extDoc = body?.order?.metadata?.external_doc_number;

      isValid = extDoc === 'editing order';

      check(res, {
        'Order Edit - status is 200': () => res.status === 200,
        'Order Edit - metadata matches': () => isValid,
      });

      if (!isValid) {
        console.warn(`VU#${vuID}: Order ${displayId} did not update metadata as expected.`);
      }

    } catch (e) {
      console.error(`VU#${vuID}: Failed to parse JSON response: ${e.message}`);
    }
  } else {
    console.error(`VU#${vuID}: Unexpected response - Status: ${res.status}`);
  }

  sleep(2); // Short think time between iterations
}
