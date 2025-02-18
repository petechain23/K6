import { sleep, check, group } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { sharedWorkload, ramupWorkload, thresholdsSettings} from './config.js';
import { setup } from './setup.js';
import { teardown } from './teardown.js';
import { login } from './pages/login.js';
import { orderCreate } from './pages/orders.js';
import { orderEdit } from './pages/orders_edit.js';
import { exportOrders } from './pages/export.js';
// import { inventory } from './inventory.js';
// import { promotions } from './promotion.js';

export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ? sharedWorkload : ramupWorkload
    },
    thresholds: thresholdsSettings.thresholds
};

// export {setup, teardown};

export default function () {
    const testData = setup();  // Get session cookies
    if (!testData || !testData.cookies) {
        console.error('Main - Setup failed. Aborting test.');
        return;
    }
    orderCreate(testData.cookies);
    // Way 1:
    // try {
    //     // login(testData.cookies);
    //     orderCreate(testData.cookies);
    //     // orderEdit(testData.cookies);
    //     // inventory(testData.cookies);
    //     // promotions(testData.cookies);
    //     // sleep(1800);
    //     // exportOrders(testData.cookies);
    // }
    // finally {
    //     teardown(testData);  // Ensure cleanup runs at the end
    // }

    // Way 2:
    // const sessionCookies = login(testData.cookies);
    // try {
    //     orderCreate(sessionCookies);
    //     orderEdit(sessionCookies);
    //     // inventory(testData.cookies);
    //     // fetchPromotions(testData.cookies);
    //     sleep(600);
    //     exportOrders(sessionCookies);
    // } finally {
    //     teardown(testData);  // Ensure cleanup runs at the end
    // }
}

export function handleSummary(data) {
    return {
        'sc1_loadtest_1702_01.html': htmlReport(data, { debug: false }), //true
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
}