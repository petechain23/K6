import { sharedWorkload, ramupWorkload, thresholdsSettings} from './config.js';
import { setup } from './setup.js';
import { teardown } from './teardown.js';
import { login } from './pages/login.js';
import { orders } from './pages/orders.js';
// import { inventory } from './inventory.js';
// import { fetchPromotions } from './promotion.js';
// import { exportOrders } from './export.js';

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
        console.error('main - Setup failed. Aborting test.');
        return;
    }
    // Way 1:
    try {
        // login(testData.cookies);
        orders(testData.cookies);
        // inventory(testData.cookies);
        // fetchPromotions(testData.cookies);
        // exportOrders(testData.cookies);
    } finally {
        teardown(testData);  // Ensure cleanup runs at the end
    }

    // Way 2:
    // const sessionCookies = login(testData.cookies);
    // // orders(sessionCookies);
    // try {
    //     orders(sessionCookies);
    //     // fetchInventory(sessionCookies);
    //     // fetchPromotions(sessionCookies);
    //     // exportOrders(sessionCookies);
    // }
    // finally { 
    //     teardown(sessionCookies);
    // }
}

export function handleSummary(data) {
    return {
        'externally-controlled_TestSummaryReport.html(2)': htmlReport(data, { debug: false }) //true
    }
  }

// export function handleSummary(data) {
//     return {
//         'TestSummaryReport.html': htmlReport(data), 
//         stdout: textSummary(data, { indent: " ", enableColors: true }),
//     };
// }