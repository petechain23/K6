//define configuration
export const smokeWorkload = {
    executor: 'shared-iterations',
    iterations: 5,
    vus: 1
}

export const thresholdsSettings = {
    //http_req_failed: [{ threshold: "rate<0.1", abortOnFail: true }],
    http_req_failed: ["rate<0.1"],
    http_req_duration: ["p(99)<1000"],
}

export const breakingWorkload = {
    executor: 'ramping-vus',
    stages: [
        { duration: '10s', target: 20 },
        { duration: '50s', target: 20 },
        { duration: '50s', target: 40 },
        // { duration: '50s', target: 60 },
        // { duration: '50s', target: 80 },
        // { duration: '50s', target: 100 },
        // { duration: '50s', target: 120 },
        // { duration: '50s', target: 140 },
    ],
}