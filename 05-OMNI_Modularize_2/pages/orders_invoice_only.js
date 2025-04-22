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
  pendingToProcessingResponseTime, pendingToProcessingRequestCount, pendingToProcessingSuccessRate,
  updateInventoryCheckResponseTime, updateInventoryCheckRequestCount, updateInventoryCheckSuccessRate,
  updateCreditCheckResponseTime, updateCreditCheckRequestCount, updateCreditCheckSuccessRate,
  updatePromotionCheckResponseTime, updatePromotionCheckRequestCount, updatePromotionCheckSuccessRate
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

    // Generate invoice
    const payloadGenerateInvoice = JSON.stringify({
      order_ids: [
        `${order_Id}`
      ]
    });
    //Generate invoice
    const res5 = http.post(`${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`, payloadGenerateInvoice, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    const body5 = JSON.parse(res5.body)
    sleep(2);
    const display_id5 = body5.downloaded[0].invoice.order.display_id //x.downloaded[0].invoice.order.display_id
    // const iExtendedStatus = body5.downloaded[0].invoice.status; //x.downloaded[0].invoice.order.extended_status
    const invoiceStatus = body5.downloaded[0].invoice.order.invoices[0].status; //x.downloaded[0].invoice.order.invoices[0].status
    // console.log('Generate invoice - Order number to be invoiced: ', display_id5);
    if (!res5.body) {
      console.log(`Empty Response Body for Request`, res5.status);
      sleep(2);
    }
    else {
      console.log('Generate invoice - Order number invoiced successfully: ', display_id5);
      check(res5, {
        'Generate invoice - verify response status': (r) => r.status === 201,
        'Generate invoice - verify invoice successfully': (r2) => invoiceStatus === 'open'
      });
      generateInvoiceTime.add(res5.timings.duration, { vu: vuID });
      generateInvoiceSuccessRate.add(res5.status === 201, { vu: vuID });
      generateInvoiceRequestCount.add(1, { vu: vuID });
      sleep(2);
    }
  });
}