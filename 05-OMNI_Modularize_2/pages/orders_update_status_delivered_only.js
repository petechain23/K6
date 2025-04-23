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
import { addResponseTimeMetric } from '../main.js';

export function orderUpdateStatusDelivered(cookies) {
  const vuID = __VU;

  // Randomly select an order ID
  const { order_Id } = orderId2[Math.floor(Math.random() * orderId2.length)];
  const headers = { cookies, 'Content-Type': 'application/json' };

  const payloadPendingToProcessing = JSON.stringify({ is_processing: true });
  const desiredStatus = 'delivered';

  group("Update_order_status", function () {
    // Step 1: Pending → Processing
    const res1 = http.post(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}`, payloadPendingToProcessing, { headers });
    addResponseTimeMetric('Order Update - Pending to Processing', res1.timings.duration, vuID, res1.status);
    pendingToProcessingResponseTime.add(res1.timings.duration, { vu: vuID });
    pendingToProcessingSuccessRate.add(res1.status === 200, { vu: vuID });
    pendingToProcessingRequestCount.add(1, { vu: vuID });

    check(res1, {
      'Pending to Processing - status is 200': (r) => r.status === 200
    });

    // Step 2: Inventory, Credit, Promotion checks
    const checkEndpoints = [
      { name: 'Inventory Check', url: ORDER_INVENTORY_CHECK_URL, time: updateInventoryCheckResponseTime, success: updateInventoryCheckSuccessRate, count: updateInventoryCheckRequestCount },
      { name: 'Credit Check', url: ORDER_CREDIT_CHECK_URL, time: updateCreditCheckResponseTime, success: updateCreditCheckSuccessRate, count: updateCreditCheckRequestCount },
      { name: 'Promotion Check', url: ORDER_PROMOTION_CHECK_URL, time: updatePromotionCheckResponseTime, success: updatePromotionCheckSuccessRate, count: updatePromotionCheckRequestCount },
    ];

    for (const step of checkEndpoints) {
      const res = http.post(`${BASE_URL}/${step.url}/${order_Id}`, null, { headers });
      step.time.add(res.timings.duration, { vu: vuID });
      step.success.add(res.status === 200, { vu: vuID });
      step.count.add(1, { vu: vuID });
      addResponseTimeMetric(`Order Update - ${step.name}`, res.timings.duration, vuID, res.status);

      check(res, {
        [`${step.name} - status is 200`]: (r) => r.status === 200
      });
    }

    // Step 3: Check current extended_status
    const statusCheckRes = http.get(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments&fields=id,display_id,extended_status`, { headers });

    let statusData;
    try {
      statusData = statusCheckRes.json();
    } catch (e) {
      console.error(`Failed to parse status check response: ${e.message}`);
      return;
    }

    const currentStatus = statusData?.order?.extended_status;
    const displayId = statusData?.order?.display_id;

    if (currentStatus !== 'processing') {
      console.warn(`Order ${displayId} is not in 'processing' state. Current: ${currentStatus}. Skipping update.`);
      return;
    }

    // Step 4: Update status to delivered
    const payloadUpdate = JSON.stringify({ order_ids: [order_Id], status: desiredStatus });

    const resUpdate = http.post(`${BASE_URL}/${ORDER_EXTEND_STATUS_UPDATE_URL}`, payloadUpdate, { headers });

    let updateBody;
    try {
      updateBody = resUpdate.json();
    } catch (e) {
      console.error(`Failed to parse update status response: ${e.message}`);
      return;
    }

    const updatedStatus = updateBody?.saved?.[0]?.extended_status;

    if (!updatedStatus) {
      console.error(`Empty or invalid update response: ${JSON.stringify(updateBody)}`);
      return;
    }

    check(resUpdate, {
      'Order Update - status is 201': (r) => r.status === 201,
      'Order Update - status changed to delivered': () => updatedStatus === desiredStatus
    });

    updateOrderResponseTime.add(resUpdate.timings.duration, { vu: vuID });
    updateOrderSuccessRate.add(resUpdate.status === 201, { vu: vuID });
    updateOrderRequestCount.add(1, { vu: vuID });
    addResponseTimeMetric('Order Update - Delivered', resUpdate.timings.duration, vuID, resUpdate.status);

    sleep(2);
  });
}
