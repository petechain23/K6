import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, outlet_depot, promoGetListRequestCount, promoGetListSuccessRate, promoGetListResponseTime } from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function promotions(cookies) {
  const vuID = __VU;
  console.log(`VU#${__VU}`);
  // //Pick a random outlet_external_id
  // const randomoutlet_external_id = outlet_depot[Math.floor(Math.random() * outlet_depot.length)];
  // const randomoutlet_external_id = outlet_depot.indexOf(outlet_external_id);
  // const outlet_external_id = outlet_depot.outlet_external_id;
  // console.log('Random Outlet: ', outlet_external_id);

  for (let i = 0; i < outlet_depot.length; i++) {
    let external_id = outlet_depot[i].outlet_external_id;
    console.log(`Outlet External ID: ${external_id}`);
    // REP - After fix:
    const res = http.get(`${BASE_URL}/admin/promotions/get-list?distributor_external_id=302-BBI&outlet_external_id=${external_id}&start_before=2025-03-17T00:00:00.000ZZ&end_after=2025-03-17T00:00:00.000Z`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    // REP - Before fix:
    // const res = http.get(`${BASE_URL}/admin/promotions/get-list?depot_external_id=302-BBI-D03-MAIN&outlet_external_id=${external_id}&start_before=2025-03-06T00:00:00.000Z`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //&end_after=2025-03-06T00:00:00.000Z
    // console.log('Response status:', res.status);
    // const body = JSON.parse(res.body)
    if (!res.body) {
      console.log(`Empty Response Body for Request`, res.status);
    } else {
      check(res, {
        'Get promotions - verify get promotions status': (r) => r.status === 200,
        // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
      });
      promoGetListResponseTime.add(res.timings.duration, { vu: vuID });
      promoGetListSuccessRate.add(res.status === 200, { vu: vuID });
      promoGetListRequestCount.add(1, { vu: vuID });
      sleep(2);
    }
  }
}