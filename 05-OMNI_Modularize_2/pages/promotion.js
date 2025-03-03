import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, outlet_depot } from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function promotions(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);
  // //Pick a random outlet_external_id
  // const randomoutlet_external_id = outlet_depot[Math.floor(Math.random() * outlet_depot.length)];
  // const randomoutlet_external_id = outlet_depot.indexOf(outlet_external_id);
  // const outlet_external_id = outlet_depot.outlet_external_id;
  // console.log('Random Outlet: ', outlet_external_id);

  for (let i = 0; i < outlet_depot.length; i++) {
    let external_id = outlet_depot[i].outlet_external_id;
    console.log(`Outlet External ID: ${external_id}`);
    const res = http.get(`${BASE_URL}/admin/promotions/get-list?depot_external_id=10164514&outlet_external_id=${external_id}&start_before=2025-03-03T00:00:00.000Z&end_after=2025-03-03T00:00:00.000Z`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    // exportOrderTrend.add(res.timings.duration);
    // console.log('Response status:', res.status);
    // const body = JSON.parse(res.body)
    // console.log('Export Order - Response batch_job id: ', body.batch_job.id);
    if (!res.body || res.status === 0) {
      console.log(`Empty Response Body for Request`);
    } else {
      check(res, {
        'Get promotions - verify get promotions status': (r) => r.status === 200,
        // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
      });
      // exportOrderResponseTime.add(res.timings.duration, { vu: vuID });
      // exportOrderSuccessRate.add(res.status === 201, { vu: vuID });
      // exportOrderRequestCount.add(1, { vu: vuID });
      // sleep(2);
    }
  }
}