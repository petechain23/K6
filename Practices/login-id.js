import { sleep, check, group } from 'k6'
import http from 'k6/http'

let counter = 0;
let usernames = ['dat-tran-niteco@outlook.com','dat.tran@niteco.se','dat.tran-bbi@yopmail.com','dat.tran-bjs@yopmail.com','dat.tran-bsr@yopmail.com'];
let passwords = ['A@a123456789','A@a123456789','A@a123456789','A@a123456789','A@a123456789'];
let rand = Math.floor(Math.random() * usernames.length);
let username = usernames[rand];
let password = passwords[rand];

// let username = 'dat.tran@niteco.se';
// let password = 'A@a123456789';

// console.log(`VU#${__VU} - username: ${username}, password: ${password}`);

const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const authUrl = 'admin/auth'

// const payload = JSON.stringify({
//     email: `${username}`,
//     password: `${password}`,
//   });
//   console.info(`VU#${__VU} - username: ${username}, password: ${password}`);

// const params = {
//     headers: {
//       "Content-Type": "application/json",
//     }
//   };

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {
    'http_req_duration{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
      { threshold: 'p(99)<=300', abortOnFail: false },
    ],
    'http_req_failed{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
      { threshold: 'rate<=0.01', abortOnFail: false },
    ],
  },
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '1s',
      stages: [
        { target: 5, duration: '5s' },
        { target: 5, duration: '50s' },
        { target: 0, duration: '5s' },
      ],
      gracefulRampDown: '1s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  const payload = JSON.stringify({
    email: `${username}`,
    password: `${password}`,
  });
  console.log(`VU#${__VU} - username: ${username}`);
  
  const params = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  let response;
  group(
    'page_1 - login page',
    function () {
      response = http.post(`${baseUrl}/${authUrl}`, payload, params);
      //console.log('show log response body', response.body);
      check(response, {
        'verify status equals 200': (response) => response.status.toString() === '200',
        'verify is correct user': (r) => r.json().user.email === username,
        // 'verify VU#': (r) => r.body.includes (`${__VU}`),
        // 'verify username': (r) => r.body.includes (`${username}`),
        // 'verify is correct first name': (r) => r.json().user.first_name.includes ('dat'),
      });
      // console.log('show log headers', response.headers);
      return response.headers['Set-Cookie'];
      //console.log('show log Saved-Cookie', response.cookies);
    },
  )
  group(
    'page_2 - logout',
    function () {
      let response = http.del(`${baseUrl}/${authUrl}`, params);
      check(response, {
        'verify status equals 200': (response) => response.status.toString() === '200',
        'verify logout successfully': (r2) => r2.body.includes('OK'),
      });
      //console.log('show log Saved-Cookie is removed', response.cookies);
    },
  )
}

// export default function () {
//   let cookie = scenario_1();
//   let params = {
//       headers: {
//           Cookie: cookie,
//       },
//   };

//   // Perform a request to an authenticated route
//   let response = http.get(`${baseUrl}/${authUrl}`, params);
//   check(response, {
//       'verify status equals 200': (r) => r.status === 200,
//   });
//   console.log('show log check cookies', response.cookies);
//   sleep(1);
// }