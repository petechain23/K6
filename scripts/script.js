// /Users/peter/Documents/03-Performance Testing/01-K6 Load Test/scripts/script.js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  duration: '30s', // for 30 seconds
};

export default function () {
  http.get('https://test-api.k6.io/public/crocodiles/');
  sleep(1); // wait for 1 second between requests
}