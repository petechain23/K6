// v2/flows/utils/reporting.js
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Function to get top failed requests
function getFailedRequests(metrics) {
    return Object.entries(metrics)
        .filter(([name, metric]) => name.startsWith('http_req_failed{'))
        .sort((a, b) => b[1].values.rate - a[1].values.rate)
        .slice(0, 5)
        .map(([name, metric]) => ({
            endpoint: name.match(/name:(.+?)}/)?.[1] || name,
            failureRate: (metric.values.rate * 100).toFixed(2)
        }));
}

// Function to get errors by status code
function getErrorsByStatus(metrics) {
    return Object.entries(metrics)
        .filter(([name, metric]) => name.startsWith('http_reqs{status:') && !name.includes('200'))
        .sort((a, b) => b[1].values.count - a[1].values.count)
        .slice(0, 5)
        .map(([name, metric]) => ({
            status: name.match(/status:(\d+)/)?.[1] || 'unknown',
            count: metric.values.count
        }));
}

// Function to get slow APIs
function getSlowApis(metrics) {
    return Object.entries(metrics)
        .filter(([name, metric]) => 
            name.startsWith('http_req_duration{') && 
            metric.values && 
            typeof metric.values.p95 === 'number'
        )
        .sort((a, b) => (b[1].values.p95 || 0) - (a[1].values.p95 || 0))
        .slice(0, 5)
        .map(([name, metric]) => ({
            endpoint: name.match(/name:(.+?)}/)?.[1] || name,
            p95: (metric.values.p95 || 0).toFixed(2)
        }));
}

// Function to print metrics summary
function printMetricsSummary(metrics) {
    console.log("-------------------- Custom Metrics Summary --------------------");    // Display top failed requests
    console.log("\n=== Top Failed Requests ===");
    const failedRequests = getFailedRequests(metrics);
    if (failedRequests.length > 0) {
        failedRequests.forEach(({ endpoint, failureRate }, index) => {
            console.log(`${index + 1}. ${endpoint}: ${failureRate}% failure rate`);
        });
    } else {
        console.log("No failed requests found");
    }

    // Display top errors by status code
    console.log("\n=== Top Errors by Status Code ===");
    const errorsByStatus = getErrorsByStatus(metrics);
    if (errorsByStatus.length > 0) {
        errorsByStatus.forEach(({ status, count }, index) => {
            console.log(`${index + 1}. Status ${status}: ${count} occurrences`);
        });
    } else {
        console.log("No error status codes found");
    }

    // Display top slow APIs
    console.log("\n=== Top Slow APIs (p95) ===");
    const slowApis = getSlowApis(metrics);
    if (slowApis.length > 0) {
        slowApis.forEach(({ endpoint, p95 }, index) => {
            console.log(`${index + 1}. ${endpoint}: ${p95}ms (p95)`);
        });
    } else {
        console.log("No slow API calls found");
    }

    // Print success rates
    printSuccessRates(metrics);
}

// Function to print success rates
function printSuccessRates(metrics) {
    console.log("\n=== Success Rates ===");
    let hasSuccessRates = false;
    const successMetrics = {
        'login_success_rate': '1.Login Success Rate',
        'order_creation_success_rate': '2.Order Creation Success Rate',
        'order_editing_success_rate': '3.Order Edit Success Rate',
        'order_editing_retry_success_rate': '4.Order Edit Retry Success Rate',
        'order_editing_retry1_success_rate': '4a.Order Edit Retry 1 Success Rate',
        'order_editing_retry2_success_rate': '4b.Order Edit Retry 2 Success Rate',
        'order_editing_retry3_success_rate': '4c.Order Edit Retry 3 Success Rate',
        'order_updating_success_rate': '5.Order Update Success Rate',
        'order_update_rfd_success_rate': '5a.Order Update RFD Success Rate',
        'order_update_shipped_success_rate': '5b.Order Update Shipped Success Rate',
        'order_update_delivered_success_rate': '5c.Order Update Delivered Success Rate',
        'order_update_paid_success_rate': '5d.Order Update Paid Success Rate',
        'order_update_to_delivered_success_rate': '6.Order Update To Delivered Success Rate',
        'order_invoice_success_rate': '7.Order Invoice Success Rate',
        'order_filter_success_rate': '8.Order Filter Success Rate',
        'order_scrolling_success_rate': '9.Order Scrolling Success Rate',
        'order_search_success_rate': '10.Order Search Success Rate',
        'order_export_success_rate': '11.Order Export Success Rate',
        'outlet_search_success_rate': '12.Outlet Search Success Rate',
        'promo_get_list_success_rate': '13.Promo Get List Success Rate',
        'pl_scrolling_success_rate': '14.Products List Scrolling Success Rate',
        'performance_distributor_success_rate': '15.Performance Distributor Success Rate'
    };    Object.entries(successMetrics).forEach(([metricName, label]) => {
        if (metrics[metricName] && metrics[metricName].values && typeof metrics[metricName].values.rate === 'number') {
            console.log(`${label}: ${(metrics[metricName].values.rate * 100).toFixed(2)}%`);
            hasSuccessRates = true;
        }
    });
    
    if (!hasSuccessRates) {
        console.log("No success rate metrics found");
    }
}

// Main function to generate reports
export function generateReport(data) {
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    // const reportName = `./reports/id_hotfix/TC_010_ordersEditWithRetryFlow_10_VUS_per-vu_times_2_${timestamp}.html`;
    const reportName = `./reports/id_hotfix/order_export${timestamp}.html`;

    // Print metrics summary to console
    printMetricsSummary(data.metrics);
    console.log("-----------------------------------------------------------------");

    // Prepare custom data for HTML report
    const customData = {
        failedRequests: getFailedRequests(data.metrics),
        errorsByStatus: getErrorsByStatus(data.metrics),
        slowApis: getSlowApis(data.metrics)
    };

    // Return report outputs
    return {
        [reportName]: htmlReport(data, { 
            debug: false,
            customData: customData
        }),
        stdout: textSummary(data, { indent: ' ', enableColors: true })
    };
}
