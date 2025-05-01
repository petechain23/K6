// v2/flows/login.js
import { group, check, sleep } from 'k6';
import { BASE_URL, AUTH_URL, loginRequestCount, loginResponseTime, loginSuccessRate } from '../config.js'; // Adjust path
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path
// Import login-specific metrics from config.js if you define them

export function loginFlow(userEmail, userPassword) {
    let authToken = null;

    group('Login', function () {
        const loginPayload = {
            email: userEmail,
            password: userPassword,
        };
        // Note: createHeaders now gets FRONTEND_URL from config.js
        const loginHeaders = createHeaders(null, { // No initial token
            'content-type': 'application/json',
            'accept': 'application/json'
        });

        const response = makeRequest(
            'post',
            `${BASE_URL}/${AUTH_URL}`,
            loginPayload,
            { headers: loginHeaders, tags: { group: 'Login' } }, // Add group tag
            '/admin/auth - POST (Login)'
        );

        // Add specific login metrics here if needed, e.g.:
        loginResponseTime.add(response.timings.duration);
        loginSuccessRate.add(response.status === 200);
        loginRequestCount.add(1);

        let userId = null;
        try {
            userId = response.json('user.id'); // Safely try to access
        } catch (e) {
             console.warn(`VU ${__VU} - Login: Could not parse user.id from response. Status: ${response.status}`);
        }

        const loginCheck = check(response, {
            'Login successful (status 200)': (r) => r.status === 200,
            'Login response contains user.id': () => userId !== null,
        });

        if (loginCheck && userId) {
            authToken = userId; // Extract token (assuming user.id is the token)
            console.log(`VU ${__VU} logged in successfully.`);

            // Get current user info (optional, but often done after login)
            const userInfoRes = makeRequest(
                'get',
                `${BASE_URL}/${AUTH_URL}`,
                null,
                { headers: createHeaders(authToken), tags: { group: 'Login' } }, // Pass token, add group tag
                '/admin/auth - GET (User Info)'
            );
             // Add specific metrics for this call if needed
        } else {
            console.error(`VU ${__VU} Login failed! Status: ${response.status}, Body: ${response.body}`);
            authToken = null; // Ensure token is null on failure
        }
    });

    return authToken; // Return the token (or null if failed)
}
