// v2/flows/logout.js
import { group, check, sleep } from 'k6';
import { BASE_URL, AUTH_URL } from '../../config.js'; // Adjust path
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path

export function logoutFlow(authToken) {
    group('Logout', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} - Skipping Logout because no auth token provided.`);
            return;
        }

        const logoutResponse = makeRequest(
            'del', // Use DELETE method for logout
            `${BASE_URL}/${AUTH_URL}`,
            null, // No body for DELETE
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: { group: 'Logout' } }, // Pass token, add group tag
            '/admin/auth - DELETE (Logout)'
        );

        // Check if the logout endpoint returns 200 or similar on success
        check(logoutResponse, {
            'Logout successful (status 200)': (r) => r.status === 200,
        });

        sleep(1.1); // Keep original sleep
    });
}
