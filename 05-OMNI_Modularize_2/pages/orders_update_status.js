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

  // Pick a random order_Id
  const randomOrderId = orderId2[Math.floor(Math.random() * orderId2.length)];
  const order_Id = randomOrderId.order_Id;

  // Pending to Processing payload
  const payloadPendingToProcessing = JSON.stringify({ is_processing: true });

  // Define extended statuses to loop through
  const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivered'];
  let finalStatus = '';

  group("Update_order_status", function () {
    // Step 1: Pending to Processing
    const res1 = http.post(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}`, payloadPendingToProcessing, {
      headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    pendingToProcessingResponseTime.add(res1.timings.duration, { vu: vuID });
    pendingToProcessingSuccessRate.add(res1.status === 200, { vu: vuID });
    pendingToProcessingRequestCount.add(1, { vu: vuID });

    check(res1, {
      'Pending to Processing - status is 200': (r) => r.status === 200
    });

    // Step 2: Inventory check
    const res2 = http.post(`${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${order_Id}`, null, {
      headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    updateInventoryCheckResponseTime.add(res2.timings.duration, { vu: vuID });
    updateInventoryCheckSuccessRate.add(res2.status === 200, { vu: vuID });
    updateInventoryCheckRequestCount.add(1, { vu: vuID });

    check(res2, {
      'Inventory check - status is 200': (r) => r.status === 200
    });

    // Step 3: Credit check
    const res3 = http.post(`${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${order_Id}`, null, {
      headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    updateCreditCheckResponseTime.add(res3.timings.duration, { vu: vuID });
    updateCreditCheckSuccessRate.add(res3.status === 200, { vu: vuID });
    updateCreditCheckRequestCount.add(1, { vu: vuID });

    check(res3, {
      'Credit check - status is 200': (r) => r.status === 200
    });

    // Step 4: Promotion check
    const res4 = http.post(`${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${order_Id}`, null, {
      headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    updatePromotionCheckResponseTime.add(res4.timings.duration, { vu: vuID });
    updatePromotionCheckSuccessRate.add(res4.status === 200, { vu: vuID });
    updatePromotionCheckRequestCount.add(1, { vu: vuID });

    check(res4, {
      'Promotion check - status is 200': (r) => r.status === 200
    });

    // Step 5: Check current order status before updating
    const statusCheckRes = http.get(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,refundable_amount,refunded_total,refunds,location_id`,
      { headers: { cookies: cookies, 'Content-Type': 'application/json' } });

    let statusCheckBody;
    try {
      statusCheckBody = statusCheckRes.json();
    } catch (e) {
      console.error(`Status check JSON parse failed: ${e.message}. Raw body: ${statusCheckRes.body}`);
      return;
    }

    const extendedStatus1 = statusCheckBody?.order?.extended_status;
    const display_id1 = statusCheckBody?.order?.display_id;

    if (arrStatus.includes(extendedStatus1)) {
      console.log('Order Status is Invalid, No Update Performed:', display_id1);
      return;
    }

    // Step 6: Sequentially update extended status
    for (const status of arrStatus) {
      finalStatus = status;

      const payloadUpdateOrderStatus = JSON.stringify({
        order_ids: [order_Id],
        status: status
      });

      const res = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, payloadUpdateOrderStatus, {
        headers: { cookies: cookies, 'Content-Type': 'application/json' }
      });

      let body;
      try {
        body = res.json();
      } catch (e) {
        console.error(`Update status JSON parse failed: ${e.message}. Raw body: ${res.body}`);
        return;
      }

      const extendedStatus = body?.saved?.[0]?.extended_status;

      if (!res.body || !extendedStatus) {
        console.error('Invalid or empty response for order update:', JSON.stringify(body));
        return;
      }

      check(res, {
        'Order Update - status is 201': (r) => r.status === 201,
        'Order Update - extended_status matches': () => extendedStatus === status
      });

      updateOrderResponseTime.add(res.timings.duration, { vu: vuID });
      updateOrderSuccessRate.add(res.status === 201, { vu: vuID });
      updateOrderRequestCount.add(1, { vu: vuID });

      sleep(2);
    }

    // Step 7: Generate Invoice
    const payloadGenerateInvoice = JSON.stringify({
      order_ids: [order_Id]
    });

    const res5 = http.post(`${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`, payloadGenerateInvoice, {
      headers: { cookies: cookies, 'Content-Type': 'application/json' }
    });

    let body5;
    try {
      body5 = res5.json();
    } catch (e) {
      console.error(`Invoice JSON parse failed: ${e.message}. Raw body: ${res5.body}`);
      return;
    }

    const iExtendedStatus = body5?.downloaded?.[0]?.invoice?.status;
    const invoiceStatus = body5?.downloaded?.[0]?.invoice?.order?.invoices?.[0]?.status;
    // const display_id5 = body5?.downloaded?.[0]?.invoice?.order?.display_id;

    if (!res5.body || !iExtendedStatus || !invoiceStatus) {
      console.error('Invalid response structure for invoice:', JSON.stringify(body5));
      return;
    }

    check(res5, {
      'Invoice - status is 201': (r) => r.status === 201,
      'Invoice - extended_status matches final': () => iExtendedStatus === finalStatus,
      'Invoice - status is delivered': () => invoiceStatus === 'delivered'
    });

    generateInvoiceTime.add(res5.timings.duration, { vu: vuID });
    generateInvoiceSuccessRate.add(res5.status === 201, { vu: vuID });
    generateInvoiceRequestCount.add(1, { vu: vuID });

    sleep(2);
  });
}
