// import http from 'k6/http';
// import { BASE_URL, masterData } from './config.js';

export function teardown(cookies) {
    if (!cookies) {
        console.error('teardown - No session cookies available for cleanup.');
        return;
    }
    // console.log(`teardown - Clearing session cookies: ${JSON.stringify(cookies)}`);
    console.log('teardown - Cleanup completed.');
}