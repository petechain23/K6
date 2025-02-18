import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { BASE_URL, 
  ORDER_EDIT_URL, 
  ORDER_EXTEND_STATUS_UPDATE_URL, 
  ORDER_PENDINGTOPROCESSING_URL,
  ORDER_INVENTORY_CHECK_URL,
  ORDER_CREDIT_CHECK_URL,
  ORDER_PROMOTION_CHECK_URL,
  ORDER_INVOICE_GENERATE_URL,
  orderId } from '../config.js';
import { Trend } from 'k6/metrics';

// Create custom trends
const updateOrder = new Trend('update_order_duration');
const pendingToProcessing = new Trend('update_PendingToProcessing_duration');
const updateInventoryCheck = new Trend('update_InventoryCheck_duration');
const updateCreditCheck = new Trend('update_CreditCheck_duration');
const updatePromotionCheck = new Trend('update_PromotionCheck_duration');
const updateOrderTrend = new Trend('update_order_duration');
const updateOrderTrend = new Trend('update_order_duration');
const updateOrderTrend = new Trend('update_order_duration');

export function orderEdit(cookies) {

  //Pick a random order_Id
  const randomOrderId = orderId[Math.floor(Math.random() * orderId.length)];
  const order_Id = randomOrderId.order_Id;
  // console.log('Random Outlet: ', outletId);

  const payloadPendingToProcessing = JSON.stringify({
      "is_processing": true
  });

  const payloadEditOrder = JSON.stringify({
    "order_ids": [
        //   "order_01HV6526JPFB5B3F8QNW616Q5H"
        `${order_Id}`
    ],
    "status": `${order_status}`
  });

  group("Update_order_status", function () {
    //Pending to Processing
    const res1 = http.post(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}}`, payloadPendingToProcessing,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    pendingToProcessing.add(res1.timings.duration);

    //Inventory check
    const res2 = http.post(`${BASE_URL}/${ORDER_EDIT_URL}}`, ORDER_INVENTORY_CHECK_URL,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateInventoryCheck.add(res2.timings.duration);

    //Credit check
    const res3 = http.post(`${BASE_URL}/${ORDER_EDIT_URL}}`, ORDER_CREDIT_CHECK_URL,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateOrderTrend.add(res2.timings.duration);
    
    //Promotion check
    const res4 = http.post(`${BASE_URL}/${ORDER_EDIT_URL}}`, ORDER_PROMOTION_CHECK_URL,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateOrderTrend.add(res2.timings.duration);
    
    //Update status
    const res = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}}`, payloadEditOrder,  { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateOrderTrend.add(res.timings.duration);
    const body = JSON.parse(res.body)
    // console.log('Update Order Status - order_Id: ', body.order.id);
    console.log('Update Order Status - display_id: ', body.order.display_id);
    check(res, {
      // 'verify status equals 200': (res) => res.status.toString() === '200',
      'Update Order Status - verify response status': (r) => r.status === 201,
      'Update Order Status - verify update successfully': (r2) => r2.body.saved[0].status.toString() === `${order_status}`
    });
    // sleep(2);
}



// Create custom trends
const coinflipLatency = new Trend('coinflip_duration');

export function coinflip(baseUrl) {
    group("Coinflip game", function () {
        // save response as variable
        let res = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
        check(res, {
            "is status 200": (r) => r.status === 200,
        });
        console.log(`Response time was heads: ${res.timings.duration} ms`);
        // add duration property to metric
        coinflipLatency.add(res.timings.duration);
        sleep(1);
        // mutate for new request
        res = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
        check(res, {
            "is status 200": (r) => r.status === 200,
        });
        console.log(`Response time was tails: ${res.timings.duration} ms`);
        // add duration property to metric
        coinflipLatency.add(res.timings.duration);
        sleep(1);
    });
}