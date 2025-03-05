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
} from '../config.js';
import { Trend, Rate, Counter, Metric } from 'k6/metrics';

// Create custom trends
const updateOrderStatus = new Trend('update_order_duration');
const generateInvoice = new Trend('generateInvoice_duration');
const pendingToProcessing = new Trend('update_PendingToProcessing_duration');
const updateInventoryCheck = new Trend('update_InventoryCheck_duration');
const updateCreditCheck = new Trend('update_CreditCheck_duration');
const updatePromotionCheck = new Trend('update_PromotionCheck_duration');
export function orderUpdateStatus(cookies) {

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

    //Generate invoice
    const payloadGenerateInvoice = JSON.stringify({
      order_ids: [
        `${order_Id}`
      ]
    });

    //Order extended status
    const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivered'];
    //Check if Order is valid to Update Status
    const checkOrderStatus = http.get(`${BASE_URL}/${ORDER_PENDINGTOPROCESSING_URL}/${order_Id}?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,refundable_amount,refunded_total,refunds,location_id`,
      { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    const body = JSON.parse(checkOrderStatus.body)
    const extendedStatus = body.order.extended_status;
    const display_id = body.order.display_id
    // console.log('Update Order Status - checkOrderStatusIsValid: ', extendedStatus);
    if (arrStatus.includes(extendedStatus)) {
      console.log('Order Status is Invalid, No Update Performed:', display_id, extendedStatus);
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
        // console.log('Update Order Status - display_id: ', body.saved[0].display_id);
        if (!res.body || res.status === 0) {
          console.log(`Empty Response Body for Request`);
        } else {
          check(res, {
            'Update Order Status - verify response status': (r) => r.status === 201,
            'Update Order Status - verify update successfully': (r2) => extendedStatus === `${arrStatus[i]}`
          });
          updateOrderStatus.add(res.timings.duration);
          // sleep(2);
        }
      };

      //Generate invoice
      const res5 = http.post(`${BASE_URL}/${ORDER_INVOICE_GENERATE_URL}`, payloadGenerateInvoice, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
      const body1 = JSON.parse(res5.body)
      const invoiceStatus = body1.downloaded[0].invoice.status;
      // console.log('Generate invoice - display_id: ', body1.downloaded[0].invoice.order.display_id);
      check(res5, {
        'Generate invoice - verify response status': (r) => r.status === 201,
        'Generate invoice - verify update successfully': (r2) => invoiceStatus === 'delivered'
      });
      generateInvoice.add(res5.timings.duration);
      // sleep(2);
    }
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