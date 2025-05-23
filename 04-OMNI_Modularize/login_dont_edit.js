import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

let counter = 0;
let usernames = ['dat-tran-niteco@outlook.com', 'dat.tran@niteco.se', 'dat.tran-bbi@yopmail.com', 'dat.tran-bjs@yopmail.com', 'dat.tran-bsr@yopmail.com'];
let passwords = ['A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789'];
let rand = Math.floor(Math.random() * usernames.length);
let username = usernames[rand];
let password = passwords[rand];

// let username = 'dat-tran-niteco@outlook.com';
// let password = 'A@a123456789';

// console.log(`VU#${__VU} - username: ${username}, password: ${password}`);

// const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const authUrl = 'admin/auth'
// const createUrl = 'admin/orders/create'

export function login(baseUrl) {
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
      // return response.headers['Set-Cookie'];
      //console.log('show log Saved-Cookie', response.cookies);
    },
  )
  group(
    'page_3 - logout',
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