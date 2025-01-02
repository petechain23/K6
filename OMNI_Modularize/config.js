//define configuration
// export const smokeWorkload = {
//     executor: 'shared-iterations',
//     iterations: 5,
//     vus: 1
// }

// export const thresholdsSettings = {
//     //http_req_failed: [{ threshold: "rate<0.1", abortOnFail: true }],
//     http_req_failed: ["rate<0.1"],
//     http_req_duration: ["p(99)<1000"],
// }

// export const breakingWorkload = {
//     executor: 'ramping-vus',
//     stages: [
//         { duration: '10s', target: 20 },
//         { duration: '50s', target: 20 },
//         { duration: '50s', target: 40 },
//         // { duration: '50s', target: 60 },
//         // { duration: '50s', target: 80 },
//         // { duration: '50s', target: 100 },
//         // { duration: '50s', target: 120 },
//         // { duration: '50s', target: 140 },
//     ],
// }


// export const options = {
//     scenarios: {
//       Authen_login: {
//         executor: 'ramping-vus',
//         gracefulStop: '1s',
//         stages: [
//           { target: 5, duration: '5s' },
//           { target: 5, duration: '10' },
//           { target: 0, duration: '5s' },
//         ],
//         gracefulRampDown: '1s',
//         exec: 'login',
//       },
//     },
//   }


//1
// export const sharedWorkload = {
//     scenarios: {
//         Scenario_1: {
//             executor: 'shared-iterations',
//             gracefulStop: '1s',
//             vus: 5,
//             iterations: 10,
//             maxDuration: '30s',
//             gracefulRampDown: '1s',
//             exec: 'login',
//         },
//       }
// }

export const sharedWorkload = {
    executor: 'shared-iterations',
    vus: 2,
    iterations: 2,
    maxDuration: '5s'
}

//1.1
export const ramupWorkload = {
    executor: 'ramping-vus',
    gracefulStop: '5s',
    stages: [
        { target: 5, duration: '5s' },
        { target: 10, duration: '1m' },
        { target: 5, duration: '5s' },
    ],
    gracefulRampDown: '5s'
}

//3
export const thresholdsSettings = {
    // thresholds: {
    //     'http_req_duration{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
    //       { threshold: 'p(99)<=300', abortOnFail: true },
    //     ],
    //     'http_req_failed{url:https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth}': [
    //       { threshold: 'rate<=0.01', abortOnFail: true },
    //     ],
    //   }


    thresholds: {
        http_req_duration: [{ threshold: 'p(95)<=300', abortOnFail: true }],
        http_req_failed: [{ threshold: 'rate<=0.5', abortOnFail: true }]

    }

    // http_req_failed: ["rate<0.1"],
    // http_req_duration: ["p(99)<3000"]
}
