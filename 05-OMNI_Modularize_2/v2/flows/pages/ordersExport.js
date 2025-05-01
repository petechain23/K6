// v2/flows/pages/ordersExport.js
import { group, check, sleep } from 'k6';
import {
    BASE_URL, ORDER_EXPORT_URL, // Config constants
    orderExportResponseTime, orderExportSuccessRate, orderExportRequestCount // Specific metrics
} from '../config.js'; // Adjust path as needed
import { makeRequest, createHeaders } from '../utils.js'; // Adjust path as needed

// Helper to add specific metrics for this flow
function addMetrics(response, isSuccessCheck = null) {
    // Default success is 2xx or 3xx, allow overriding for specific checks (e.g., 201 Created)
    const success = isSuccessCheck !== null ? isSuccessCheck : (response.status >= 200 && response.status < 400);
    const tags = { status: response.status }; // Add basic tags for specific metrics

    orderExportResponseTime.add(response.timings.duration, tags);
    orderExportSuccessRate.add(success, tags);
    orderExportRequestCount.add(1, tags);
}

// configData might be used in the future to parameterize the export payload (dates, filters)
export function ordersExportFlow(authToken, configData = {}) {

    // Extract depotId from configData
    const { depotId } = configData;

    group('Orders Export', function () {
        if (!authToken) {
            console.warn(`VU ${__VU} Orders Export: Skipping flow due to missing auth token.`);
            return;
        }
        // Add check for depotId
        if (!depotId) { console.warn(`VU ${__VU} Orders Export: Skipping flow due to missing depotId in configData.`); return; }

        const groupTags = { group: 'Orders Export' }; // Define tags for makeRequest

        /*
        1. Define Export Payload
        2. Trigger the export job.
        3. If successful, poll the status using the returned job ID.
        */
        const exportJobPayloadObject = {
            dry_run: false,
            type: 'line-items-orders-export', // Make sure this type is correct
            context: {
                list_config: {
                    skip: 0,
                    take: 100, // Consider parameterizing or increasing
                    order: { order_created_at: 'DESC' },
                    select: [ /* ... Keep your extensive select list ... */
                        'line_item_id', 'order_id', 'order_display_id', 'order_status',
                        'order_created_at', 'order_currency_code', 'order_fulfillment_status',
                        'order_payment_status', 'order_extended_status', 'order_external_number',
                        'order_source_system', 'order_promotion_code', 'order_coupon_code',
                        'order_current_invoiced_number', 'order_historical_invoiced_number',
                        'address_address_1', 'address_address_2', 'address_country_code',
                        'address_city', 'address_postal_code', 'store_depot_name',
                        'outlet_outlet_id', 'outlet_outlet_name', 'outlet_external_id',
                        'outlet_customer_type', 'outlet_business_organizational_segment',
                        'outlet_channels', 'outlet_sub_channels', 'outlet_business_segments',
                        'outlet_classifications', 'depot_external_id', 'delivery_date',
                        'order_subtotal', 'order_shipping_total', 'order_discount_total',
                        'order_gift_card_total', 'order_refunded_total', 'order_tax_total',
                        'order_total', 'order_region_id', 'customer_id', 'customer_first_name',
                        'customer_last_name', 'customer_email', 'variant_sku', 'product_title',
                        'line_item_quantity', 'line_item_total', 'line_item_total_volume',
                        'uom', 'product_volume', 'order_external_doc_number', 'order_invoiced_date',
                        'brand_name', 'product_pack_size', 'variant_sku_type',
                        'geographical_location_region', 'order_invoiced_status',
                        'depot_business_unit', 'outlet_sale_area', 'contact_external_id',
                        'order_cancellation_reason', 'order_cancellation_reason_others_description'
                    ],
                    relations: ['customer', 'shipping_address'],
                    export_type: 'csv'
                },
                filterable_fields: {
                    created_at: {
                        gt: configData.exportStartDate || '2025-03-01T00:00:00.000Z',
                        lt: configData.exportEndDate || '2025-03-31T23:59:59.999Z'
                    },
                    depot_id: [depotId] // Use the depotId from configData
                }
            }
        };

        // --- Trigger the Export Job ---
        const triggerResponse = makeRequest(
            'post',
            `${BASE_URL}/${ORDER_EXPORT_URL}`, // Use constant from config.js
            exportJobPayloadObject, // Pass object directly, makeRequest handles stringify
            { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
            '/admin/batch-jobs (Trigger Orders Export)'
        );
        // Add specific metrics, expecting 201 Created for trigger
        addMetrics(triggerResponse, triggerResponse.status === 201);

        let batchJobId = null;
        let triggerBody = null;

        // --- Check Trigger Success and Extract ID ---
        try {
            triggerBody = triggerResponse.json();
        } catch (e) {
            console.error(`VU ${__VU} Orders Export: Failed to parse trigger response JSON. Status: ${triggerResponse.status}, Body: ${triggerResponse.body}, Error: ${e.message}`);
        }

        const triggerCheck = check(triggerResponse, {
            'Export Trigger - status is 201': (r) => r.status === 201,
            'Export Trigger - response has batch_job.id': () => triggerBody?.batch_job?.id != null,
        });

        if (triggerCheck && triggerBody?.batch_job?.id) {
            batchJobId = triggerBody.batch_job.id;
            console.log(`VU ${__VU} Orders Export: Job Triggered Successfully. Batch Job ID: ${batchJobId}`);
        } else {
            console.error(`VU ${__VU} Orders Export: Trigger Failed or ID not found! Status: ${triggerResponse.status}, Body: ${triggerResponse.body}`);
            // Stop this group if trigger fails, as polling depends on it
            return;
        }

        // // --- Poll Batch Job Status (Only if Trigger was successful) ---
        // if (batchJobId) {
        //     console.log(`VU ${__VU} Orders Export: Proceeding to poll job ID: ${batchJobId}`);

        //     // --- Recommended: Implement proper polling loop ---
        //     const POLLING_INTERVAL_SECONDS = 5;
        //     const POLLING_TIMEOUT_SECONDS = 180; // 3 minutes timeout
        //     const startTime = Date.now();
        //     let jobStatus = '';
        //     let jobResultUrl = null; // To store the download URL if completed
        //     let pollSucceeded = true; // Flag to track polling success

        //     while (Date.now() - startTime < POLLING_TIMEOUT_SECONDS * 1000) {
        //         const pollRes = makeRequest(
        //             'get',
        //             `${BASE_URL}/${ORDER_EXPORT_URL}/${batchJobId}`, // Poll specific job ID
        //             null,
        //             { headers: createHeaders(authToken), tags: groupTags },
        //             `/admin/batch-jobs/{id} (Polling Loop ${batchJobId})`
        //         );
        //         // Add metrics for the poll request itself, expecting 200 OK
        //         addMetrics(pollRes, pollRes.status === 200);

        //         let pollBody = null;
        //         try { pollBody = pollRes.json(); } catch (e) { /* Ignore parsing error, check handles status */ }

        //         const pollCheck = check(pollRes, {
        //             'Polling Status is 200': (r) => r.status === 200,
        //             'Polling Response has status': () => pollBody?.batch_job?.status != null
        //         });

        //         if (!pollCheck || !pollBody) {
        //             console.error(`VU ${__VU} Orders Export: Polling job ${batchJobId} failed or gave invalid response! Status: ${pollRes.status}, Body: ${pollRes.body}`);
        //             pollSucceeded = false;
        //             break; // Exit loop on poll failure
        //         }

        //         jobStatus = pollBody.batch_job.status;
        //         console.log(`VU ${__VU} Orders Export: Job ${batchJobId} status: ${jobStatus}`);

        //         if (jobStatus === 'completed') {
        //             // Adjust path based on actual response structure for the download key/URL
        //             jobResultUrl = pollBody.batch_job?.result?.file_key;
        //             console.log(`VU ${__VU} Orders Export: Job ${batchJobId} completed. File key: ${jobResultUrl}`);
        //             break; // Exit loop on completion
        //         } else if (jobStatus === 'failed' || jobStatus === 'canceled') {
        //             console.error(`VU ${__VU} Orders Export: Job ${batchJobId} ended with status: ${jobStatus}`);
        //             pollSucceeded = false; // Mark as failed if job itself failed
        //             break; // Exit loop on final failure status
        //         }

        //         // Wait before the next poll
        //         sleep(POLLING_INTERVAL_SECONDS);
        //     } // End while loop

        //     // Check for timeout
        //     if (jobStatus !== 'completed' && jobStatus !== 'failed' && jobStatus !== 'canceled') {
        //         console.error(`VU ${__VU} Orders Export: Polling job ${batchJobId} timed out after ${POLLING_TIMEOUT_SECONDS}s.`);
        //         pollSucceeded = false;
        //     }

        //     // --- Optionally Download File (Only if polling succeeded and job completed) ---
        //     if (pollSucceeded && jobStatus === 'completed' && jobResultUrl) {
        //         console.log(`VU ${__VU} Orders Export: Attempting to get download URL for ${jobResultUrl}`);
        //         const downloadUrlPayload = { file_key: jobResultUrl };
        //         const downloadUrlRes = makeRequest(
        //             'post',
        //             `${BASE_URL}/admin/uploads/download-url`, // Assuming this is the correct endpoint
        //             downloadUrlPayload,
        //             { headers: createHeaders(authToken, { 'content-type': 'application/json' }), tags: groupTags },
        //             '/admin/uploads/download-url (Get Export URL)'
        //         );
        //         // Add metrics for getting the download URL, expecting 200 OK
        //         addMetrics(downloadUrlRes, downloadUrlRes.status === 200);

        //         let downloadUrlBody = null;
        //         try { downloadUrlBody = downloadUrlRes.json(); } catch (e) { /* Ignore parsing error */ }

        //         const downloadUrlCheck = check(downloadUrlRes, {
        //             'Get Download URL status is 200': (r) => r.status === 200,
        //             'Get Download URL response has url': () => downloadUrlBody?.download_url != null
        //         });

        //         if (downloadUrlCheck && downloadUrlBody?.download_url) {
        //             const actualDownloadUrl = downloadUrlBody.download_url;
        //             console.log(`VU ${__VU} Orders Export: Download URL received. Downloading from: ${actualDownloadUrl.substring(0, 50)}...`);
        //             // Note: k6 performs the GET but doesn't save the file by default.
        //             // Use appropriate headers (likely none needed for signed URLs)
        //             const downloadRes = makeRequest(
        //                 'get',
        //                 actualDownloadUrl,
        //                 null,
        //                 { headers: {}, tags: groupTags }, // No auth usually needed for signed URL
        //                 'Download Exported File'
        //             );
        //             // Add metrics for the actual download, expecting 200 OK
        //             addMetrics(downloadRes, downloadRes.status === 200);

        //             check(downloadRes, { 'Download status is 200': (r) => r.status === 200 });
        //             sleep(1); // Small sleep after download attempt

        //         } else {
        //             console.error(`VU ${__VU} Orders Export: Failed to get download URL. Status: ${downloadUrlRes.status}, Body: ${downloadUrlRes.body}`);
        //             sleep(1); // Compensate sleep
        //         }
        //     } else if (pollSucceeded && jobStatus === 'completed' && !jobResultUrl) {
        //          console.warn(`VU ${__VU} Orders Export: Job ${batchJobId} completed but no file key found in result.`);
        //          sleep(1); // Compensate sleep
        //     } else {
        //          // If polling failed, timed out, or job failed/canceled
        //          console.warn(`VU ${__VU} Orders Export: Skipping download for job ${batchJobId} due to status: ${jobStatus} or polling failure.`);
        //          sleep(1); // Compensate sleep
        //     }
        //     // --- End Optional Download ---
        // }
    });
}
