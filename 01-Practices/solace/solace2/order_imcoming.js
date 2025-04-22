import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  //vus: 3, // 10 virtual users
  // duration: '1s', // Run for 30 seconds
};

export default function () {
  // Random quantity: Math.floor(Math.random() * 1000),
  // timestamp: new Date().toISOString()
  const placeholder1 = new Date().toISOString()
  const payload = JSON.stringify({
    salesOrder: [
      {
        orderNumber: `CO250220-00002_${placeholder1}`,
        localFields: [
          {
            fieldName: 'semId',
            fieldValue: '10016231'
          },
          {
            fieldName: 'serialNumber',
            fieldValue: '21915'
          },
          {
            fieldName: 'warehouseId',
            fieldValue: '302-BBI-001-MAIN'
          },
          {
            fieldName: 'sender',
            fieldValue: 'DOT_Indonesia'
          },
          {
            fieldName: 'receiver',
            fieldValue: 'OMS_Indonesia'
          },
          {
            fieldName: 'isDeliveredOnTime',
            fieldValue: 'false'
          },
          {
            fieldName: 'isDeliveredInFull',
            fieldValue: 'false'
          },
          {
            fieldName: 'promotionCode'
          },
          {
            fieldName: 'isReward',
            fieldValue: 'false'
          }
        ],
        salesOrderType: 'B2B',
        orderReferenceIDs: [
          {
            referenceID: `659a7d66fc5841409e5cee9911b3679b_${placeholder1}`,
            referenceSystem: 'B2B'
          }
        ],
        shopId: '10118111',
        orderDateTimestamps: [
          {
            dateTimeStampType: 'createdDate',
            dateTime: '2025-02-20T08:24:07.1459537Z'
          },
          {
            dateTimeStampType: 'modifiedDate',
            dateTime: '2025-02-20T08:24:14.7002386Z'
          }
        ],
        orderProcessingStates: [
          {
            statusType: 'Delivery',
            statusCode: 'Sent to distributor'
          }
        ],
        placedByEmailAddress: 'dat.tran@niteco.se',
        partners: [
          {
            type: 'SoldToParty',
            id: '10118111',
            tradingName: 'dat.tran@niteco.se',
            legalName: 'Dat Tran Salesrep'
          },
          {
            type: 'ShipToParty'
          }
        ],
        salesArea: {
          distributionChannel: '112'
        },
        deliverySite: 'FixedRate',
        deliveryDateTime: [
          {
            dateType: 'estimatedDeliveryDate',
            dateTimeFrom: '2025-02-22T05:00:00Z'
          },
          {
            dateType: 'preferredDeliveryDate',
            dateTimeFrom: '2025-02-22T00:00:00Z'
          },
          {
            dateType: 'requested',
            dateTimeFrom: '2025-02-22T00:00:00Z'
          }
        ],
        distributorKey: '302-BBI',
        salesOrderChannel: '302-BBI',
        lineItems: [
          {
            localFields: [
              {
                fieldName: 'sku',
                fieldValue: 'E1819'
              },
              {
                fieldName: 'isReward',
                fieldValue: 'false'
              },
              {
                fieldName: 'isGift',
                fieldValue: 'false'
              },
              {
                fieldName: 'hasDiscount',
                fieldValue: 'false'
              },
              {
                fieldName: 'discount',
                fieldValue: 0
              },
              {
                fieldName: 'promotionCode'
              },
              {
                fieldName: 'isReturnableEmpty',
                fieldValue: 'true'
              }
            ],
            quantityOrdered: 1,
            quantityConfirmed: 1,
            price: {
              unitPrice: 0,
              totalDiscountAmount: 0
            }
          },
          {
            localFields: [
              {
                fieldName: 'sku',
                fieldValue: '10163'
              },
              {
                fieldName: 'isReward',
                fieldValue: 'false'
              },
              {
                fieldName: 'isGift',
                fieldValue: 'false'
              },
              {
                fieldName: 'hasDiscount',
                fieldValue: 'false'
              },
              {
                fieldName: 'discount',
                fieldValue: 0
              },
              {
                fieldName: 'promotionCode'
              },
              {
                fieldName: 'isReturnableEmpty',
                fieldValue: 'false'
              }
            ],
            quantityOrdered: 1,
            quantityConfirmed: 1,
            price: {
              unitPrice: 489000,
              totalDiscountAmount: 0
            }
          }
        ]
      }
    ]
  });

  const params = {
    headers: { "Content-Type": "application/json" }
  };

  const res = http.post("http://localhost:3000/send-message", payload, params);

  check(res, {
    "Message sent successfully": (r) => r.status === 200,
  });
}
