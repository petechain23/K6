// https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend, Rate, Counter } from 'k6/metrics';

const ramping_vus_Trend = new Trend ('ramping_vus_trend')
const ramping_vus_Rate = new Rate ('ramping_vus_rate')
const ramping_vus_Counter = new Counter ('ramping_vus_counter')

// export function handleSummary(data) {
//     return {
//         'ramping-vus_TestSummaryReport.html': htmlReport(data, { debug: false }), //true
//         stdout: textSummary(data, { indent: ' ', enableColors: true })
//     }
// }

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
  },
};

export default function () {
  const vuID = __VU;
  console.log(`VU#${__VU}`);
  const res = http.get('https://test.k6.io/contacts.php');
  // Injecting sleep
  // Sleep time is 500ms. Total iteration time is sleep + time to finish request.
  check(res, {
    'Verify response status = 200': (r) => r.status === 200
  });
  ramping_vus_Trend.add(res.timings.duration, { vu: vuID })
  ramping_vus_Rate.add(res.status === 200, { vu: vuID })
  // ramping_vus_Rate.add(res.status !== 200, { vu: vuID })
  ramping_vus_Counter.add(1, { vu: vuID })
  sleep(0.5);
}


export function handleSummary(data) {
    let csvData = 'Metric,Value\n';

    if (data.metrics['ramping_vus_counter']) {
        csvData += `Total Requests,${data.metrics['ramping_vus_counter'].values.count}\n`;
    }

    if (data.metrics['ramping_vus_trend']) {
        csvData += `Avg Response Time (ms),${data.metrics['ramping_vus_trend'].values.avg}\n`;
        csvData += `Max Response Time (ms),${data.metrics['ramping_vus_trend'].values.max}\n`;
    }

    if (data.metrics['ramping_vus_rate']) {
        csvData += `Success Rate,${(data.metrics['ramping_vus_rate'].values.rate * 100).toFixed(2)}%\n`;
    }

    return {
        'ramping-vus_TestSummary.csv': csvData,
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
