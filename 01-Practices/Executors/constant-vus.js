// https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-vus/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend, Rate, Counter, Metric } from 'k6/metrics';

const constant_vus_Trend = new Trend ('constant_vus_trend')
const constant_vus_Rate = new Rate ('constant_vus_rate')
const constant_vus_Counter = new Counter ('constant_vus_counter')

// export function handleSummary(data) {
//     return {
//         'constant-vus_TestSummaryReport.html': htmlReport(data, { debug: false }), //true
//         stdout: textSummary(data, { indent: ' ', enableColors: true })
//       }
// }

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
  const vuID = __VU;
  console.log(`VU#${__VU}`);
  const res = http.get('https://test.k6.io/contacts.php');
  // Injecting sleep
  // Sleep time is 500ms. Total iteration time is sleep + time to finish request.
  check(res, {
    'Verify response status = 200': (r) => r.status === 200
  });
  constant_vus_Trend.add(res.timings.duration, { vu: vuID })
  constant_vus_Rate.add(res.status === 200, { vu: vuID })
  // constant_vus_Rate.add(res.status !== 200, { vu: vuID })
  constant_vus_Counter.add(1, { vu: vuID })
  sleep(0.5);
}


export function handleSummary(data) {
    let csvData = 'Metric,Value\n';

    if (data.metrics['constant_vus_counter']) {
        csvData += `Total Requests,${data.metrics['constant_vus_counter'].values.count}\n`;
    }

    if (data.metrics['constant_vus_trend']) {
        csvData += `Avg Response Time (ms),${data.metrics['constant_vus_trend'].values.avg}\n`;
        csvData += `Max Response Time (ms),${data.metrics['constant_vus_trend'].values.max}\n`;
    }

    if (data.metrics['constant_vus_rate']) {
        csvData += `Success Rate,${(data.metrics['constant_vus_rate'].values.rate * 100).toFixed(2)}%\n`;
    }

    return {
        'constant-vus_TestSummary.csv': csvData,
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}


