// v2/utils.js
import http from 'k6/http'; // Ensure http is imported
import { check, sleep  } from 'k6';
import {
    FRONTEND_URL, defaultCustomResponseTime, defaultCustomSuccessRate, defaultCustomRequestCount
} from './config.js';

// ... createHeaders function remains the same ...
export function createHeaders(authToken, specificHeaders = {}) {
    // Define default headers INSIDE the function if they depend on config
    const defaultHeaders = {
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
        'origin': FRONTEND_URL, // Use imported FRONTEND_URL
        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
    };

    const headers = { ...defaultHeaders, ...specificHeaders };
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    // Ensure content-type is set correctly if provided
    if (specificHeaders['content-type']) {
        headers['content-type'] = specificHeaders['content-type'];
    } else if (!headers['content-type'] && (specificHeaders.body || defaultHeaders.body)) {
        // Default to json if body exists and content-type isn't set,
        headers['content-type'] = 'application/json';
    }
    return headers;
}

// --- Helper function for random sleep ---
export function randomSleep(min = 1, max = 3) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}


/**
 * Makes an HTTP request, adds basic checks, and records GENERIC metrics.
 * @param {string} method - HTTP method (e.g., 'get', 'post', 'del').
 * @param {string} url - The request URL.
 * @param {string|object|null} body - The request body.
 * @param {object} params - k6 parameters object (e.g., { headers, tags }).
 * @param {string} name - A descriptive name for the request (used for tagging).
 * @returns {object} The k6 response object.
 */
export function makeRequest(method, url, body, params = {}, name) {
    const requestParams = { ...params }; // Clone params
    requestParams.tags = { ...requestParams.tags, name: name }; // Add name tag

    // Stringify body if needed
    let requestBody = body;
    if (typeof body === 'object' && body !== null && requestParams.headers && requestParams.headers['content-type'] === 'application/json') {
        requestBody = JSON.stringify(body);
    }

    // const response = http[method](url, requestBody, requestParams);
    
    // Ensure the method name is lowercase for k6's http object
    const response = http[method.toLowerCase()](url, requestBody, requestParams);

    // Increment generic total request counter
    // Add tags for better filtering in results
    // NOW response.status will be a valid number (e.g., 200, 404, 500)
    const tags = { name: name, method: method.toUpperCase(), status: response.status, group: params.tags?.group || 'N/A' };
    defaultCustomRequestCount.add(1, tags);

    // Basic check for success (2xx)
    const isSuccess = response.status >= 200 && response.status < 400;
    check(response, {
        [`${name} - status is 2xx`]: (r) => r.status >= 200 && r.status < 400,
    });

    // Add data to generic metrics
    defaultCustomResponseTime.add(response.timings.duration, tags);
    defaultCustomSuccessRate.add(isSuccess, tags); // isSuccess is boolean (true/false), which is valid for Rate metric
    // defaultCustomRequestCount.add(1, tags); // Increment the request count

    return response; // Return the actual k6 response object
}