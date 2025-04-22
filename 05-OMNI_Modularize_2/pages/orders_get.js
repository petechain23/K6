import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL , customTrendResponseTime, customTrendSuccessRate, customTrendRequestCount} from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function ordersGetList(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);

  //Before fix
    //Admin: const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //REP: const res = http.get(`${BASE_URL}/admin/orders/external?limit=10&offset=0&outlet_external_id=3022200797&depot_external_id=302-BBI-D01-MAIN&order=-created_at&order_type=standard&fields=id,created_at,extended_status,display_id,outlet_id,metadata,currency_code&expand=items,items.variant,items.variant.product,customer`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //Returned:
    //const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=returned&offset=0&limit=20&order=-created_at`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //Distributor: 
    //const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    
  //After fix
    //Admin:
    // const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //REP:
   //const res = http.get(`${BASE_URL}/admin/orders/external?limit=10&offset=0&outlet_external_id=3022200797&depot_external_id=302-BBI-D01-MAIN&order=-created_at&order_type=standard&fields=id,created_at,extended_status,display_id,outlet_id,metadata,currency_code&expand=items,items.variant,items.variant.product,customer`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //Returned: 
    const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=returned&offset=0&limit=20&order=-created_at&include_count=false`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    //Distributor: 
    //const res = http.get(`${BASE_URL}/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    
    // console.log('Response status:', res.status);
    const body = JSON.parse(res.body)
    if (!res.body){
      console.log(`Empty Response Body for Request`, res.status);
    } else {
      check(res, {
        'Get orders - verify get orders list status': (r) => r.status === 200,
        // 'Create Order - verify orders successfully': (r2) => r2.body.includes('display_id')
        // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
      });
      //orderGetListResponseTime.add(res.timings.duration, { vu: vuID });
      //orderGetListSuccessRate.add(res.status === 200, { vu: vuID });
      //orderGetListRequestCount.add(1, { vu: vuID });
      customTrendResponseTime.add(res.timings.duration, { vu: vuID });
      customTrendSuccessRate.add(res.status === 200, { vu: vuID });
      customTrendRequestCount.add(1, { vu: vuID });
      sleep(2);
    }
}