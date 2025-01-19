import { login } from "./login.js";
// import { orderCreate , orderEdit } from "./orders.js";
// import { invoices } from "./invoices.js";
import { thresholdsSettings, breakingWorkload, smokeWorkload } from "./config.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ? breakingWorkload : smokeWorkload
    },
    thresholds: thresholdsSettings
};

const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';

export default function () {
    login(baseUrl);
    // orderEdit(baseUrl);
    // orderCreate(baseUrl);
    // invoices(baseUrl);
}

export function handleSummary(data) {
    return {
        'TestSummaryReport.html': htmlReport(data, { debug: false }), //true
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
}