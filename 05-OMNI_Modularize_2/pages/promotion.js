import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function promotions(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);

  const res = http.get(`${BASE_URL}/admin/promotions/get-list?depot_external_id=10164514&outlet_external_id=testingoutlet10009993&start_before=2025-02-28T00:00:00.000Z&end_after=2025-02-28T00:00:00.000Z`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
  // exportOrderTrend.add(res.timings.duration);
  console.log('Response status:', res.status);
  // const body = JSON.parse(res.body)
  // console.log('Export Order - Response batch_job id: ', body.batch_job.id);
  check(res, {
    'Export Order - verify export response status': (r) => r.status === 200,
    // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
  });
  // exportOrderResponseTime.add(res.timings.duration, { vu: vuID });
  // exportOrderSuccessRate.add(res.status === 201, { vu: vuID });
  // exportOrderRequestCount.add(1, { vu: vuID });
  // sleep(2);
}