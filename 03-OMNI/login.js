/*  Where contents of data.csv is:
username,password
admin,123
test_user,1234
*/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// not using SharedArray here will mean that the code in the function call (that is what loads and
// parses the csv) will be executed per each VU which also means that there will be a complete copy
// per each VU
const csvData = new SharedArray('credentals', function () {
  // Load CSV file and parse it using Papa Parse
  return papaparse.parse(open('../../02-K6 Files/credentals.csv'), { header: true }).data;
});

export function login(baseUrl) {
  // Now you can use the CSV data in your test logic below.
  // Below are some examples of how you can access the CSV data.

  // Loop through all username/password pairs
  for (const userPwdPair of csvData) {
    console.log(JSON.stringify(userPwdPair));
  }

  // Pick a random username/password pair
  const randomUser = csvData[Math.floor(Math.random() * csvData.length)];
  console.log('Random user: ', JSON.stringify(randomUser));

  const payload = JSON.stringify({
    email: randomUser.username,
    password: randomUser.password,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: {
      "my-custom-tag": "auth-api",
    },
  };

  console.log('Random user: ', JSON.stringify(payload));
  const authUrl = 'admin/auth'
  const res = http.post(`${baseUrl}/${authUrl}`, payload, params);
  check(res, {
    'login succeeded': (r) => r.status === 200 && r.body.includes('user'),
  });
  sleep(1);
}

// export let options = {
//   stages: [
//     { duration: '5s', target: 1 },
//     // { duration: '20s', target: 2 },
//     // { duration: '60s', target: 2000 },
//     // { duration: '60s', target: 3000 },
//     // { duration: '5s', target: 0 },
//   ],

//   thresholds: {
//     http_req_failed: ["rate<0.01"], // http errors should be less than 1%
//     http_req_duration: ["p(99)<1000"], // 99% of requests should be below 1s
//   },

// };