import { sleep, check, group } from 'k6'
import http from 'k6/http'
import {
  BASE_URL,
  ORDER_EXTEND_STATUS_UPDATE_URL,
  ORDER_PENDINGTOPROCESSING_URL,
  ORDER_INVENTORY_CHECK_URL,
  ORDER_CREDIT_CHECK_URL,
  ORDER_PROMOTION_CHECK_URL,
  // ORDER_INVOICE_GENERATE_URL, 
  //orderId
} from '../config.js';
import { Trend } from 'k6/metrics';

// Create custom trends
const updateOrderStatus = new Trend('update_order_duration');
const pendingToProcessing = new Trend('update_PendingToProcessing_duration');
const updateInventoryCheck = new Trend('update_InventoryCheck_duration');
const updateCreditCheck = new Trend('update_CreditCheck_duration');
const updatePromotionCheck = new Trend('update_PromotionCheck_duration');
export function orderUpdateStatus(cookies) {

  //Pick a random order_Id
  // const randomOrderId = orderId[Math.floor(Math.random() * orderId.length)];
  // const order_Id = randomOrderId.order_Id;
  const order_Id = 'order_01JMBCXZX7DFNDDH6H19D8K1XE'
  // console.log('Random Outlet: ', outletId);

  //Pending to Processing
  const payloadPendingToProcessing = JSON.stringify({
    is_processing: true
  });

  // //Update Order Status
  // const payloadUpdateOrderStatus = JSON.stringify({
  //   "order_ids": [
  //     //   "order_01HV6526JPFB5B3F8QNW616Q5H"
  //     `${order_Id}`
  //   ],
  //   "status": `${order_status}`
  // });

  group("Group: Update_order_status", function () {
    // Pending to Processing
    const res1 = http.post(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}`, payloadPendingToProcessing, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    pendingToProcessing.add(res1.timings.duration);

    //Inventory check
    const res2 = http.post(`${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateInventoryCheck.add(res2.timings.duration);

    //Credit check
    const res3 = http.post(`${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateCreditCheck.add(res3.timings.duration);

    //Promotion check
    const res4 = http.post(`${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updatePromotionCheck.add(res4.timings.duration);

    //Update status - confirmed
    //Update status - ready_for_delivery
    //Update status - shipped
    //Update status - delivery
    //Update status - paid
    const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivery', 'paid'];
    // let arrStatus = arrayStatus.length;
    for (let i = 0; i < arrStatus.length; i++) {
      console.log(`status is: ${arrStatus[i]}`)

      //Update Order Status
      const payloadUpdateOrderStatus = JSON.stringify({
        order_ids: [
          //   "order_01HV6526JPFB5B3F8QNW616Q5H"
          `${order_Id}`
        ],
        status: `${arrStatus[i]}`
      });

      const res = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, payloadUpdateOrderStatus, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
      updateOrderStatus.add(res.timings.duration);
      const body = JSON.parse(res.body)
      // console.log('Update Order Status - order_Id: ', body.order.id);
      // console.log('Update Order Status - display_id: ', body.order.display_id); //orderResponse.saved[0].extended_status;
      check(res, {
        'Update Order Status - verify response status': (r) => r.status === 201,
        'Update Order Status - verify update successfully': (r2) => r2.body.includes(`${arrStatus[i]}`)
      });
      // sleep(2);
    };
  });
}

// // Create custom trends
// const coinflipLatency = new Trend('coinflip_duration');

// export function coinflip(baseUrl) {
//     group("Coinflip game", function () {
//         // save response as variable
//         let res = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
//         check(res, {
//             "is status 200": (r) => r.status === 200,
//         });
//         console.log(`Response time was heads: ${res.timings.duration} ms`);
//         // add duration property to metric
//         coinflipLatency.add(res.timings.duration);
//         sleep(1);
//         // mutate for new request
//         res = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
//         check(res, {
//             "is status 200": (r) => r.status === 200,
//         });
//         console.log(`Response time was tails: ${res.timings.duration} ms`);
//         // add duration property to metric
//         coinflipLatency.add(res.timings.duration);
//         sleep(1);
//     });
// }