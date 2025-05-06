import { group, check } from 'k6'
import {
  BASE_URL, // Base URLs
  ORDER_PENDINGTOPROCESSING_URL, ORDER_INVENTORY_CHECK_URL, ORDER_CREDIT_CHECK_URL, ORDER_PROMOTION_CHECK_URL, ORDER_INVOICE_GENERATE_URL, // Endpoints
  // Import specific metrics
  orderInvoiceResponseTime, orderInvoiceSuccessRate, orderInvoiceRequestCount
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders, randomSleep } from '../utils.js'; // Adjust path

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
  // Default success is 2xx or 3xx, allow overriding
  const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
  const tags = { status: response.status }; // Add basic tags for specific metrics

  orderInvoiceResponseTime.add(response.timings.duration, tags);
  orderInvoiceSuccessRate.add(success, tags);
  orderInvoiceRequestCount.add(1, tags);
}

// This function represents the user flow for processing an order and generating an invoice.
export function ordersInvoiceFlow(authToken, configData) {
  // Extract needed data from configData passed by main.js
  const { orderIdForStatusUpdate, depotId } = configData; // Use the specific order ID for this flow

  group(
    'Orders Invoice',
    function () {
      // --- Initial Checks ---
      if (!authToken) {
        console.warn(`VU ${__VU} Orders Invoice: Skipping flow due to missing auth token.`);
        return;
      }
      if (!depotId) {
        console.warn(`VU ${__VU} Orders Update To Delivered: Skipping flow due to missing depotId in configData.`);
        return;
    }
      if (!orderIdForStatusUpdate) {
        console.warn(`VU ${__VU} Orders Invoice: Skipping flow because no orderIdForStatusUpdate was provided.`);
        return;
      }
      // --- End Initial Checks ---
      console.log(`VU ${__VU} Orders Invoice: Processing order ${orderIdForStatusUpdate}, Using Depot ${depotId}`);
      const groupTags = { group: 'Orders Invoice' };
      // Define common headers once
      const headers = createHeaders(authToken);
      const postHeaders = createHeaders(authToken, { 'content-type': 'application/json' });
      let res;
      // --- 1. Get Order Details ---
      const getOrderUrl = `${BASE_URL}/admin/orders/${orderIdForStatusUpdate}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description`;
      res = makeRequest('get', getOrderUrl, null, { headers: headers, tags: groupTags }, '/admin/orders/{id} (View Order)');
      const getOrderCheck = check(res, { 'Get Order Details - status 200': (r) => r.status === 200 });
      addMetrics(res, getOrderCheck);
      randomSleep(0.8, 1.2); // Replaced sleep(1)

      // --- 2. Extract Status and Conditionally Process/Check ---
      let orderStatus = null;
      try {
          if (getOrderCheck) { // Only parse if the GET request was successful
              orderStatus = res.json('order.extended_status');
              console.log(`VU ${__VU} Orders Invoice: Order ${orderIdForStatusUpdate} status is '${orderStatus}'`);
          } else {
              console.error(`VU ${__VU} Orders Invoice: Failed to get order details for ${orderIdForStatusUpdate}. Status: ${res.status}. Skipping processing/checks.`);
          }
      } catch (e) {
          console.error(`VU ${__VU} Orders Invoice: Failed to parse order details response for ${orderIdForStatusUpdate}. Error: ${e.message}. Skipping processing/checks.`);
      }

      // --- Conditional Block ---
      if (orderStatus === 'pending' || orderStatus === 'processing') {
          console.log(`VU ${__VU} Orders Invoice: Status is '${orderStatus}', proceeding with checks.`);

          // --- 2a. Set Order Processing (Only if 'pending') ---
          if (orderStatus === 'pending') {
              const setProcessingUrl = `${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${orderIdForStatusUpdate}`;
              const setProcessingPayload = { is_processing: true };
              res = makeRequest('post', setProcessingUrl, setProcessingPayload, { headers: postHeaders, tags: groupTags }, '/admin/orders/{id} (Mark Processing)');
              addMetrics(res, res.status === 200); // Assuming 200 is success
              check(res, { 'Set Order Processing - status 200': (r) => r.status === 200 });
              randomSleep(1.5, 2.5); // Replaced sleep(2)
          }

          // --- 2b. Mark Inventory Checked ---
          const inventoryCheckUrl = `${BASE_URL}/${ORDER_INVENTORY_CHECK_URL}/${orderIdForStatusUpdate}`;
          res = makeRequest('post', inventoryCheckUrl, null, { headers: headers, tags: groupTags }, '/admin/orders/inventory-checked/{id}');
          addMetrics(res, res.status === 200); // Assuming 200 is success
          check(res, { 'Mark Inventory Checked - status 200': (r) => r.status === 200 });
          randomSleep(0.8, 1.2); // Replaced sleep(1)

          // --- 2c. Mark Credit Checked ---
          const creditCheckUrl = `${BASE_URL}/${ORDER_CREDIT_CHECK_URL}/${orderIdForStatusUpdate}`;
          res = makeRequest('post', creditCheckUrl, null, { headers: headers, tags: groupTags }, '/admin/orders/credit-checked/{id}');
          addMetrics(res, res.status === 200); // Assuming 200 is success
          check(res, { 'Mark Credit Checked - status 200': (r) => r.status === 200 });
          randomSleep(0.8, 1.2); // Replaced sleep(1)

          // --- 2d. Mark Promotion Checked ---
          const promoCheckUrl = `${BASE_URL}/${ORDER_PROMOTION_CHECK_URL}/${orderIdForStatusUpdate}`;
          res = makeRequest('post', promoCheckUrl, null, { headers: headers, tags: groupTags }, '/admin/orders/promotion-checked/{id}');
          addMetrics(res, res.status === 200); // Assuming 200 is success
          check(res, { 'Mark Promotion Checked - status 200': (r) => r.status === 200 });
          randomSleep(0.8, 1.2); // Replaced sleep(1)

      } else {
          console.log(`VU ${__VU} Orders Invoice: Order status is '${orderStatus}'. Skipping processing and checks.`);
          // Optionally add a sleep here if needed when skipping steps
          randomSleep(1, 2);
      }
      // --- End Conditional Block ---

      // --- 6. Generate Invoice ---
      const generateInvoiceUrl = `${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`;
      const invoicePayload = {
        order_ids: [orderIdForStatusUpdate],
        expected_delivery_date: new Date().toISOString(),
        term_of_payments: "current_credit_terms"
      };
      // Note: Using postHeaders which includes content-type: application/json
      res = makeRequest('post', generateInvoiceUrl, invoicePayload, { headers: postHeaders, tags: groupTags }, '/admin/invoices/generate');
      const generateInvoiceSuccess = res.status === 201;
      addMetrics(res, generateInvoiceSuccess);
      check(res, {
        'Generate Invoice - status is 201': (r) => r.status === 201,
        'Generate Invoice - response has downloaded array': (r) => {
          try {
            const body = r.json();
            // Check if downloaded is an array and has at least one element
            return Array.isArray(body?.downloaded) && body.downloaded.length > 0;
          } catch (e) { return false; }
        },
        'Generate Invoice - response contains expected keys': (r) => {
          try {
            const firstDownloaded = r.json('downloaded.0'); // Get the first element
            return firstDownloaded?.invoice?.id && firstDownloaded?.invoice?.number && firstDownloaded?.invoice?.order_id && firstDownloaded?.response?.file_name;
          } catch (e) { return false; }
        }
      });
      if (!generateInvoiceSuccess) {
        console.error(`VU ${__VU} Orders Invoice: Failed to generate invoice for order ${orderIdForStatusUpdate}. Status: ${res.status}, Body: ${res.body}`);
      }
    }
  );
}