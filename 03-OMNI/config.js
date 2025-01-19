//define configuration
export const smokeWorkload = {
    executor: 'shared-iterations',
    iterations: 2,
    vus: 2
}

export const thresholdsSettings = {
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // http errors should be less than 1%
    http_req_duration: [{threshold: "p(99)<1000", abortOnFail: false }], // 99% of requests should be below 1s
}

export const breakingWorkload = {
    executor: 'ramping-vus',
    stages: [
        { duration: '10s', target: 20 },
        { duration: '20s', target: 20 },
        // { duration: '50s', target: 40 },
        // { duration: '50s', target: 60 },
        // { duration: '50s', target: 80 },
        // { duration: '50s', target: 100 },
        // { duration: '50s', target: 120 },
        // { duration: '50s', target: 140 },
    ],
}