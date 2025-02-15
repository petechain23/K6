import http from 'k6/http';
import { BASE_URL, AUTH_URL, users } from './config.js';

export function teardown(cookies) {
    if (!cookies) {
        console.error('Teardown - No session cookies available for cleanup.');
        return;
    }
    // console.log(`Teardown - Clearing session cookies: ${JSON.stringify(cookies)}`);
    // http.del(`${BASE_URL}/${AUTH_URL}`, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
    console.log('Teardown - Cleanup completed.');

    // function () {
    //       let response = http.del(`${baseUrl}/${authUrl}`, params);
    //       check(response, {
    //         'verify status equals 200': (response) => response.status.toString() === '200',
    //         'verify logout successfully': (r2) => r2.body.includes('OK'),
    //       });
    //       //console.log('show log Saved-Cookie is removed', response.cookies);
    //     },
}