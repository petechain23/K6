import { sleep, check, group } from 'k6'
import http from 'k6/http'

const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const authUrl = 'admin/auth'

export const params = {
  headers: {
      "Content-Type": "application/json",
  }
};

export function login(credential) {
  let response;
  group(
    'page_1 - login page',
    function () {
      response = http.post(`${baseUrl}/${authUrl}`, credential, params);
      // console.log('show log response body', response.body);
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
  // group(
  //   'page_3 - logout',
  //   function () {
  //     let response = http.del(`${baseUrl}/${authUrl}`, params);
  //     check(response, {
  //       'verify status equals 200': (response) => response.status.toString() === '200',
  //       'verify logout successfully': (r2) => r2.body.includes('OK'),
  //     });
  //     //console.log('show log Saved-Cookie is removed', response.cookies);
  //   },
  // )
  return response;
}