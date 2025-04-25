import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '1m' },
        { target: 50, duration: '3m' },
        { target: 100, duration: '5m' },
        { target: 20, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  group(
    'page_1 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/auth/login',
    function () {
      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth',
        '{"email":"dat-tran-niteco@outlook.com","password":"A@a123456789"}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': 'a3516fec-4c73-43c9-a8e4-02660f9ab609',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type,idempotency-key',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
    }
  )

  group(
    'page_2 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/orders',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/depots/current-user',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-ready-invoiced',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-active',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-need-review',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(0.9)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01JSGY46Q5M9ZXZQQ3T0DPYQ5Z?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/order-event?order_id=order_01JSGY46Q5M9ZXZQQ3T0DPYQ5Z',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(4.4)
    }
  )

  group(
    'page_4 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/performance/distributor-v2',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/performance/distributor-v2',
        {
          headers: {
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(0.8)
      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/feature-flags/list',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/depots/current-user',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&month_index=3',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/volumes-by-channel?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&month_index=3',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/aso-vs-outlet-universe?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/sell-in-sell-out?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-to-cash-timespan?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfillment-rate?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfilled-within-sla?year=2025',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/variants?limit=10&offset=0',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/chart-settings?depot_id=null&distributor_id=null&expand=brand_volume_target_settings',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(1.7)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&month_index=3',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(3.6)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(6.6)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&month_index=3&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/volumes-by-channel?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&month_index=3&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/aso-vs-outlet-universe?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/sell-in-sell-out?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-to-cash-timespan?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfillment-rate?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfilled-within-sla?year=2025&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/chart-settings?depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE&distributor_id=null&expand=brand_volume_target_settings',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(1.1)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&month_index=3&depot_ids[0]=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(2.4)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(5.8)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&month_index=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/volumes-by-channel?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&month_index=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/aso-vs-outlet-universe?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/sell-in-sell-out?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-to-cash-timespan?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfillment-rate?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfilled-within-sla?year=2025&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/chart-settings?depot_id=depot_01H6X2SJQBKCBW1HKAEFSB42WD&distributor_id=null&expand=brand_volume_target_settings',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(1.1)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&month_index=3&depot_ids[0]=depot_01H6X2SJQBKCBW1HKAEFSB42WD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(8.3)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(7.2)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/volumes-by-channel?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/aso-vs-outlet-universe?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/sell-in-sell-out?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-to-cash-timespan?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfillment-rate?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/operational-efficiency/orders-fulfilled-within-sla?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/chart-settings?depot_id=depot_01HYCK727191J7RRDQT64FQEFS&distributor_id=null&expand=brand_volume_target_settings',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(0.9)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(7.1)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(5)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/overall-volume-sold-for-year?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/high-level/brand-volume-target?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/distributor360/sales-distribution/orders-by-platform?year=2025&month_index=3&depot_ids[0]=depot_01HYCK727191J7RRDQT64FQEFS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(10.1)
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
    }
  )
}
