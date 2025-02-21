//https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/shared-iterations/
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { Trend, Rate, Counter, Metric } from 'k6/metrics';

const shared_iterations_Trend = new Trend ('shared_iterations_trend')
const shared_iterations_Rate = new Rate ('shared_iterations_rate')
const shared_iterations_Counter = new Counter ('shared_iterations_counter')

// export function handleSummary(data) {
//     return {
//         'shared-iterations_TestSummaryReport.html': htmlReport(data, { debug: false }), //true
//         stdout: textSummary(data, { indent: ' ', enableColors: true })
//     }
// }

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 200,
      maxDuration: '30s'
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
  shared_iterations_Trend.add(res.timings.duration, { vu: vuID })
  shared_iterations_Rate.add(res.status === 200, { vu: vuID })
  // shared_iterations_Rate.add(res.status !== 200, { vu: vuID })
  shared_iterations_Counter.add(1, { vu: vuID })
  sleep(0.5);
}


export function handleSummary(data) {
    let csvData = 'Metric,Value\n';

    if (data.metrics['shared_iterations_counter']) {
        csvData += `Total Requests,${data.metrics['shared_iterations_counter'].values.count}\n`;
    }

    if (data.metrics['shared_iterations_trend']) {
        csvData += `Avg Response Time (ms),${data.metrics['shared_iterations_trend'].values.avg}\n`;
        csvData += `Max Response Time (ms),${data.metrics['shared_iterations_trend'].values.max}\n`;
    }

    if (data.metrics['shared_iterations_rate']) {
        csvData += `Success Rate,${(data.metrics['shared_iterations_rate'].values.rate * 100).toFixed(2)}%\n`;
    }

    return {
        'shared-iterations_TestSummary.csv': csvData,
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

