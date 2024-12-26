import { sleep, check, group } from 'k6'
import http from 'k6/http'

let counter = 0;
let usernames = ['dat-tran-niteco@outlook.com','dat.tran@niteco.se','dat.tran-bbi@yopmail.com','dat.tran-bjs@yopmail.com','dat.tran-bsr@yopmail.com'];
let passwords = ['A@a123456789','A@a123456789','A@a123456789','A@a123456789','A@a123456789'];
let rand = Math.floor(Math.random() * usernames.length);
let username = usernames[rand];
let password = passwords[rand];
//console.log(`VU#${__VU} - username: ${username}, password: ${password}`);

const baseUrl = 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net';
const authUrl = 'admin/auth'

const payload = JSON.stringify({
    email: `${username}`,
    password: `${password}`,
  });

const params = {
    headers: {
      "Content-Type": "application/json",
    }
  };

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {
    'http_req_duration{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
      { threshold: 'p(99)<=300', abortOnFail: true },
    ],
    'http_req_failed{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
      { threshold: 'rate<=0.01', abortOnFail: true },
    ],
  },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '1s',
      stages: [
        { target: 1, duration: '5s' },
        { target: 5, duration: '2m' },
        { target: 0, duration: '5s' },
      ],
      gracefulRampDown: '10s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  group(
    'page_1 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/auth/login?back_to=L2Rpc3RyaWJ1dG9ycy9vcmRlcnM%3D',
    function () {
      response = http.post(`${baseUrl}/${authUrl}`, payload, params);
      
      check(response, {
        'body contains user': response => response.body.includes('user'),
        'status equals 200': response => response.status.toString() === '200',
      })
    }
  )
}
