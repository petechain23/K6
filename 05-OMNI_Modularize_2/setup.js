import http from 'k6/http';
import { BASE_URL, AUTH_URL, users } from './config.js';

export function setup() {
    // console.log('Setup - Setting up test environment with session cookies...');
    //const user = users[0]; // Use first user for login

    const user = users[Math.floor(Math.random() * users.length)];
    console.log(`Setup - Logging in with user ${user.username}...`);
    
    const payload = JSON.stringify({ email: user.username, password: user.password });

    const loginRes = http.post(`${BASE_URL}/${AUTH_URL}`, payload, { headers: { "Content-Type": "application/json" } });

    if (loginRes.status !== 200) {
        console.error(`Setup - Login failed: ${loginRes.status} - ${loginRes.body}`);
        return null;
    }

    // Extract session cookies
    const cookies = loginRes.cookies;
    // console.log('Setup - Successfully authenticated. Session cookies received.');

    return { cookies };
}