import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, ORDER_EXPORT_URL , customTrendResponseTime, customTrendSuccessRate, customTrendRequestCount } from '../config.js';

// Create custom trends
// const exportOrderTrend = new Trend('export_order_duration');
export function exportOrders(cookies) {
  const vuID = __VU;
  // console.log(`VU#${__VU}`);
  // //Pick a random Depot
  // const randomDepot = masterData[Math.floor(Math.random() * masterData.length)];
  // const depot_id = randomDepot.depotId;
  // console.log('Random Depot: ', depot_id);
  // MM-PROD export 1 month ~ 144000 line items
  const payloadExportOrders = JSON.stringify({
    dry_run: false,
    type: 'line-items-orders-export',
    context: {
      list_config: {
        skip: 0,
        take: 100,
        order: {
          order_created_at: 'DESC'
        },
        select: [
          'line_item_id',
          'order_id',
          'order_display_id',
          'order_status',
          'order_created_at',
          'order_currency_code',
          'order_fulfillment_status',
          'order_payment_status',
          'order_extended_status',
          'order_external_number',
          'order_source_system',
          'order_promotion_code',
          'order_coupon_code',
          'order_current_invoiced_number',
          'order_historical_invoiced_number',
          'address_address_1',
          'address_address_2',
          'address_country_code',
          'address_city',
          'address_postal_code',
          'store_depot_name',
          'outlet_outlet_id',
          'outlet_outlet_name',
          'outlet_external_id',
          'outlet_customer_type',
          'outlet_business_organizational_segment',
          'outlet_channels',
          'outlet_sub_channels',
          'outlet_business_segments',
          'outlet_classifications',
          'depot_external_id',
          'delivery_date',
          'order_subtotal',
          'order_shipping_total',
          'order_discount_total',
          'order_gift_card_total',
          'order_refunded_total',
          'order_tax_total',
          'order_total',
          'order_region_id',
          'customer_id',
          'customer_first_name',
          'customer_last_name',
          'customer_email',
          'variant_sku',
          'product_title',
          'line_item_quantity',
          'line_item_total',
          'line_item_total_volume',
          'uom',
          'product_volume',
          'order_external_doc_number',
          'order_invoiced_date',
          'brand_name',
          'product_pack_size',
          'variant_sku_type',
          'geographical_location_region',
          'order_invoiced_status',
          'depot_business_unit',
          'outlet_sale_area',
          'contact_external_id',
          'order_cancellation_reason',
          'order_cancellation_reason_others_description'
        ],
        relations: [
          'customer',
          'shipping_address'
        ],
        export_type: 'csv'
      },
      filterable_fields: {
        created_at: {
          //mm-hotfix
          // gt: '2024-01-01T00:00:00.000Z',
          // lt: '2025-02-28T23:59:59.999Z'
          
          // mm-qa --12633 line-items
          // gt: '2024-09-19T00:00:00.000Z',
          // lt: '2025-02-19T23:59:59.999Z'
          // lt: '2025-02-18T23:59:59.999Z'

          // mm-qa --10208 line-items
          // gt: '2024-09-19T00:00:00.000Z',
          // lt: '2025-02-19T23:59:59.999Z'

          // id-qa --30214 line-items,1 min
          gt: '2025-03-01T00:00:00.000Z',
          lt: '2025-03-31T23:59:59.999Z'

          // id-hotfix --1665 line-items,1 min
          // gt: '2024-01-01T00:00:00.000Z',
          // lt: '2025-03-31T23:59:59.999Z'
        }
        // depot_id: [
        //   'depot_01HES9APM60R2D27MW39GHT6YC'
        // ]
      }
    }
  });

  const res = http.post(`${BASE_URL}/${ORDER_EXPORT_URL}`, payloadExportOrders, { headers: { cookies: cookies, 'Content-Type': 'application/json' } });
  // exportOrderTrend.add(res.timings.duration);
  console.log('Export Orders - Response status:', res.status);
  const body = JSON.parse(res.body)
  console.log('Export Order - Response batch_job id: ', body.batch_job.id);
  check(res, {
    'Export Order - verify export response status': (r) => r.status === 201,
    // 'verify export orders successfully': (r2) => r2.body.batch_job.status === 'created'
  });
  customTrendResponseTime.add(res.timings.duration, { vu: vuID });
  customTrendSuccessRate.add(res.status === 201, { vu: vuID });
  customTrendRequestCount.add(1, { vu: vuID });
  sleep(2);
}