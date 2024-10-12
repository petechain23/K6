// https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/externally-controlled/
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        'externally-controlled_TestSummaryReport.html': htmlReport(data, { debug: false }) //true
    }
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'externally-controlled',
      vus: 10,
      maxVUs: 50,
      duration: '10m',
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
}