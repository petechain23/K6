import { sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { constantWorkload, sharedWorkload, pervuiterations, ramupWorkload, thresholdsSettings } from './config.js';
import { setup } from './setup.js';
import { teardown } from './teardown.js';
import { login } from './pages/login.js';
import { orderCreate } from './pages/orders.js';
import { orderEdit } from './pages/orders_edit.js';
import { orderUpdateStatus } from './pages/orders_update_status.js';
import { exportOrders } from './pages/export.js';
import { ordersGetList } from './pages/orders_get.js';
// import { inventory } from './inventory.js';
// import { promotions } from './pages/promotion.js';

/*
export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ? pervuiterations : ramupWorkload
    },
    thresholds: thresholdsSettings.thresholds
};
*/

// Run parallel scenarios
const workloads = {
    pervu: pervuiterations,
    constant: constantWorkload,
    shared: sharedWorkload,
    rampup: ramupWorkload,
};

// Get the current scenario or run all if not specified
const selectedWorkload = __ENV.WORKLOAD || 'all';

export const options = {
    scenarios:
        selectedWorkload === 'all'
            ? Object.keys(workloads).reduce((acc, key) => {
                  acc[key] = workloads[key];
                  return acc;
              }, {})
            : { [selectedWorkload]: workloads[selectedWorkload] },
    thresholds: thresholdsSettings.thresholds,
};

export default function () {
    const testData = setup();  // Get session cookies
    if (!testData || !testData.cookies) {
        console.error('Main - Setup failed. Aborting test.');
        return;
    }

    // 1-Reues sessionCookies from Setup:
    // orderCreate(testData.cookies);
    // sleep(2);
    // orderEdit(testData.cookies);
    // sleep(2);
    // orderUpdateStatus(testData.cookies);
    // sleep(2);
    // sleep(600);
    // exportOrders(testData.cookies);
    // promotions(testData.cookies);
    // sleep(2);
    ordersGetList(testData.cookies);
    // sleep(2);

    // 2-Reues sessionCookies from Setup with try-finnally:
    /*
    // try {
    //     login(testData.cookies);
    //     // orderCreate(testData.cookies);
    //     // orderEdit(testData.cookies);
    //     // inventory(testData.cookies);
    //     // promotions(testData.cookies);
    //     // sleep(300);
    //     // exportOrders(testData.cookies);
    // }
    // finally {
    //     teardown(testData);  // Ensure cleanup runs at the end
    // }
    */

    // 3-Reues sessionCookies from login:
    /*
    const sessionCookies = login(testData.cookies);
    try {
        orderCreate(sessionCookies);
        orderEdit(sessionCookies);
        // inventory(testData.cookies);
        // fetchPromotions(testData.cookies);
        sleep(600);
        exportOrders(sessionCookies);
    } finally {
        teardown(testData);  // Ensure cleanup runs at the end
    }
    */
}


//Export html
export function handleSummary(data) {
    return {
        './01-Reports/shared6_locadTestPromotions.html': htmlReport(data, { debug: false }), //true
        // 'TestSummary.html': htmlReport(data, { debug: false }), //true
        stdout: textSummary(data, { indent: " ", enableColors: true })
    }
}

//Export csv
// export function handleSummary(data) {
//     let csvData = 'Metric,Value\n';

//     if (data.metrics['getOrderRequestCount']) {
//         csvData += `Total Requests,${data.metrics['getOrderRequestCount'].values.count}\n`;
//     }

//     if (data.metrics['getOrderResponseTime']) {
//         csvData += `Avg Response Time (ms),${data.metrics['getOrderResponseTime'].values.avg}\n`;
//         csvData += `Min Response Time (ms),${data.metrics['getOrderResponseTime'].values.min}\n`;
//         csvData += `Max Response Time (ms),${data.metrics['getOrderResponseTime'].values.max}\n`;
//     }

//     // if (data.metrics['getOrderSuccessRate']) {
//     //     csvData += `Success Rate,${(data.metrics['getOrderSuccessRate'].values.rate * 100).toFixed(2)}%\n`;
//     // }
//     if (data.metrics['getOrderSuccessRate'] && data.metrics['getOrderSuccessRate'].values) {
//         let successMetric = data.metrics['getOrderSuccessRate'].values;
        
//         // Correctly calculate success rate: (successful events / total events) * 100
//         let successRate = (successMetric.passes / successMetric.total) * 100 || 0; 
        
//         csvData += `Success Rate,${successRate.toFixed(2)}%\n`;
//     } else {
//         csvData += `Success Rate, N/A\n`; // Handle missing data case
//     }

//     // return {
//     //     // 'sc1_loadtest_2102_00_TestSummary.csv': csvData,
//     //     './01-Reports/002_orders_list_get_constant_LOOP_TestSummary.csv': csvData,
//     //     // './01-Reports/002_create_order_rampup_TestSummary.csv': csvData,
//     //     stdout: textSummary(data, { indent: ' ', enableColors: true }),
//     // };

//     // Generate a timestamp in YYYY-MM-DD_HH-MM-SS format
//     const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];

//     // Generate the report filename dynamically
//     const reportName = `//OneDrive - Niteco Group/HNK/OMS/Ticket/GENERAL_SUPPORT/k6-report/002_orders_list_get_constant_REP_TestSummary${timestamp}.csv`;

//     return {
//         [reportName]: csvData, 
//         stdout: textSummary(data, { indent: ' ', enableColors: true }),
//     };
// }