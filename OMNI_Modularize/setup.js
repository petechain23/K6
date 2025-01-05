// import { SharedArray } from 'k6/data';
// import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

import { payload } from './config.js';

export { payload };

export function setup() {
    return { payloads: payload};
}