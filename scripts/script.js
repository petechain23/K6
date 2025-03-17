import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30m',
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95th percentile < 200ms
    http_req_failed: ['rate<0.01'], // less than 1% failed requests
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}