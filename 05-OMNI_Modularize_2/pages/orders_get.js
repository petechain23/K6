import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function ordersGetList(cookies) {
  // const vuID = __VU;
  // console.log(`VU#${__VU}`);

  //https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at
  const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
  console.log('Response status:', res.status);
  const body = JSON.parse(res.body)
  if (!res.body || res.status === 0) {
    console.log(`Empty Response Body for Request`);
  } else {
    check(res, {
      'Get orders - verify get orders list status': (r) => r.status === 200,
      'Create Order - verify orders successfully': (r2) => r2.body.includes('display_id')
      // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
    });
    // exportOrderResponseTime.add(res.timings.duration, { vu: vuID });
    // exportOrderSuccessRate.add(res.status === 201, { vu: vuID });
    // exportOrderRequestCount.add(1, { vu: vuID });
    // sleep(2);
  }
}