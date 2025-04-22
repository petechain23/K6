import { sleep, check, group } from 'k6'
import http from 'k6/http'
import {
  BASE_URL, ORDER_EDIT_URL, orderId,
  editOrderResponseTime, editOrderSuccessRate, editOrderRequestCount,
  customTrendRequestCount, customTrendResponseTime, customTrendSuccessRate
} from '../config.js';

// Create custom trends
// const editOrderTrend = new Trend('edit_order_duration');
export function orderEdit(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);
  //Pick a random order_Id
  const randomOrderId = orderId[Math.floor(Math.random() * orderId.length)];
  const order_Id = randomOrderId.order_Id;
  // console.log('Random orderId: ', order_Id);

  //Pick sequential order_Id
  // for (let i = 0; i < orderId.length; i++) {
  //   let order_Id = orderId[i].order_Id;
  //   console.log(`orderId: ${order_Id}`);

  // const payloadEditOrder = JSON.stringify({
  //   metadata: {
  //     external_doc_number: 'editing order'
  //   },
  //   items: [
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 4,
  //       metadata: {
  //         // item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 1,
  //       metadata: {
  //         item_category: 'YSRG',
  //         promotionCodes: 'PROMO00258_216',
  //         promotionOverride: false,
  //         promoEngine: true
  //         // item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RS8GRDQW2Q6CWVCKPKBT',
  //       quantity: 1,
  //       metadata: {
  //         // item_category: 'YVGO'
  //       }
  //     }
  //   ]
  // });
  //issue 
  // const payloadEditOrder = JSON.stringify({
  //   metadata: {
  //     external_doc_number: 'editing order'
  //   },
  //   items: [
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 5,
  //       metadata: {
  //         item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 1,
  //       metadata: {
  //         item_category: 'YSRG',
  //         promotionCodes: 'PROMO00258_216',
  //         promotionOverride: false,
  //         promoEngine: true
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP5ZYR7G78AQW6Y8XM0A',
  //       quantity: 1,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP89SFJV2YSWWW03DKWE',
  //       quantity: 2,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP94FJZMY6XQ3S15N751',
  //       quantity: 3,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RPDZKQ95E57E6NF7C1TH',
  //       quantity: 4,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RQ907GXX37KXR4FSB4PQ',
  //       quantity: 6,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RQD7EHD0ZXXFFNHTG0MP',
  //       quantity: 7,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RS0RYC1ZDQVKQRVZMQ21',
  //       quantity: 8,
  //       metadata: {
  //         item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RS2XJP1JJF9VFJRYNPFK',
  //       quantity: 9,
  //       metadata: {}
  //     }
  //   ],
  //   location_id: 'sloc_01HEW6AGSSH0GCG8XZDC1A7YH0'
  // });

  //MM-QA
  // const payloadEditOrder = JSON.stringify({
  //   metadata: {
  //     external_doc_number: 'editing order'
  //   },
  //   items: [
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 5,
  //       metadata: {
  //         item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RPQATXAMZQVSGGT1X7KS',
  //       quantity: 1,
  //       metadata: {
  //         item_category: 'YSRG',
  //         promotionCodes: 'PROMO00258_216',
  //         promotionOverride: false,
  //         promoEngine: true
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP5ZYR7G78AQW6Y8XM0A',
  //       quantity: 1,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP89SFJV2YSWWW03DKWE',
  //       quantity: 2,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RP94FJZMY6XQ3S15N751',
  //       quantity: 3,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RPDZKQ95E57E6NF7C1TH',
  //       quantity: 4,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RQ907GXX37KXR4FSB4PQ',
  //       quantity: 6,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RQD7EHD0ZXXFFNHTG0MP',
  //       quantity: 7,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01HES9RS0RYC1ZDQVKQRVZMQ21',
  //       quantity: 8,
  //       metadata: {
  //         item_category: 'YVGO'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01HES9RS2XJP1JJF9VFJRYNPFK',
  //       quantity: 9,
  //       metadata: {}
  //     }
  //   ],
  //   location_id: 'sloc_01HEW6AGSSH0GCG8XZDC1A7YH0'
  // });

  //ID-QA (Klungkung-302-BBI-D02-MAIN)
  const payloadEditOrder = JSON.stringify({
    metadata: {
      external_doc_number: 'editing order'
    },
    items: [
      {
        variant_id: 'variant_01H771AV5J5D62ZAKQ340JQJ7S',
        quantity: 1,
        metadata: {
          item_category: 'YLGA'
        }
      },
      {
        variant_id: 'variant_01H729MHHAW56JTRXCC8HYCV1X',
        quantity: 8,
        metadata: {
          item_category: 'YLGA'
        }
      },
      {
        variant_id: 'variant_01H7717GHMWJNHPHAEJVXRN8CS',
        quantity: 60,
        metadata: {
          item_category: 'YLGA'
        }
      },
      {
        variant_id: 'variant_01H7717FZZYW6JD56EZP6D58YF',
        quantity: 16,
        metadata: {
          item_category: 'YLGA'
        }
      },
      {
        variant_id: 'variant_01H7717FZZYW6JD56EZP6D58YF',
        quantity: 1,
        metadata: {
          item_category: 'YRLN'
        }
      },
      {
        variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80',
        quantity: 1,
        metadata: {
          item_category: 'YVGA'
        }
      },
      {
        variant_id: 'variant_01H77192YY9TWRM0GB6F479YQX',
        quantity: 2,
        metadata: {
          item_category: 'YVGA'
        }
      },
      {
        variant_id: 'variant_01HAB20FVGTTJVH12WRE725AC0',
        quantity: 3,
        metadata: {
          item_category: 'YVGA'
        }
      },
      {
        variant_id: 'variant_01HKPZ9PVK8WZQZNYJ76MBNNJ9',
        quantity: 4,
        metadata: {
          item_category: 'YVGO'
        }
      },
      {
        variant_id: 'variant_01H5PMH3V5H3BQDM49D8K88MMJ',
        quantity: 5,
        metadata: {
          item_category: 'YVGA'
        }
      }
    ],
    location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9'
  });
  //ID-Hotfix
  // const payloadEditOrder = JSON.stringify({
  //   metadata: {
  //     external_doc_number: 'editing order'
  //   },
  //   items: [
  //     {
  //       variant_id: 'variant_01H5PMESX1AR52H7BJ4CTHHE80',
  //       quantity: 1,
  //       metadata: {
  //         item_category: 'YVGA'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01H771AVVG9NQMV4VZZ2TK7DTB',
  //       quantity: 1,
  //       metadata: {
  //         item_category: 'YLGA'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01H7717FZZYW6JD56EZP6D58YF',
  //       quantity: 16,
  //       metadata: {
  //         item_category: 'YLGA'
  //       }
  //     },
  //     {
  //       variant_id: 'variant_01H5PMH3V5H3BQDM49D8K88MMJ',
  //       quantity: 2,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01H5PPNH4P1DSY1TA5F2Z8AE3R',
  //       quantity: 3,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01H5PS9EVF5915DRCDD8NDKJAT',
  //       quantity: 4,
  //       metadata: {}
  //     },
  //     {
  //       variant_id: 'variant_01H5SYXQ8EFVBEMXGH2TBBVA7A',
  //       quantity: 5,
  //       metadata: {}
  //     }
  //   ],
  //   location_id: 'sloc_01HGYYZND43JR5B4F1D0HG80Z9'
  // });
  const res = http.post(`${BASE_URL}/${ORDER_EDIT_URL}/${order_Id}`, payloadEditOrder, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
  // editOrderTrend.add(res.timings.duration);
  const body = JSON.parse(res.body)
  // console.log('Order Edit - order_Id: ', body.order.id);
  // console.log('Order Edit - display_id: ', body.order.display_id);
  if (!res.body) {
    console.log(`Empty Response Body for Request`, res.status);
    sleep(2);
  } else {
    check(res, {
      // 'verify status equals 200': (res) => res.status.toString() === '200',
      'Order Edit - verify response status': (r) => r.status === 200,
      'Order Edit - verify update successfully': (r2) => r2.body.includes('editing order')
      // 'verify promotion code included': (r2) => r2.body.includes('PROMO00258_216'), //$.order.items[*].promotion_codes[0]
    });
    editOrderResponseTime.add(res.timings.duration, { vu: vuID });
    editOrderSuccessRate.add(res.status === 200, { vu: vuID });
    editOrderRequestCount.add(1, { vu: vuID });
    // customTrendResponseTime.add(res.timings.duration, { vu: vuID });
    // customTrendSuccessRate.add(res.status === 200, { vu: vuID });
    // customTrendRequestCount.add(1, { vu: vuID });
    sleep(2);
  }
}