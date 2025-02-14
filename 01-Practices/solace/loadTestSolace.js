import http from 'k6/http';
import { check } from 'k6';

const SOLACE_REST_URL = 'https://your-solace-broker:9443/HNK/MDM/PRODUCT/MATERIAL/STOCKUPDATE/UPD/OMS/APAC/MM/GR';
const USERNAME = 'OMS_GLB_USER';
const PASSWORD = 'qzNy7l387Yn1';

export const options = {
  vus: 5,   // 10 virtual users
  duration: '10s', // Run for 30 seconds
};

export default function () {
  const payload = JSON.stringify({
    sku: 'NPCTGOBL01',
    distributor_id: '1102',
    location: '10164514',
    added_stocked_quantity: null,
    total_stocked_quantity: null,
    incoming_quantity: 1000,
    incoming_date: '2025-03-20',
    order_number: '17012024002'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + __ENV.SOLACE_AUTH, // Use Base64 encoded auth
    },
  };

  const res = http.post(SOLACE_REST_URL, payload, params);

  check(res, {
    'is status 200 or 202': (r) => r.status === 200 || r.status === 202,
  });
}
