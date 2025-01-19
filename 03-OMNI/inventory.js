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
        { target: 20, duration: '3m30s' },
        { target: 0, duration: '1m' },
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
        '{\n  "email": "dat-tran-niteco@outlook.com",\n  "password": "A@a123456789"\n}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': '024eb207-c70b-4f33-bb00-d25342a905c9',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
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
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
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
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-ready-invoiced',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-active',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-need-review',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01J9XM4YQ258Q8FQ6V9V4B3J85?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,fulfillments,invoices,customer,depot,payments&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,refundable_amount,refunded_total,refunds,location_id',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/order-event?order_id=order_01J9XM4YQ258Q8FQ6V9V4B3J85',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01J9XM4YQ258Q8FQ6V9V4B3J85',
        '{"is_processing":true}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': 'eea69e8b-504b-4133-bec2-da9089ba8661',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01J9XM4YQ258Q8FQ6V9V4B3J85',
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

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-active',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/order-event?order_id=order_01J9XM4YQ258Q8FQ6V9V4B3J85',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(1.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=20&limit=20&order=-created_at',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(1.3)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=40&limit=20&order=-created_at',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(4)
    }
  )

  group(
    'page_3 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/inventory',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=all&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-stock-overview',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/focus-of-the-day',
        '{"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-stock-overview',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/focus-of-the-day',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/inventory-levels',
        '{"offset":0,"limit":20,"stock_level":"in_stock","include_stock_level":true,"include_history_incoming":true,"depot_id":"depot_01H5W4GM01MGFA8QK8BXBD9NB8"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/inventory-levels',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory-items/iitem_01H5PMESXSQ9PDJ1HVQSS92QG5/inventory-level-extension/sloc_01J4JW0ZYCWS9Q9Z3M02PCKH79',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-inventory-level',
        '{"id":"ilev_01J4JXTBXAT29K4CWKG0M8BP6R","include_stock_level":true,"include_history_incoming":true,"include_write_off":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/days-on-hand-weekly-trend?depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&location_id=sloc_01J4JW0ZYCWS9Q9Z3M02PCKH79&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-inventory-level',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/sell-in-sell-out?start=2024-09-12T00:00:00.000Z&end=2024-10-12T23:59:59.999Z&depot_id=depot_01H5W4GM01MGFA8QK8BXBD9NB8&depot_location_id=sloc_01J4JW0ZYCWS9Q9Z3M02PCKH79&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(5)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-stock-overview',
        '{"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/focus-of-the-day',
        '{"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/days-on-hand-weekly-trend?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&location_id=sloc_01J4JW0ZYCWS9Q9Z3M02PCKH79&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-stock-overview',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/focus-of-the-day',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/inventory-levels',
        '{"offset":0,"limit":20,"stock_level":"in_stock","include_stock_level":true,"include_history_incoming":true,"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/inventory-levels',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory-items/iitem_01H5PMESXSQ9PDJ1HVQSS92QG5/inventory-level-extension/sloc_01J4GH0H09129FMDQRVYBE82Z6',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-inventory-level',
        '{"id":"ilev_01J4GJHNSEAZYRY23ZYHJTRHZF","include_stock_level":true,"include_history_incoming":true,"include_write_off":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/days-on-hand-weekly-trend?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&location_id=sloc_01J4GH0H09129FMDQRVYBE82Z6&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-inventory-level',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/sell-in-sell-out?start=2024-09-12T00:00:00.000Z&end=2024-10-12T23:59:59.999Z&depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&depot_location_id=sloc_01J4GH0H09129FMDQRVYBE82Z6&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.6)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(2.4)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-stock-overview',
        '{"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H","location_id":"sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/inventory-levels',
        '{"offset":0,"limit":20,"stock_level":"in_stock","include_stock_level":true,"include_history_incoming":true,"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H","location_id":"sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/focus-of-the-day',
        '{"depot_id":"depot_01J20H1ADQDXSGP3K2YPAYTY8H","location_id":"sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory-items/iitem_01H5PMESXSQ9PDJ1HVQSS92QG5/inventory-level-extension/sloc_01J4GG1S0P8GHZ81CNPEY7F0PS',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/get-inventory-level',
        '{"id":"ilev_01J4GJHNTDYVXHS8D5N037SXZ9","include_stock_level":true,"include_history_incoming":true,"include_write_off":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/days-on-hand-weekly-trend?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&location_id=sloc_01J4GG1S0P8GHZ81CNPEY7F0PS&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/performance/sell-in-sell-out?start=2024-09-12T00:00:00.000Z&end=2024-10-12T23:59:59.999Z&depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&depot_location_id=sloc_01J4GG1S0P8GHZ81CNPEY7F0PS&sku=10163',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.9)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":0,"limit":20,"order":{"sku":"DESC"},"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )
      sleep(5.6)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":0,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'POST',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )
      sleep(1.4)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":20,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.9)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":40,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.9)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":60,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.5)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":80,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(0.5)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/inventory/list-inventory-items',
        '{"selectedFields":["sku","description","uom","total_quantity"],"offset":100,"limit":20,"order":{"sku":"DESC"},"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(1.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs',
        '{"dry_run":false,"type":"inventory-export","context":{"list_config":{"skip":0,"take":100,"order":{"sku":"DESC"},"select":["sku","description","uom","total_quantity"]},"filterable_fields":{"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"],"location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"]}}}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': '07cfba73-88c6-4ddf-a1bb-4ae378b5c11c',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs',
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

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs',
        '{"dry_run":false,"type":"inventory-level-transaction-export","context":{"list_config":{},"filterable_fields":{"start":"2024-09-12T00:00:00.000Z","end":"2024-10-12T23:59:59.999Z","location_ids":["sloc_01J4GG1S0P8GHZ81CNPEY7F0PS"],"depot_id":["depot_01J20H1ADQDXSGP3K2YPAYTY8H"]}}}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': 'a1a4502d-fc7c-4e7f-a8c2-ad425eb7bae3',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs',
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
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR8SAHV2H32DBPNQDHD7',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR6Z3WR176TBF86AM2CN',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR8SAHV2H32DBPNQDHD7',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR6Z3WR176TBF86AM2CN',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR8SAHV2H32DBPNQDHD7',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR6Z3WR176TBF86AM2CN',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR8SAHV2H32DBPNQDHD7',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9VFVR6Z3WR176TBF86AM2CN',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(2.9)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9ZHPF9FB6KSAJ65893XS6DK',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9ZHPF9237M1WDHMAZKXVWJ4',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(2)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9ZHPF9237M1WDHMAZKXVWJ4',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs/batch_01J9ZHPF9FB6KSAJ65893XS6DK',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(1)

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(3.3)

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/uploads/download-url',
        '{"file_key":"exports/inventories/inventory-level-transaction-export-1728709347965.csv"}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': 'ba3faf4d-2ce5-4d9a-b69a-5a7cd07df9b1',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/uploads/download-url',
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
      sleep(1.4)
    }
  )

  group(
    'page_4 - https://heiomsapacqaidstorage.blob.core.windows.net/public/exports/inventories/inventory-level-transaction-export-1728709347965.csv',
    function () {
      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/uploads/download-url',
        '{"file_key":"exports/inventories/inventory-export-1728709347961.csv"}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': '149c62a1-334f-4616-9bbf-f409a04cfd08',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
      sleep(5.4)
    }
  )

  group(
    'page_5 - https://heiomsapacqaidstorage.blob.core.windows.net/public/exports/inventories/inventory-export-1728709347961.csv',
    function () {
      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.del('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', '{}', {
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.options(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth',
        null,
        {
          headers: {
            accept: '*/*',
            'access-control-request-headers': 'content-type',
            'access-control-request-method': 'DELETE',
            origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
            'sec-fetch-mode': 'cors',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/store/', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/batch-jobs?limit=100',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01J20H1ADQDXSGP3K2YPAYTY8H&offset=0&limit=20',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })
      sleep(1.1)
    }
  )

  group(
    'page_6 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/auth/login',
    function () {
      response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
        headers: {
          accept: 'application/json',
          'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      })
    }
  )
}
