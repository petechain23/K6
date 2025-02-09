import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Create custom trends
const coinflipLatency = new Trend('coinflip_duration');

export function coinflip(baseUrl) {
    group("Coinflip game", function () {
        // save response as variable
        let res = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
        check(res, {
            "is status 200": (r) => r.status === 200,
        });
        console.log(`Response time was heads: ${res.timings.duration} ms`);
        // add duration property to metric
        coinflipLatency.add(res.timings.duration);
        sleep(1);
        // mutate for new request
        res = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
        check(res, {
            "is status 200": (r) => r.status === 200,
        });
        console.log(`Response time was tails: ${res.timings.duration} ms`);
        // add duration property to metric
        coinflipLatency.add(res.timings.duration);
        sleep(1);
    });
}