import { sleep, group } from 'k6';
import http from 'k6/http';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics
const loginTrend = new Trend('login_duration');
const loginSuccessRate = new Rate('login_success_rate');
const ordersTrend = new Trend('orders_duration');
const ordersSuccessRate = new Rate('orders_success_rate');
const requestCounter = new Counter('http_requests');

export const options = {
  cloud: {
    distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Overall: {
      executor: 'per-vu-iterations',
      gracefulStop: '30s',
      vus: 1,
      iterations: 1,
      maxDuration: '1m30s',
      exec: 'overall',
    },
  },
};

const BASE_URL = 'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net';
const FRONTEND_URL = 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net';
const HEADERS = {
  'sec-ch-ua-platform': '"Windows"',
  'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  'sec-ch-ua-mobile': '?0',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
};

export function overall() {
  let response

  group(
    'Login - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/auth/login',
    function () {
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        '{"email":"dat-tran-niteco@outlook.com","password":"A@a123456789"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'idempotency-key': 'c0c45b27-0b93-4ead-94a8-23888abf25b1',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type,idempotency-key',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
    }
  )

  group(
    'Orders - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/orders',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/depots/current-user',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/store/',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-ready-invoiced',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-active',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-need-review',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JS46MBYJEQGVYF3R2PFQYAVS?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS46MBYJEQGVYF3R2PFQYAVS',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(4.2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-ready-invoiced?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-need-review?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JS3CHWE5W1DBE5BBKMMJVT6S?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS3CHWE5W1DBE5BBKMMJVT6S',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.4)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=40&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=60&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=80&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=100&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPD4E4YBTA04ZX8CZFC72G?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPD4E4YBTA04ZX8CZFC72G',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // is_processing
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPD4E4YBTA04ZX8CZFC72G',
        '{"is_processing":true}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'idempotency-key': '7500c618-90ba-4349-af63-951319c46896',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPD4E4YBTA04ZX8CZFC72G',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type,idempotency-key',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPD4E4YBTA04ZX8CZFC72G',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/stock-locations?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&offset=0&limit=1000',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/variants/depot-variants?region_id=reg_01H5P3E6X97YGENVSW4Z7A5446&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&outlet_id=outlet_01HDFYPV8SVAC9FZYXFVCM7RE6&include_empties_deposit=true&limit=20&offset=0&q=&location_id=sloc_01H71WS83VG35Q4Y5876D5G8ZE',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10164.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F54070%2FHNK-Ecomm%2520Packshot_320%2520ml_24%2520CANS-11.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F54070%2FHNK-Ecomm%2520Packshot_320%2520ml_24%2520CANS-11.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53076%2FGS%2520-%252024CANS-SKU%2520IMAGE-03.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53076%2FGS%2520-%252024CANS-SKU%2520IMAGE-03.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F54026%2F54026_RDL_CAN_320.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=http%3A%2F%2Flocalhost%3A9000%2Fuploads%2Fdownload-1690776310146.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F63528%2FMicrosoftTeams-image.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F1867%2FImages%2FBINTANG%2520DRAUGHT%2520BEER%252020L.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F1867%2FImages%2FBINTANG%2520DRAUGHT%2520BEER%252020L.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10167.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F65039%2FImages%2FFA_440%2520x%2520440_SKU_BAM%2520PINT%25201%2520X%252024.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F65039%2FImages%2FFA_440%2520x%2520440_SKU_BAM%2520PINT%25201%2520X%252024.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F60983%2FMicrosoftTeams-image%2520%283%29.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F60983%2FMicrosoftTeams-image%2520%283%29.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F62818%2FBintang%2520Crystal%2520Multipack%25204.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F62818%2FBintang%2520Crystal%2520Multipack%25204.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F60970%2FBTG_Crystal_24x330-01.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(10.5)

      // Edit
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/edit/order_01JRYPD4E4YBTA04ZX8CZFC72G',
        '{"metadata":{"external_doc_number":"editing order"},"items":[{"variant_id":"variant_01H7717FZZYW6JD56EZP6D58YF","quantity":1,"metadata":{"item_category":"YRLN"}},{"variant_id":"variant_01H5PMESX1AR52H7BJ4CTHHE80","quantity":1,"metadata":{"item_category":"YVGA"}},{"variant_id":"variant_01H771AVVG9NQMV4VZZ2TK7DTB","quantity":1,"metadata":{"item_category":"YLGA"}},{"variant_id":"variant_01H7717FZZYW6JD56EZP6D58YF","quantity":16,"metadata":{"item_category":"YLGA"}},{"variant_id":"variant_01H5PPNH4P1DSY1TA5F2Z8AE3R","quantity":2,"metadata":{}}],"location_id":"sloc_01H71WS83VG35Q4Y5876D5G8ZE"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/edit/order_01JRYPD4E4YBTA04ZX8CZFC72G',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.7)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-ready-invoiced?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-need-review?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPD4E4YBTA04ZX8CZFC72G?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPD4E4YBTA04ZX8CZFC72G',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-active?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPD4E4YBTA04ZX8CZFC72G',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFVZWW55MME1TYSFJE7VG?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFVZWW55MME1TYSFJE7VG',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // is_processing
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFVZWW55MME1TYSFJE7VG',
        '{"is_processing":true}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'idempotency-key': '7c2dd704-a119-45ad-86ec-22d1a444572e',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFVZWW55MME1TYSFJE7VG',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type,idempotency-key',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFVZWW55MME1TYSFJE7VG',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-active?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-active?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=40&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-active?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=60&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-active?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=80&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFVZWW55MME1TYSFJE7VG',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JS3CHWE5W1DBE5BBKMMJVT6S?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS3CHWE5W1DBE5BBKMMJVT6S',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.7)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-need-review?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS3CHWE5W1DBE5BBKMMJVT6S',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYYVC36AMMX7Y97GDGWBZQT?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYYVC36AMMX7Y97GDGWBZQT',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.7)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-need-review?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order-need-review?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=40&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYYVC36AMMX7Y97GDGWBZQT',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JS3CHWE5W1DBE5BBKMMJVT6S?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS3CHWE5W1DBE5BBKMMJVT6S',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=123456',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.5)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=123456',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01HD684R8ADTZ2WJPT0DQS4FZJ?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HD684R8ADTZ2WJPT0DQS4FZJ',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(5.2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=123456',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(6.2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=OMS',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.5)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JD4BZW5H05VQF3SG8GE0NNS7?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JD4BZW5H05VQF3SG8GE0NNS7',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=OMS',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&q=OMS',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1825C%2FToko%2520Bintang%2520SKU_HNK%2520Pint-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(4)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53063%2F53063_HNK_PINT_CP4.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JS3CHWE5W1DBE5BBKMMJVT6S?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JS3CHWE5W1DBE5BBKMMJVT6S',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=pending',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1820%2FImages%2FToko%2520Bintang%2520SKU_HNK%2520BTG-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10165.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFV732EWGB7XH9P4WG8AC?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFV732EWGB7XH9P4WG8AC',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // is_processing
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFV732EWGB7XH9P4WG8AC',
        '{"is_processing":true}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'idempotency-key': '23ed3dfd-b305-44bc-bbb1-d595f62a046f',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFV732EWGB7XH9P4WG8AC',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type,idempotency-key',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFV732EWGB7XH9P4WG8AC',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(4.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=processing',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYYVC36AMMX7Y97GDGWBZQT?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYYVC36AMMX7Y97GDGWBZQT',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=processing',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=40&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=processing',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.7)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=60&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=processing',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.7)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01HQ5F0X3D86PA76A2HJP8WWWH?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3)

      // inventory-checked
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/inventory-checked/order_01HQ5F0X3D86PA76A2HJP8WWWH',
        null,
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/credit-checked/order_01HQ5F0X3D86PA76A2HJP8WWWH',
        null,
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-need-review?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/number-of-order-ready-invoiced?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.4)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(6.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.5)

      // Update
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01HQ5F0X3D86PA76A2HJP8WWWH"],"status":"ready_for_delivery","expected_delivery_date":"2025-04-26T02:31:33.058Z","term_of_payments":"current_credit_terms"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(5.2)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)

      // Update
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01HQ5F0X3D86PA76A2HJP8WWWH"],"status":"shipped"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01HQ5F0X3D86PA76A2HJP8WWWH"],"status":"delivered"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01HQ5F0X3D86PA76A2HJP8WWWH',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(16.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=invoiced',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64930%2FImages%2FFA_440%2520x%2520440_SKU_BTG%2520CRYSTAL%2520BREMER%25201%2520X%252012.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYET0TDF551D14Z8PFTGSGA?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYET0TDF551D14Z8PFTGSGA',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(16.6)

      // Update
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01JRYET0TDF551D14Z8PFTGSGA","order_01JJ3WF1K5R1ZHCEGJWAVFRCXR","order_01JJ3R651M2ER0YW0YWDXM79AN","order_01JJ3QKF5E2XKC06PM6YW67A1S","order_01JJ3QFEYFF7R3ZNBD62QN16VV"],"status":"shipped","expected_delivery_date":"2025-04-26T02:29:47.951Z","term_of_payments":"current_credit_terms"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYET0TDF551D14Z8PFTGSGA',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(6.1)

      // Update
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01JRYET0TDF551D14Z8PFTGSGA","order_01JJ3WF1K5R1ZHCEGJWAVFRCXR","order_01JJ3R651M2ER0YW0YWDXM79AN","order_01JJ3QKF5E2XKC06PM6YW67A1S","order_01JJ3QFEYFF7R3ZNBD62QN16VV"],"status":"delivered"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYET0TDF551D14Z8PFTGSGA',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(12)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&extended_status[0]=processing',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYYVC36AMMX7Y97GDGWBZQT?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYYVC36AMMX7Y97GDGWBZQT',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.4)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFXNBNRZGRBYWM6VTDSJ6?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFXNBNRZGRBYWM6VTDSJ6',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.8)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/cancellation-reasons',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(9)

      // Update
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        '{"order_ids":["order_01JRYPFXNBNRZGRBYWM6VTDSJ6"],"status":"cancelled","cancellation_reason_id":"reason_01JHPP5TQYXJEJ0Y8AG6SGWRES"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-extend-status/update',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFXNBNRZGRBYWM6VTDSJ6',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/orders/order_01JRYPFXNBNRZGRBYWM6VTDSJ6?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-event?order_id=order_01JRYPFXNBNRZGRBYWM6VTDSJ6',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1819%2FImages%2FToko%2520Bintang%2520SKU_BTG%2520Bremer-04.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2FE1830%2FToko%2520Bintang%2520SKU_BTG%2520Pint%2520KRAT-03.png',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(14.5)
    }
  )

  group(
    'Export - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/export',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // Export Get-list
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        '{"selectedFields":["order_id","order_display_id","order_created_at","order_extended_status","outlet_outlet_name","customer_full_name","total_skus","order_external_number","order_total","order_currency_code","order_type"],"offset":0,"limit":20,"search_columns":["order_display_id","order_external_number","order_extended_status","outlet_outlet_name","customer_full_name"],"order":{"order_created_at":"DESC"},"created_at":{"gt":"2025-03-25T00:00:00.000Z","lt":"2025-04-25T23:59:59.999Z"}}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(11.9)

      // Export Get-list
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        '{"selectedFields":["order_id","order_display_id","order_created_at","order_extended_status","outlet_outlet_name","customer_full_name","total_skus","order_external_number","order_total","order_currency_code","order_type"],"offset":0,"limit":20,"search_columns":["order_display_id","order_external_number","order_extended_status","outlet_outlet_name","customer_full_name"],"order":{"order_created_at":"DESC"},"created_at":{"gt":"2025-03-01T00:00:00.000Z","lt":"2025-03-31T23:59:59.999Z"}}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.5)

      // Export Get-list
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        '{"selectedFields":["order_id","order_display_id","order_created_at","order_extended_status","outlet_outlet_name","customer_full_name","total_skus","order_external_number","order_total","order_currency_code","order_type"],"offset":0,"limit":20,"search_columns":["order_display_id","order_external_number","order_extended_status","outlet_outlet_name","customer_full_name"],"order":{"order_created_at":"DESC"},"created_at":{"gt":"2025-03-01T00:00:00.000Z","lt":"2025-03-31T23:59:59.999Z"},"depot_id":["depot_01HGYXPR1M5HQ229XGC8RDQSJE"]}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.2)

      // Export Get-list
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        '{"selectedFields":["order_id","order_display_id","order_created_at","order_extended_status","outlet_outlet_name","customer_full_name","total_skus","order_external_number","order_total","order_currency_code","order_type"],"offset":0,"limit":20,"search_columns":["order_display_id","order_external_number","order_extended_status","outlet_outlet_name","customer_full_name"],"order":{"order_created_at":"DESC"},"created_at":{"gt":"2025-03-01T00:00:00.000Z","lt":"2025-03-31T23:59:59.999Z"},"depot_id":["depot_01H6X2SJQBKCBW1HKAEFSB42WD"]}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(10.3)

      // Export Get-list
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        '{"selectedFields":["order_id","order_display_id","order_created_at","order_extended_status","outlet_outlet_name","customer_full_name","total_skus","order_external_number","order_total","order_currency_code","order_type"],"offset":0,"limit":20,"search_columns":["order_display_id","order_external_number","order_extended_status","outlet_outlet_name","customer_full_name"],"order":{"order_created_at":"DESC"},"created_at":{"gt":"2025-03-01T00:00:00.000Z","lt":"2025-03-31T23:59:59.999Z"}}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/order-export/get-list',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.2)

      // Click Export
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs',
        '{"dry_run":false,"type":"line-items-orders-export","context":{"list_config":{"skip":0,"take":100,"order":{"order_created_at":"DESC"},"select":["line_item_id","order_id","order_display_id","order_status","order_created_at","order_currency_code","order_fulfillment_status","order_payment_status","order_extended_status","order_external_number","order_source_system","order_promotion_code","order_coupon_code","order_current_invoiced_number","order_historical_invoiced_number","address_address_1","address_address_2","address_country_code","address_city","address_postal_code","store_depot_name","outlet_outlet_id","outlet_outlet_name","outlet_external_id","outlet_customer_type","outlet_business_organizational_segment","outlet_channels","outlet_sub_channels","outlet_business_segments","outlet_classifications","depot_external_id","delivery_date","order_subtotal","order_shipping_total","order_discount_total","order_gift_card_total","order_refunded_total","order_tax_total","order_total","order_region_id","customer_id","customer_first_name","customer_last_name","customer_email","variant_sku","product_title","line_item_quantity","line_item_total","line_item_total_volume","uom","product_volume","order_external_doc_number","order_invoiced_date","brand_name","product_pack_size","variant_sku_type","geographical_location_region","order_invoiced_status","depot_business_unit","outlet_sale_area","contact_external_id","order_cancellation_reason","order_cancellation_reason_others_description"],"relations":["customer","shipping_address"],"export_type":"csv"},"filterable_fields":{"created_at":{"gt":"2025-03-01T00:00:00.000Z","lt":"2025-03-31T23:59:59.999Z"}}}}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'idempotency-key': 'bccf7c7d-6dc1-4884-a78c-d3fb63ca2344',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type,idempotency-key',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/store/',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs/batch_01JRYEWMQ7EZ5002X601ZWWR65',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/store/',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs/batch_01JRYEWMQ7EZ5002X601ZWWR65',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs/batch_01JSNCQ6AQVX4SMM4P8GSY4G61',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs/batch_01JSNCQ6AQVX4SMM4P8GSY4G61',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(0.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs/batch_01JSNCQ6AQVX4SMM4P8GSY4G61',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(5.3)
    }
  )

  group(
    'Promotions - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/promotions',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/promotions/info',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/promotions/promotion-allocations?offset=0&limit=20&start_after=2025-03-01T00:00:00.000Z&end_before=2025-06-01T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.2)
    }
  )

  group(
    'Performance - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/performance',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/chart-settings?depot_id=null&distributor_id=null',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/sales-volume-information?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/sales-case-fill-rate?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/transaction-capture?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/distribution-transaction-capture-and-call-compliance?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/order-sla?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/chart-aso',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/call-effectiveness?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.4)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.3)
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F53993%2FSkywalker_Pil_32cl_01%2520%25282%2529.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10163.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F10164.png&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg&w=48&q=75&url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F64709%2FFA_BAM_BREMER_PRODUCT%2520IMAGE.jpg',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/_next/image?url=https%3A%2F%2Fhei-id1-b2botcom-p-asea-cep-backend-1.azureedge.net%2Fcatalog%2F14a8a%2F60970%2FBTG_Crystal_24x330-01.jpg&w=48&q=75',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-dest': 'image',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(12.8)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(3.3)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/sales-volume-information?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/sales-case-fill-rate?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/transaction-capture?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/distribution-transaction-capture-and-call-compliance?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/order-sla?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/call-effectiveness?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.6)
    }
  )

  group(
    'Performance - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/performance/execution',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/contacts/sales-rep-by-depot?depot_external_ids=000-MAIN',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z&depot_ids=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z&depot_ids[0]=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-03-25T00:00:00.000Z&end=2025-04-25T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(12.4)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids[0]=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01H5W4GM01MGFA8QK8BXBD9NB8',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(6.7)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(2.9)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/contacts/sales-rep-by-depot?depot_external_ids=302-BBI-D02-MAIN',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.3)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/contacts/sales-rep-by-depot?depot_external_ids=302-BBI-D03-MAIN',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(9.2)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_ids=0203T01',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_external_id=0203T01',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_external_id=0203T01',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(9.9)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/360-kpi-dashboard?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_ids=0202T30',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-sales-rep?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_external_id=0202T30',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/performance/brand-volume-by-name?start=2025-01-01T00:00:00.000Z&end=2025-04-30T23:59:59.999Z&include_brand=true&offset=0&limit=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD&sales_rep_external_id=0202T30',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(5.4)
    }
  )

  group(
    'Inventory - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/inventory',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/stock-locations?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&offset=0&limit=20',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // get-stock-overview
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/get-stock-overview',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/stock-locations?depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&offset=0&limit=20',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // focus-of-the-day
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/focus-of-the-day',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/get-stock-overview',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/focus-of-the-day',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // inventory-levels
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/inventory-levels',
        '{"offset":0,"limit":20,"stock_level":"in_stock","include_stock_level":true,"include_history_incoming":true,"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // get-total-of-pendings
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory-transfer-request/get-total-of-pendings',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8","type":"stock_sent"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      // get-total-of-pendings
      response = http.post(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory-transfer-request/get-total-of-pendings',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8","type":"stock_received"}',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory/inventory-levels',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory-transfer-request/get-total-of-pendings',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/inventory-transfer-request/get-total-of-pendings',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(7.1)

      response = http.del(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        null,
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-method': 'DELETE',
            'access-control-request-headers': 'content-type',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-dest': 'empty',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/store/',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/stock-locations?depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&offset=0&limit=20',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/store/',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/stock-locations?depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&offset=0&limit=20',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
      sleep(1.1)
    }
  )

  group(
    'Logout - https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net/distributors/auth/login',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend-hotfix.azurewebsites.net/admin/auth',
        {
          headers: {
            'sec-ch-ua-platform': '"Windows"',
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            origin: 'https://hei-oms-apac-qa-id-storefront-hotfix.azurewebsites.net',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'active',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          },
        }
      )
    }
  )
}
