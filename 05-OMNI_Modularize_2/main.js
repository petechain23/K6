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
import { orderUpdateStatusDelivered } from './pages/orders_update_status_delivered_only.js';
import { exportOrders } from './pages/export.js';
import { ordersGetList } from './pages/orders_get.js';
import { promotions } from './pages/promotion.js';

// Global array to track all response times
const responseTimeData = [];

// Utility to record a response time
export function addResponseTimeMetric(endpoint, duration, vuID, status) {
    responseTimeData.push({
        endpoint: endpoint,
        duration: duration,
        vu: vuID,
        status,
        timestamp: new Date().toISOString()
    });
}

// Convert array to CSV with headers
function convertToCSV(data) {
    const headers = ['endpoint', 'duration(ms)', 'vu', 'status', 'timestamp'];
    const rows = data.map(r =>
        `${r.endpoint},${r.duration},${r.vu},${r.status},${r.timestamp}`
    );
    return [headers.join(','), ...rows].join('\n');
}

// Grouped summary per VU (extra CSV)
function generatePerVuSummary(data) {
    const summary = {};

    for (const entry of data) {
        if (!summary[entry.vu]) summary[entry.vu] = [];
        summary[entry.vu].push(entry);
    }

    let csv = 'vu,total_requests,avg_duration(ms)\n';
    for (const vu in summary) {
        const requests = summary[vu];
        const total = requests.length;
        const avg = requests.reduce((sum, r) => sum + r.duration, 0) / total;
        csv += `${vu},${total},${avg.toFixed(2)}\n`;
    }

    return csv;
}

// Run parallel scenarios
// Define workloads
const workloads = {
    pervu: pervuiterations,
    constant: constantWorkload,
    shared: sharedWorkload,
    rampup: ramupWorkload,
};

// Get selected workload or run all
const selectedWorkload = __ENV.WORKLOAD || 'all';

// Function to generate scenarios with sequential execution
function generateScenarios() {
    if (selectedWorkload !== 'all') {
        return { [selectedWorkload]: workloads[selectedWorkload] };
    }

    let scenarios = {};
    let delay = 0; // Delay in seconds for each scenario

    for (const [name, workload] of Object.entries(workloads)) {
        scenarios[name] = {
            ...workload,
            startTime: `${delay}s`, // Stagger start time for sequential execution
        };
        delay += 300; // Adjust delay time as needed
    }
    return scenarios;
}

// Export K6 options
export const options = {
    scenarios: generateScenarios(),
};

// Main function
export default function () {
    // console.log(`Running VU: ${__VU}, Iteration: ${__ITER}`);

    const testData = setup(); // Get session cookies
    if (!testData || !testData.cookies) {
        console.error('Main - Setup failed. Aborting test.');
        return;
    }
    //   ordersGetList(testData.cookies); // Execute the test function
    // promotions(testData.cookies);
    // sleep(5);
    // orderCreate(testData.cookies);
    // sleep(2); // Delay between requests
    // orderEdit(testData.cookies);
    // sleep(2); // Delay between requests
    // orderUpdateStatus(testData.cookies);
    // sleep(2); // Delay between requests
    orderUpdateStatusDelivered(testData.cookies);
    // exportOrders(testData.cookies);
    // sleep(5); // Delay between requests
    // login(testData.cookies);
}
//Export html
/*
export function handleSummary(data) {
    // Generate a timestamp in YYYY-MM-DD_HH-MM-SS format
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];

    // Generate the report filename dynamically
    //const reportName = `./reports/215544/verify_215544_003_orders_get_list_constant_RETURN${timestamp}.html`;
    // const reportName = `./reports/improve_edit_order/011_create_orders_constant${timestamp}.html`;
    //const reportName = `./reports/improve_edit_order/verify_002_order_edit_constant(id)${timestamp}.html`;
    // const reportName = `./update_orders_rampup${timestamp}.html`;
    // const reportName = `./order_export_constant${timestamp}.html`;
    //const reportName = `./login_constant${timestamp}.html`;
    // const reportName = `./reports/217013/verify_001_217013_combine_rampup(Id-Hotfix)${timestamp}.html`;
    // const reportName = `./reports/219284/219284_order_update_status(Id)${timestamp}.html`;
    // const reportName = `./reports/219284/001_219284_order_create_rampup${timestamp}.html`;
    // const reportName = `./reports/218615/218615_order_combine_rampup_ID${timestamp}.html`;
    return {
        [reportName]: htmlReport(data, { debug: false }),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
*/

// Reports: HTML + Console + CSV
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    const reportName = `./reports/219284/219284_order_update_status(Id)_constant${timestamp}.html`;

    return {
        [reportName]: htmlReport(data, { debug: false }),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'response_times.csv': convertToCSV(responseTimeData),
        'per_vu_summary.csv': generatePerVuSummary(responseTimeData)
    };
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