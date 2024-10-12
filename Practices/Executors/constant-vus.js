// https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-vus/
import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        'constant-vus_TestSummaryReport.html': htmlReport(data, { debug: false }) //true
    }
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
  // Injecting sleep
  // Total iteration time is sleep + time to finish request.
  sleep(0.5);
}