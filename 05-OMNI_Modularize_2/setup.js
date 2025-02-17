import http from 'k6/http';
import { BASE_URL, AUTH_URL, users } from './config.js';
import { Trend } from 'k6/metrics';

// Create custom trends
const authTrend = new Trend('auth_duration');

export function setup() {
    // console.log('Setup - Setting up test environment with session cookies...');
    //const user = users[0]; // Use first user for login

    const user = users[Math.floor(Math.random() * users.length)];
    // console.log(`Setup - Logging in with user ${user.username}...`);
    console.log(`VU#${__VU} - Logging in with user:${user.username}`);
    // console.log(`Logging in with user ${user.username}...`);

    const payload = JSON.stringify({ email: user.username, password: user.password });

    const loginRes = http.post(`${BASE_URL}/${AUTH_URL}`, payload, { headers: { "Content-Type": "application/json" } });
    authTrend.add(loginRes.timings.duration);

    if (loginRes.status !== 200) {
        console.error(`Setup - Login failed: ${loginRes.status} - ${loginRes.body}`);
        return null;
    }

    // Extract session cookies
    const cookies = loginRes.cookies;
    // console.log('Setup - Successfully authenticated. Session cookies received.');

    return { cookies };
}