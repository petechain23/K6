//import necessary modules
import http from "k6/http";
import {  group, sleep } from "k6";
import { Trend } from "k6/metrics";

//set baseURL
const baseUrl = "https://test.k6.io";

// Create custom trend metrics
const contactsLatency = new Trend("contacts_duration");
const coinflipLatency = new Trend("coinflip_duration");

export default function () {
  // Put visits to contact page in one group
  let res;
  group("Contacts flow", function () {
    // save response as variable
    res = http.get(`${baseUrl}/contacts.php`);
    // add duration property to metric
    contactsLatency.add(res.timings.duration);
    sleep(1);

    res = http.get(`${baseUrl}/`);
    // add duration property to metric
    contactsLatency.add(res.timings.duration);
    sleep(1);
  });

  // Coinflip players in another group

  group("Coinflip game", function () {
    // save response as variable
    let res = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
    // add duration property to metric
    coinflipLatency.add(res.timings.duration);
    sleep(1);

    res = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
    // add duration property to metric
    coinflipLatency.add(res.timings.duration);
    sleep(1);
  });
}
