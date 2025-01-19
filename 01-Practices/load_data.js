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
const csvData = new SharedArray('another data name', function () {
  // Load CSV file and parse it using Papa Parse
  return papaparse.parse(open('./data.csv'), { header: true }).data;
});

export default function () {
  // Now you can use the CSV data in your test logic below.
  // Below are some examples of how you can access the CSV data.

  // Loop through all username/password pairs
  for (const userPwdPair of csvData) {
    console.log(JSON.stringify(userPwdPair));
  }

  // Pick a random username/password pair
  const randomUser = csvData[Math.floor(Math.random() * csvData.length)];
  console.log('Random user: ', JSON.stringify(randomUser));

  const params = {
    login: randomUser.username,
    password: randomUser.password,
  };
  console.log('Random user: ', JSON.stringify(params));

//   const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
//   const authUrl = 'admin/auth'
  // const res = http.post('https://test.k6.io/login.php', params);
  const res = http.post('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', params);
  check(res, {
    'login succeeded': (r) => r.status === 200 //&& r.body.indexOf('successfully authorized') !== -1,
  });
  sleep(1);
}

export let options = {
  stages: [
      { duration: '10s', target: 3 },
      { duration: '50s', target: 3 },
      // { duration: '60s', target: 2000 },
      // { duration: '60s', target: 3000 },
      { duration: '5s', target: 0 },
  ],

  thresholds: {
      http_req_failed: ["rate<0.01"], // http errors should be less than 1%
      http_req_duration: ["p(99)<3000"], // 99% of requests should be below 1s
  },

};