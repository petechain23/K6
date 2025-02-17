import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { BASE_URL, ORDER_EDIT_URL, orderId } from '../config.js';
import { Trend } from 'k6/metrics';

// Create custom trends
const editOrderTrend = new Trend('edit_order_duration');
export function orderEdit(cookies) {

  //Pick a random order_Id
  const randomOrderId = orderId[Math.floor(Math.random() * orderId.length)];
  const order_Id = randomOrderId.order_Id;
  // console.log('Random Outlet: ', outletId);

  const payloadEditOrder = JSON.stringify({
    metadata: {
      external_doc_number: 'editing order'
    },
    items: [
      {
        variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
        quantity: 4,
        metadata: {
          // item_category: 'YVGO'
        }
      },
      {
        variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
        quantity: 1,
        metadata: {
          item_category: 'YSRG',
          promotionCodes: 'PROMO00258_216',
          promotionOverride: false,
          promoEngine: true
          // item_category: 'YVGO'
        }
      },
      {
        variant_id: 'variant_01HES9RS8GRDQW2Q6CWVCKPKBT',
        quantity: 1,
        metadata: {
          // item_category: 'YVGO'
        }
      }
    ]
  });

  // const res = http.post(`${BASE_URL}/${createUrl}`, payloadCreateOrder, { headers: { 'Cookie': `session=${sessionCookie}`, 'Content-Type': 'application/json' } });
  const res = http.post(`${BASE_URL}/${ORDER_EDIT_URL}/${order_Id}`, payloadEditOrder,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
  editOrderTrend.add(res.timings.duration);
  const body = JSON.parse(res.body)
  console.log('Edit Order - order_Id: ', body.order.id);
  console.log('Edit Order - display_id: ', body.order.display_id);
  check(res, {
    // 'verify status equals 200': (res) => res.status.toString() === '200',
    'Edit Order - verify response status': (r) => r.status === 200,
    'Edit Order - verify update successfully': (r2) => r2.body.includes('editing order')
    // 'verify promotion code included': (r2) => r2.body.includes('PROMO00258_216'), //$.order.items[*].promotion_codes[0]
  });
  sleep(2);
}