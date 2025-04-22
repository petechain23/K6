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

    //Generate invoice
    const payloadGenerateInvoice = JSON.stringify({
      order_ids: [
        `${order_Id}`
      ]
    });

    //Order extended status
    const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivered'];
    //Check if Order is valid to Update Status
    //const checkOrderStatus = http.get(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system`,
      //{ headers: { cookies: cookies, 'Content-Type': 'application/json' } });

    const checkOrderStatus = http.get(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,refundable_amount,refunded_total,refunds,location_id`,
        { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    const body1 = JSON.parse(checkOrderStatus.body)
    const extendedStatus1 = body1.order.extended_status;
    const display_id1 = body1.order.display_id
    // console.log('Update Order Status - checkOrderStatusIsValid: ', extendedStatus);
    if (arrStatus.includes(extendedStatus1)) {
      console.log('Order Status is Invalid, No Update Performed:', display_id1);
    }
    else {
      for (let i = 0; i < arrStatus.length; i++) {
        // console.log(`status is: ${arrStatus[i]}`)
        //Update Order Status
        const payloadUpdateOrderStatus = JSON.stringify({
          order_ids: [
            //   "order_01HV6526JPFB5B3F8QNW616Q5H"
            `${order_Id}`
          ],
          status: `${arrStatus[i]}`
        });

        const res = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, payloadUpdateOrderStatus, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
        const body = JSON.parse(res.body)
        const extendedStatus = body.saved[0].extended_status;
        // console.log('Order Update - Order number to be updated: ', body.saved[0].display_id);
        if (!res.body) {
          console.log(`Empty Response Body for Request`, res.status);
          sleep(2);
        } else {
          // console.log('Order Update - Order number updated successfully: ', body.saved[0].display_id);
          // console.log('Order Update - Extended Status: ', extendedStatus);
          check(res, {
            'Order Update - verify response status': (r) => r.status === 201,
            'Order Update - verify update successfully': (r2) => extendedStatus === `${arrStatus[i]}`
          });
          updateOrderResponseTime.add(res.timings.duration, { vu: vuID });
          updateOrderSuccessRate.add(res.status === 201, { vu: vuID });
          updateOrderRequestCount.add(1, { vu: vuID });
          sleep(2);
        }
      };

      //Generate invoice
      const res5 = http.post(`${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`, payloadGenerateInvoice, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
      const body5 = JSON.parse(res5.body)
      sleep(2);
      // const display_id5 = body5.downloaded[0].invoice.order.display_id //x.downloaded[0].invoice.order.display_id
      const iExtendedStatus = body5.downloaded[0].invoice.status; //x.downloaded[0].invoice.order.extended_status
      const invoiceStatus = body5.downloaded[0].invoice.order.invoices[0].status; //x.downloaded[0].invoice.order.invoices[0].status
      // console.log('Generate invoice - Order number to be invoiced: ', display_id5);
      if (!res5.body) {
        console.log(`Empty Response Body for Request`, res5.status);
        sleep(2);
      }
      else {
        // console.log('Generate invoice - Order number invoiced successfully: ', display_id5);
        check(res5, {
          'Generate invoice - verify response status': (r) => r.status === 201,
          'Generate invoice - verify update successfully': (r2) => iExtendedStatus === `${arrStatus[i]}`,
          'Generate invoice - verify invoiced successfully': (r2) => invoiceStatus === 'delivered'
        });
        generateInvoiceTime.add(res5.timings.duration, { vu: vuID });
        generateInvoiceSuccessRate.add(res5.status === 201, { vu: vuID });
        generateInvoiceRequestCount.add(1, { vu: vuID });
        sleep(2);
      }
    }
  });
}