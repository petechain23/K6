import { coinflip } from "./coinflip.js";
import { contacts } from "./contacts.js";
import { thresholdsSettings, breakingWorkload, smokeWorkload } from "./config.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ? breakingWorkload : smokeWorkload
    },
    thresholds: thresholdsSettings
};

const baseUrl = "https://test.k6.io";

export default function () {
    contacts(baseUrl);
    coinflip(baseUrl);
}

export function handleSummary(data) {
    return {
        'TestSummaryReport.html': htmlReport(data, { debug: true }), //true
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
}