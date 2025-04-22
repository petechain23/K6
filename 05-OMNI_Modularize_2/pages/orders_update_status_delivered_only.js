import { sleep, check, group } from 'k6'
import http from 'k6/http'
import {
  BASE_URL,
  ORDER_EXTEND_STATUS_UPDATE_URL,
  ORDER_PENDINGTOPROCESSING_URL,
  ORDER_INVENTORY_CHECK_URL,
  ORDER_CREDIT_CHECK_URL,
  ORDER_PROMOTION_CHECK_URL,
  ORDER_INVOICE_GENERATE_URL,
  orderId2,
  updateOrderResponseTime, updateOrderSuccessRate, updateOrderRequestCount,
  generateInvoiceTime, generateInvoiceSuccessRate, generateInvoiceRequestCount, 
  pendingToProcessingResponseTime,pendingToProcessingRequestCount,pendingToProcessingSuccessRate,
  updateInventoryCheckResponseTime,updateInventoryCheckRequestCount,updateInventoryCheckSuccessRate,
  updateCreditCheckResponseTime,updateCreditCheckRequestCount,updateCreditCheckSuccessRate,
  updatePromotionCheckResponseTime,updatePromotionCheckRequestCount,updatePromotionCheckSuccessRate
} from '../config.js';

export function orderUpdateStatus(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);
  //Pick a random order_Id
  const randomOrderId = orderId2[Math.floor(Math.random() * orderId2.length)];
  const order_Id = randomOrderId.order_Id;
  // const order_Id = 'order_01JMBCX58NX6K94ER4WGVVN9CV'
  // console.log('Random order_Id: ', outletId);

  //Pending to Processing
  const payloadPendingToProcessing = JSON.stringify({
    is_processing: true
  });

  group("Update_order_status", function () {
    // Pending to Processing
    const res1 = http.post(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}`, payloadPendingToProcessing, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    pendingToProcessingResponseTime.add(res1.timings.duration, { vu: vuID });
    pendingToProcessingSuccessRate.add(res1.status === 200, { vu: vuID });
    pendingToProcessingRequestCount.add(1, { vu: vuID });

    //Inventory check
    const res2 = http.post(`${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateInventoryCheckResponseTime.add(res2.timings.duration, { vu: vuID });
    updateInventoryCheckSuccessRate.add(res2.status === 200, { vu: vuID });
    updateInventoryCheckRequestCount.add(1, { vu: vuID });

    //Credit check
    const res3 = http.post(`${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updateCreditCheckResponseTime.add(res3.timings.duration, { vu: vuID });
    updateCreditCheckSuccessRate.add(res3.status === 200, { vu: vuID });
    updateCreditCheckRequestCount.add(1, { vu: vuID });

    //Promotion check
    const res4 = http.post(`${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${order_Id}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    updatePromotionCheckResponseTime.add(res4.timings.duration, { vu: vuID });
    updatePromotionCheckSuccessRate.add(res4.status === 200, { vu: vuID });
    updatePromotionCheckRequestCount.add(1, { vu: vuID });

    //Order extended status
    const payloadUpdateOrderStatus = JSON.stringify({
      order_ids: [
        //   "order_01HV6526JPFB5B3F8QNW616Q5H"
        `${order_Id}`
      ],
      status: 'delivered'
    });

    const res = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, payloadUpdateOrderStatus, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    const body = JSON.parse(res.body)
    const extendedStatus = body.saved[0].extended_status;
    console.log('Order Update - Order number to be updated: ', body.saved[0].display_id);
    if (!res.body) {
      console.log(`Empty Response Body for Request`, res.status);
      sleep(2);
    } else {
      console.log('Order Update - Order number updated successfully: ', body.saved[0].display_id);
      console.log('Order Update - Extended Status: ', extendedStatus);
      check(res, {
        'Order Update - verify response status': (r) => r.status === 201,
        'Order Update - verify update successfully': (r2) => extendedStatus === 'delivered'
      });
      updateOrderResponseTime.add(res.timings.duration, { vu: vuID });
      updateOrderSuccessRate.add(res.status === 201, { vu: vuID });
      updateOrderRequestCount.add(1, { vu: vuID });
      sleep(2);
    }
  });
}