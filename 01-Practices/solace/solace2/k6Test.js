import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1, // 10 virtual users
  // duration: '1s', // Run for 30 seconds
};

export default function () {
  const payload = JSON.stringify({
    sku: 'NPCTGOBL01',
    distributor_id: '1102',
    location: '10164514',
    added_stocked_quantity: null,
    total_stocked_quantity: null,
    incoming_quantity: 1000,
    incoming_date: '2025-02-20',
    order_number: '2025' + '-' + new Date().getDate() + new Date().getHours() + new Date().getMinutes()
    // Random quantity: Math.floor(Math.random() * 1000),
    // timestamp: new Date().toISOString()
  });

  const params = {
    headers: { "Content-Type": "application/json" }
  };

  const res = http.post("http://localhost:3000/send-message", payload, params);

  check(res, {
    "Message sent successfully": (r) => r.status === 200,
  });
}
