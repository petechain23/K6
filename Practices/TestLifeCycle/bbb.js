import http from 'k6/http';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
        'webtest_constant-vus_TestSummaryReport.html': htmlReport(data, { debug: false }) //true
    }
}

export const options = {
  scenarios: {
    my_web_test: {
      // the function this scenario will execute
      exec: 'webtest',
      executor: 'constant-vus',
      vus: 50,
      duration: '1m',
    },
  },
};

export function webtest() {
  http.get('https://test.k6.io/contacts.php');
  sleep(Math.random() * 2);
}