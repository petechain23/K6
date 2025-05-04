import { group, check, sleep } from 'k6';
import {
    BASE_URL,
    performanceDistributorResponseTime,
    // Import new specific metrics
    perfDistChartSettingsResponseTime, perfDistChartSettingsSuccessRate, perfDistChartSettingsRequestCount,
    perfDistSalesVolInfoResponseTime, perfDistSalesVolInfoSuccessRate, perfDistSalesVolInfoRequestCount,
    perfDistSalesCaseFillRateResponseTime, perfDistSalesCaseFillRateSuccessRate, perfDistSalesCaseFillRateRequestCount,
    perfDistTransCaptureResponseTime, perfDistTransCaptureSuccessRate, perfDistTransCaptureRequestCount,
    perfDistDistComplianceResponseTime, perfDistDistComplianceSuccessRate, perfDistDistComplianceRequestCount,
    perfDistOrderSlaResponseTime, perfDistOrderSlaSuccessRate, perfDistOrderSlaRequestCount,
    perfDistCallEffectivenessResponseTime, perfDistCallEffectivenessSuccessRate, perfDistCallEffectivenessRequestCount,
    perfDistChartAsoResponseTime, perfDistChartAsoSuccessRate, perfDistChartAsoRequestCount
} from '../config.js';
import { makeRequest, createHeaders } from '../utils.js';

// // Helper to add metrics for this specific flow - REMOVED, using specific metrics now
// function addMetrics(response, isSuccessCheck = (r) => r.status === 200) {
//     const success = isSuccessCheck(response);
//     performanceDistributorResponseTime.add(response.timings.duration);
//     performanceDistributorSuccessRate.add(success);
//     performanceDistributorRequestCount.add(1);
//     return success; // Return success status for potential chaining or logging
// }

// --- Helper function for random sleep ---
function randomSleep(min = 1, max = 4) {
    const duration = Math.random() * (max - min) + min;
    sleep(duration);
}

// Define date ranges
const oneMonthStart = '2025-04-04T00:00:00.000Z';
const oneMonthEnd = '2025-05-04T23:59:59.999Z';
const threeMonthStart = '2025-01-01T00:00:00.000Z';
const threeMonthEnd = '2025-04-30T23:59:59.999Z';

// Define performance endpoints (relative paths)
const performanceEndpoints = [
    'sales-volume-information',
    'sales-case-fill-rate',
    'transaction-capture',
    'distribution-transaction-capture-and-call-compliance',
    'order-sla',
    'call-effectiveness'
    // 'chart-aso' seems to have no date filter in the original script
];

export function performanceDistributorFlow(authToken, configData) {
    group('Performance Distributor', function () {
        if (!authToken) {
            console.warn(`VU ${__VU}: Skipping Performance Distributor flow - missing authToken.`);
            return;
        }
        if (!configData || !configData.depotId) {
            console.warn(`VU ${__VU}: Skipping Performance Distributor flow - missing depotId in configData.`);
            return;
        }

        const depotId = configData.depotId;
        const headers = createHeaders(authToken); // Assuming createHeaders adds Authorization
        let response;
        let url;
        let checkSuccess;

        // --- All Depots ---
        group('All Depots', function () {
            // Initial Load
            url = `${BASE_URL}/admin/performance/chart-settings?depot_id=null&distributor_id=null`;
            response = makeRequest(
                'GET',
                url,
                null,
                { headers: headers, tags: { group: 'Performance Distributor' } }, // params object
                'PerfDist-ChartSettings-All'
            );
            checkSuccess = check(response, {
                '[PerfDist-ChartSettings-All] Status is 200': (r) => r.status === 200,
                '[PerfDist-ChartSettings-All] Response is JSON': (r) => { try { r.json(); return true; } catch (e) { return false; } },
            });
            // Add specific metrics
            perfDistChartSettingsResponseTime.add(response.timings.duration);
            perfDistChartSettingsSuccessRate.add(checkSuccess);
            perfDistChartSettingsRequestCount.add(1);
            randomSleep(); // Sleep *after* processing the response
            
            // One Month Filter (April)
            group('One Month Filter (April)', function () {
                performanceEndpoints.forEach(endpoint => {
                    url = `${BASE_URL}/admin/performance/${endpoint}?start=${oneMonthStart}&end=${oneMonthEnd}`;
                    
                    response = makeRequest(
                        'GET',
                        url,
                        null,
                        { headers: headers, tags: { group: 'Performance Distributor' } },
                        `PerfDist-${endpoint}-All-1M`
                    );
                    checkSuccess = check(response, {
                        [`[PerfDist-${endpoint}-All-1M] Status is 200`]: (r) => r.status === 200,
                        [`[PerfDist-${endpoint}-All-1M] Response is JSON`]: (r) => { try { r.json(); return true; } catch (e) { return false; } },
                    });
                    // Add specific metrics based on endpoint
                    switch (endpoint) {
                        case 'sales-volume-information':
                            perfDistSalesVolInfoResponseTime.add(response.timings.duration); perfDistSalesVolInfoSuccessRate.add(checkSuccess); perfDistSalesVolInfoRequestCount.add(1); break;
                        case 'sales-case-fill-rate':
                            perfDistSalesCaseFillRateResponseTime.add(response.timings.duration); perfDistSalesCaseFillRateSuccessRate.add(checkSuccess); perfDistSalesCaseFillRateRequestCount.add(1); break;
                        case 'transaction-capture':
                            perfDistTransCaptureResponseTime.add(response.timings.duration); perfDistTransCaptureSuccessRate.add(checkSuccess); perfDistTransCaptureRequestCount.add(1); break;
                        case 'distribution-transaction-capture-and-call-compliance':
                            perfDistDistComplianceResponseTime.add(response.timings.duration); perfDistDistComplianceSuccessRate.add(checkSuccess); perfDistDistComplianceRequestCount.add(1); break;
                        case 'order-sla':
                            perfDistOrderSlaResponseTime.add(response.timings.duration); perfDistOrderSlaSuccessRate.add(checkSuccess); perfDistOrderSlaRequestCount.add(1); break;
                        case 'call-effectiveness':
                            perfDistCallEffectivenessResponseTime.add(response.timings.duration); perfDistCallEffectivenessSuccessRate.add(checkSuccess); perfDistCallEffectivenessRequestCount.add(1); break;
                        default:
                            performanceDistributorResponseTime.add(response.timings.duration); // Fallback to generic if needed
                    }
                    randomSleep(); // Sleep after each endpoint call within the filter group
                });
                // Chart ASO (no date filter)
                url = `${BASE_URL}/admin/performance/chart-aso`;
                
                response = makeRequest(
                    'GET',
                    url,
                    null,
                    { headers: headers, tags: { group: 'Performance Distributor' } },
                    'PerfDist-ChartASO-All'
                );
                 checkSuccess = check(response, {
                    '[PerfDist-ChartASO-All] Status is 200': (r) => r.status === 200,
                    '[PerfDist-ChartASO-All] Response is JSON': (r) => { try { r.json(); return true; } catch (e) { return false; } },
                });
                // Add specific metrics
                perfDistChartAsoResponseTime.add(response.timings.duration);
                perfDistChartAsoSuccessRate.add(checkSuccess);
                perfDistChartAsoRequestCount.add(1);
                // No sleep needed here, handled by sleep after the group
            });

            // Three Month Filter (Jan-Apr)
            group('Three Month Filter (Jan-Apr)', function () {
                performanceEndpoints.forEach(endpoint => {
                    url = `${BASE_URL}/admin/performance/${endpoint}?start=${threeMonthStart}&end=${threeMonthEnd}`;
                    
                    response = makeRequest(
                        'GET',
                        url,
                        null,
                        { headers: headers, tags: { group: 'Performance Distributor' } },
                        `PerfDist-${endpoint}-All-3M`
                    );
                    checkSuccess = check(response, {
                        [`[PerfDist-${endpoint}-All-3M] Status is 200`]: (r) => r.status === 200,
                        [`[PerfDist-${endpoint}-All-3M] Response is JSON`]: (r) => { try { r.json(); return true; } catch (e) { return false; } },
                    });
                    // Add specific metrics based on endpoint
                    switch (endpoint) {
                        case 'sales-volume-information':
                            perfDistSalesVolInfoResponseTime.add(response.timings.duration); perfDistSalesVolInfoSuccessRate.add(checkSuccess); perfDistSalesVolInfoRequestCount.add(1); break;
                        case 'sales-case-fill-rate':
                            perfDistSalesCaseFillRateResponseTime.add(response.timings.duration); perfDistSalesCaseFillRateSuccessRate.add(checkSuccess); perfDistSalesCaseFillRateRequestCount.add(1); break;
                        case 'transaction-capture':
                            perfDistTransCaptureResponseTime.add(response.timings.duration); perfDistTransCaptureSuccessRate.add(checkSuccess); perfDistTransCaptureRequestCount.add(1); break;
                        case 'distribution-transaction-capture-and-call-compliance':
                            perfDistDistComplianceResponseTime.add(response.timings.duration); perfDistDistComplianceSuccessRate.add(checkSuccess); perfDistDistComplianceRequestCount.add(1); break;
                        case 'order-sla':
                            perfDistOrderSlaResponseTime.add(response.timings.duration); perfDistOrderSlaSuccessRate.add(checkSuccess); perfDistOrderSlaRequestCount.add(1); break;
                        case 'call-effectiveness':
                            perfDistCallEffectivenessResponseTime.add(response.timings.duration); perfDistCallEffectivenessSuccessRate.add(checkSuccess); perfDistCallEffectivenessRequestCount.add(1); break;
                        default:
                            performanceDistributorResponseTime.add(response.timings.duration); // Fallback
                    }
                    randomSleep(); // Sleep after each endpoint call
                });                
                // No sleep needed here, handled by sleep after the group
            });
        }); // End All Depots Group

        // --- Specific Depot ---
        group('Specific Depot', function () {
            // Initial Load for Specific Depot
            url = `${BASE_URL}/admin/performance/chart-settings?depot_id=${depotId}&distributor_id=null`;
            
            response = makeRequest(
                'GET',
                url,
                null,
                { headers: headers, tags: { group: 'Performance Distributor' } },
                'PerfDist-ChartSettings-Specific'
            );
            checkSuccess = check(response, {
                '[PerfDist-ChartSettings-Specific] Status is 200': (r) => r.status === 200,
                '[PerfDist-ChartSettings-Specific] Response is JSON': (r) => { try { r.json(); return true; } catch (e) { return false; } },
            });
            // Add specific metrics
            perfDistChartSettingsResponseTime.add(response.timings.duration);
            perfDistChartSettingsSuccessRate.add(checkSuccess);
            perfDistChartSettingsRequestCount.add(1);
            randomSleep();

            // One Month Filter (April) for Specific Depot
            group('One Month Filter (April)', function () {
                performanceEndpoints.forEach(endpoint => {
                    url = `${BASE_URL}/admin/performance/${endpoint}?start=${oneMonthStart}&end=${oneMonthEnd}&depot_ids[0]=${depotId}`;
                    
                    response = makeRequest(
                        'GET',
                        url,
                        null,
                        { headers: headers, tags: { group: 'Performance Distributor' } },
                        `PerfDist-${endpoint}-Specific-1M`
                    );
                    checkSuccess = check(response, {
                        [`[PerfDist-${endpoint}-Specific-1M] Status is 200`]: (r) => r.status === 200,
                        [`[PerfDist-${endpoint}-Specific-1M] Response is JSON`]: (r) => { try { r.json(); return true; } catch (e) { return false; } },
                    });
                    // Add specific metrics based on endpoint
                    switch (endpoint) {
                        case 'sales-volume-information':
                            perfDistSalesVolInfoResponseTime.add(response.timings.duration); perfDistSalesVolInfoSuccessRate.add(checkSuccess); perfDistSalesVolInfoRequestCount.add(1); break;
                        case 'sales-case-fill-rate':
                            perfDistSalesCaseFillRateResponseTime.add(response.timings.duration); perfDistSalesCaseFillRateSuccessRate.add(checkSuccess); perfDistSalesCaseFillRateRequestCount.add(1); break;
                        case 'transaction-capture':
                            perfDistTransCaptureResponseTime.add(response.timings.duration); perfDistTransCaptureSuccessRate.add(checkSuccess); perfDistTransCaptureRequestCount.add(1); break;
                        case 'distribution-transaction-capture-and-call-compliance':
                            perfDistDistComplianceResponseTime.add(response.timings.duration); perfDistDistComplianceSuccessRate.add(checkSuccess); perfDistDistComplianceRequestCount.add(1); break;
                        case 'order-sla':
                            perfDistOrderSlaResponseTime.add(response.timings.duration); perfDistOrderSlaSuccessRate.add(checkSuccess); perfDistOrderSlaRequestCount.add(1); break;
                        case 'call-effectiveness':
                            perfDistCallEffectivenessResponseTime.add(response.timings.duration); perfDistCallEffectivenessSuccessRate.add(checkSuccess); perfDistCallEffectivenessRequestCount.add(1); break;
                        default:
                            performanceDistributorResponseTime.add(response.timings.duration); // Fallback
                    }
                    randomSleep(); // Sleep after each endpoint call
                });
                 // Chart ASO (no date filter, but maybe context specific?) - Assuming it doesn't take depot_id based on original
                url = `${BASE_URL}/admin/performance/chart-aso`;
                
                response = makeRequest(
                    'GET',
                    url,
                    null,
                    { headers: headers, tags: { group: 'Performance Distributor' } },
                    'PerfDist-ChartASO-SpecificContext'
                );
                 checkSuccess = check(response, {
                    '[PerfDist-ChartASO-SpecificContext] Status is 200': (r) => r.status === 200,
                    '[PerfDist-ChartASO-SpecificContext] Response is JSON': (r) => { try { r.json(); return true; } catch (e) { return false; } },
                });
                // Add specific metrics
                perfDistChartAsoResponseTime.add(response.timings.duration);
                perfDistChartAsoSuccessRate.add(checkSuccess);
                perfDistChartAsoRequestCount.add(1);
                // No sleep needed here
            });

            // Three Month Filter (Jan-Apr) for Specific Depot
            group('Three Month Filter (Jan-Apr)', function () {
                performanceEndpoints.forEach(endpoint => {
                    url = `${BASE_URL}/admin/performance/${endpoint}?start=${threeMonthStart}&end=${threeMonthEnd}&depot_ids[0]=${depotId}`;
                    
                    response = makeRequest(
                        'GET',
                        url,
                        null,
                        { headers: headers, tags: { group: 'Performance Distributor' } },
                        `PerfDist-${endpoint}-Specific-3M`
                    );
                    checkSuccess = check(response, {
                        [`[PerfDist-${endpoint}-Specific-3M] Status is 200`]: (r) => r.status === 200,
                        [`[PerfDist-${endpoint}-Specific-3M] Response is JSON`]: (r) => { try { r.json(); return true; } catch (e) { return false; } },
                    });
                    // Add specific metrics based on endpoint
                    switch (endpoint) {
                        case 'sales-volume-information':
                            perfDistSalesVolInfoResponseTime.add(response.timings.duration); perfDistSalesVolInfoSuccessRate.add(checkSuccess); perfDistSalesVolInfoRequestCount.add(1); break;
                        case 'sales-case-fill-rate':
                            perfDistSalesCaseFillRateResponseTime.add(response.timings.duration); perfDistSalesCaseFillRateSuccessRate.add(checkSuccess); perfDistSalesCaseFillRateRequestCount.add(1); break;
                        case 'transaction-capture':
                            perfDistTransCaptureResponseTime.add(response.timings.duration); perfDistTransCaptureSuccessRate.add(checkSuccess); perfDistTransCaptureRequestCount.add(1); break;
                        case 'distribution-transaction-capture-and-call-compliance':
                            perfDistDistComplianceResponseTime.add(response.timings.duration); perfDistDistComplianceSuccessRate.add(checkSuccess); perfDistDistComplianceRequestCount.add(1); break;
                        case 'order-sla':
                            perfDistOrderSlaResponseTime.add(response.timings.duration); perfDistOrderSlaSuccessRate.add(checkSuccess); perfDistOrderSlaRequestCount.add(1); break;
                        case 'call-effectiveness':
                            perfDistCallEffectivenessResponseTime.add(response.timings.duration); perfDistCallEffectivenessSuccessRate.add(checkSuccess); perfDistCallEffectivenessRequestCount.add(1); break;
                        default:
                            performanceDistributorResponseTime.add(response.timings.duration); // Fallback
                    }
                    randomSleep(); // Sleep after each endpoint call
                });                
                // No sleep needed here
            });
        }); // End Specific Depot Group

    }); // End Performance Distributor Group
}
