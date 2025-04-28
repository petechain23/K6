import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
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

//   group(
//     'page_1 - https://hei-oms-apac-qa-id-storefront.azurewebsites.net/distributors/auth/login',
//     function () {
//       response = http.post(
//         'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth',
//         '{"email":"dat-tran-niteco@outlook.com","password":"A@a123456789"}',
//         {
//           headers: {
//             accept: 'application/json',
//             'content-type': 'application/json',
//             'idempotency-key': 'bd2c9c1f-782f-4e94-8bf4-0118a8c51008',
//             'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"macOS"',
//           },
//         }
//       )

//       response = http.options(
//         'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth',
//         null,
//         {
//           headers: {
//             accept: '*/*',
//             'access-control-request-headers': 'content-type,idempotency-key',
//             'access-control-request-method': 'POST',
//             origin: 'https://hei-oms-apac-qa-id-storefront.azurewebsites.net',
//             'sec-fetch-mode': 'cors',
//           },
//         }
//       )

//       response = http.get('https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/auth', {
//         headers: {
//           accept: 'application/json',
//           'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
//           'sec-ch-ua-mobile': '?0',
//           'sec-ch-ua-platform': '"macOS"',
//         },
//       })
//     }
//   )

  group(
    
    response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/outlets/fetch?offset=0&limit=20&q=',
        '{"outletDepots":["depot_01HGYXPR1M5HQ229XGC8RDQSJE"],"include_address":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/outlets/fetch?offset=20&limit=20&q=',
        '{"outletDepots":["depot_01HGYXPR1M5HQ229XGC8RDQSJE"],"include_address":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/outlets/fetch?offset=40&limit=20&q=',
        '{"outletDepots":["depot_01HGYXPR1M5HQ229XGC8RDQSJE"],"include_address":true}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/stock-locations?depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE&offset=0&limit=1000',
        {
          headers: {
            accept: 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/variants/depot-variants?region_id=reg_01H5P3E6X97YGENVSW4Z7A5446&depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE&outlet_id=outlet_01HGYY7FV0VXN05YB45T8TFWCW&location_id=sloc_01HGYYZND43JR5B4F1D0HG80Z9&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/variants/depot-variants?region_id=reg_01H5P3E6X97YGENVSW4Z7A5446&depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE&outlet_id=outlet_01HGYY7FV0VXN05YB45T8TFWCW&location_id=sloc_01HGYYZND43JR5B4F1D0HG80Z9&include_empties_deposit=true&allow_empties_return=false&limit=20&offset=0&q=&expand=product.brand&last_id=variant_01H77162NRR4FXV8QPWKMFSPJD',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )
     //----------------------------

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/create',
        '{"order_type":"standard","email":"wayansugiartana23@gmail.com","items":[{"variant_id":"variant_01H5PMESX1AR52H7BJ4CTHHE80","quantity":1,"metadata":{}},{"variant_id":"variant_01H5PMH3V5H3BQDM49D8K88MMJ","quantity":2,"metadata":{}},{"variant_id":"variant_01H7715HCNCN0GW6DC7FP5AEDN","quantity":4,"metadata":{}},{"variant_id":"variant_01H5XWXT9KJ7DN1MFSVX778KDA","quantity":4,"metadata":{}},{"variant_id":"variant_01H5XTJ97RNCWNM9HAR02D257T","quantity":3,"metadata":{}}],"region_id":"reg_01H5P3E6X97YGENVSW4Z7A5446","shipping_methods":[{"option_id":"so_01H5P53FY82T6HVEPB37Z8PFPZ"}],"shipping_address":{"address_1":"MAWANG","country_code":"id","first_name":"Wayan","last_name":"Sugiartana"},"billing_address":{"address_1":"MAWANG","country_code":"id","first_name":"Wayan","last_name":"Sugiartana"},"customer_id":"cus_01HGYYE93B39P94P1SV3ECZQZ5","depot_id":"depot_01HGYXPR1M5HQ229XGC8RDQSJE","outlet_id":"outlet_01HGYY7FV0VXN05YB45T8TFWCW","include_brand":true,"metadata":{"source_system":"OMS"},"location_id":"sloc_01HGYYZND43JR5B4F1D0HG80Z9"}',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-need-review?depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders?expand=outlet&fields=id,display_id,metadata,created_at,extended_status,outlet_id,credit_checked,inventory_checked,promotion_checked&order_type=standard&offset=0&limit=20&order=-created_at&include_count=false&depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      //----------------------------

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01JSW2CK0245Y6VDNSMEBDDF8W?expand=outlet,outlet.geographicalLocations,items,items.variant,items.variant.product,items.variant.product.brand,fulfillments,invoices,customer,depot,payments,cancellation_reason&fields=id,display_id,credit_checked,inventory_checked,promotion_checked,currency_code,status,region,metadata,customer_id,fulfillment_status,extended_status,order_type,external_doc_number,order_reference_number,refundable_amount,refunded_total,refunds,location_id,cancellation_reason_others_description,source_system',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/order-event?order_id=order_01JSW2CK0245Y6VDNSMEBDDF8W',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.post(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/order_01JSW2CK0245Y6VDNSMEBDDF8W',
        '{"is_processing":true}',
        {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'idempotency-key': 'a563ef7a-bab5-4446-84af-d2f279e95d87',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/orders/number-of-order-active?depot_id=depot_01HGYXPR1M5HQ229XGC8RDQSJE',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      response = http.get(
        'https://hei-oms-apac-qa-id-backend.azurewebsites.net/admin/order-event?order_id=order_01JSW2CK0245Y6VDNSMEBDDF8W',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
          },
        }
      )

      
    }
  )
}
