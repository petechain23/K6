import { sleep, check, group } from 'k6'
import http from 'k6/http'

const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const authUrl = 'admin/auth'

// let counter = 0;
// let usernames = ['dat-tran-niteco@outlook.com', 'dat.tran@niteco.se', 'dat.tran-bbi@yopmail.com', 'dat.tran-bjs@yopmail.com', 'dat.tran-bsr@yopmail.com'];
// let passwords = ['A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789', 'A@a123456789'];
// let rand = Math.floor(Math.random() * usernames.length);
// let username = usernames[rand];
// let password = passwords[rand];

// const payload = JSON.stringify({
//     email: `${username}`,
//     password: `${password}`,
// });

// export function login(credential) {
//     const res = http.post('https://example.com/login', {
//         username: credential.username,
//         password: credential.password,
//     });

export const params = {
  headers: {
      "Content-Type": "application/json",
  }
};

// export const payload = JSON.stringify({
//     email: `${username}`,
//     password: `${password}`,
// });
// console.log(`VU#${__VU} - username: ${username}`);


export function login(credential) {
  let response;
  group(
    'page_1 - login page',
    function () {
      response = http.post(`${baseUrl}/${authUrl}`, credential, params);
      console.log('show log response body', response.body);
      check(response, {
        'verify status equals 200': (response) => response.status.toString() === '200',
        // 'verify is correct user': (r) => r.json().user.email === JSON.stringify(credential.email),
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