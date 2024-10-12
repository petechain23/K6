//import necessary modules
import http from "k6/http";
import { check } from "k6";
import { group, sleep } from "k6";

//set baseURL
const baseUrl = "https://test.k6.io";

export default function () {

  // visit some endpoints in one group
  group("Contacts flow", function () {
    const res1 = http.get(`${baseUrl}/contacts.php`);
    sleep(1);

    check(res1, {
      "response code was 200": (res) =>
        res.status == 200,
    });

    // return to the home page
    const res2 = http.get(`${baseUrl}/`);
    sleep(1);

    check(res2, {
      "response code was 200": (res) =>
        res.status == 200,
    });

  });

  // Coinflip players in another group
  group("Coinflip game", function () {
    const res1 = http.get(`${baseUrl}/flip_coin.php?bet=heads`);
    sleep(1);

    check(res1, {
      "response code was 200": (res) =>
        res.status == 200,
    });

    const res2 = http.get(`${baseUrl}/flip_coin.php?bet=tails`);
    sleep(1);

    check(res2, {
      "response code was 200": (res) =>
        res.status == 200,
    });
  });
}
