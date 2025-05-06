// v2/main.js
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Import Configs, Data, Metrics, Workloads, Thresholds
import {
    thresholdsSettings, // Thresholds
    DEPOT_ID_FILTER, users,  // Data loaders
    orderId, orderId_2, orderId_3,
    orderIdUpdate, orderIdUpdate_2, orderIdUpdate_3,
    masterData, masterData_2, masterData_3,
    outlet_depot,
    pervuIterationsWorkload, constantWorkload, ramupWorkload,
    shortBurstSharedWorkload, rampingArrivalRateWorkload, constantArrivalRateWorkload
} from './config.js';

// Import Flow Functions
import { loginFlow } from './pages/login.js';
import { logoutFlow } from './pages/logout.js';
import { ordersCreateFlow } from './pages/ordersCreate.js';
import { ordersEditFlow } from './pages/ordersEdit.js';
import { ordersUpdateFlow } from './pages/ordersUpdate.js';
import { ordersFilterFlow } from './pages/ordersFilter.js';
import { ordersScrollingFlow } from './pages/ordersScrolling.js';
import { ordersSearchFlow } from './pages/ordersSearch.js';
import { ordersExportFlow } from './pages/ordersExport.js';
import { ordersPromoGetListFlow } from './pages/ordersPromoGetList.js';
import { outletsSearchFlow } from './pages/outletsSearch.js';
import { ordersPLScrollingFlow } from './pages/ordersPLScrolling.js';
import { performanceDistributorFlow } from './pages/performanceDistributor.js';
import { ordersUpdateToDeliveredFlow } from './pages/ordersUpdateToDelivered.js';
import { ordersEditWithRetryFlow } from './pages/ordersEditRetry.js';
import { ordersInvoiceFlow } from './pages/ordersInvoice.js';


// --- k6 Options ---
// Define scenarios using imported workloads
export const options = {
    cloud: {
        distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
        apm: [],
    },
    scenarios: {
        // Choose one or more scenarios
        debug_run: pervuIterationsWorkload,
        // load_run: ramupWorkload,
        // endurance_run: constantWorkload
    },
    thresholds: thresholdsSettings.thresholds, // Use thresholds from config
};

// --- Main VU Function ---
export default function () {
    // --- Data Selection ---
    // Select user data
    const currentUser = users[__VU % users.length];

    // Determine the index for depot selection (0, 1, or 2)
    const depotIndex = __VU % DEPOT_ID_FILTER.length;

    // Select the Depot ID based on the index
    const currentDepotId = DEPOT_ID_FILTER[depotIndex];

    // --- UPDATED: Select appropriate master data AND orderId arrays based on depot index ---
    let selectedMasterDataArray;
    let selectedOrderIdEditArray; // Variable to hold the chosen orderId array
    let selectedOrderIdUpdateArray; // Variable to hold the chosen orderId array

    if (depotIndex === 0) {
        selectedMasterDataArray = masterData;
        selectedOrderIdEditArray = orderId; // Use orderId for index 0
        selectedOrderIdUpdateArray = orderIdUpdate; // Use orderId for index 0
        // console.log(`VU ${__VU}: Using masterData and orderId (Index 0)`);
    } else if (depotIndex === 1) {
        selectedMasterDataArray = masterData_2;
        selectedOrderIdEditArray = orderId_2; // Use orderId for index 1
        selectedOrderIdUpdateArray = orderIdUpdate_2; // Use orderId_2 for index 1
        // console.log(`VU ${__VU}: Using masterData_2 and orderId_2 (Index 1)`);
    } else { // Assuming index 2 (or any other index if DEPOT_ID_FILTER grows)
        selectedMasterDataArray = masterData_3;
        selectedOrderIdEditArray = orderId_3; // Use orderId for index 2
        selectedOrderIdUpdateArray = orderIdUpdate_3; // Use orderId_3 for index 2
        // console.log(`VU ${__VU}: Using masterData_3 and orderId_3 (Index 2)`);
    }
    // --- END UPDATED SELECTION ---
    // Select RANDOM master data (e.g., outlet for creation) FROM THE CHOSEN ARRAY
    let currentMasterData = null;
    if (selectedMasterDataArray && selectedMasterDataArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedMasterDataArray.length);
        currentMasterData = selectedMasterDataArray[randomIndex];
    } else {
        console.error(`VU ${__VU}: Selected master data array (Index ${depotIndex}) is empty or undefined! Halting iteration.`);
        return; // Stop iteration if data source is invalid
    }

    // --- UPDATED: Select RANDOM order for editing FROM THE CHOSEN orderId ARRAY ---
    let editOrderData = null;
    if (selectedOrderIdEditArray && selectedOrderIdEditArray.length > 0) {
        // Use Math.random() for random selection in each iteration
        // const editIndex = Math.floor(Math.random() * selectedOrderIdEditArray.length);
        // editOrderData = selectedOrderIdEditArray[editIndex];

        // Use VU number for sequential selection within the VU's assigned array
        const editIndex = __VU % selectedOrderIdEditArray.length; // Cycle through the array based on VU number
        editOrderData = selectedOrderIdEditArray[editIndex]; // Pick the order at the calculated index
    } else {
        console.error(`VU ${__VU}: Selected orderId array (Index ${depotIndex}) is empty or undefined! Cannot select order for edit/update.`);
    }
    // --- END UPDATED SELECTION ---

    // --- UPDATED: Select RANDOM order for updating FROM THE CHOSEN orderId ARRAY ---
    let updateOrderData = null;
    if (selectedOrderIdUpdateArray && selectedOrderIdUpdateArray.length > 0) {
        // Use Math.random() for random selection in each iteration
        // const editIndex = Math.floor(Math.random() * selectedOrderIdUpdateArray.length);
        // updateOrderData = selectedOrderIdUpdateArray[editIndex];

        // Use VU number for sequential selection within the VU's assigned array
        const editIndex = __VU % selectedOrderIdUpdateArray.length; // Cycle through the array based on VU number
        updateOrderData = selectedOrderIdUpdateArray[editIndex]; // Pick the order at the calculated index

    } else {
        console.error(`VU ${__VU}: Selected orderId array (Index ${depotIndex}) is empty or undefined! Cannot select order for edit/update.`);
    }
    // --- END UPDATED SELECTION ---

    // Select specific depot/outlet external IDs for promotions (unchanged)
    let promoData = null;
    if (outlet_depot && outlet_depot.length > 0) {
        const randomPromoIndex = Math.floor(Math.random() * outlet_depot.length);
        promoData = outlet_depot[randomPromoIndex];
    } else {
        console.error(`VU ${__VU}: outlet_depot SharedArray is empty or undefined! Cannot select data for promotions.`);
    }
    // --- End Data Selection ---


    // Prepare config data object to pass to flows
    const flowConfigData = {       
        // for order edit
        orderIdToEdit: editOrderData?.order_id, // Use the selected edit order data
        locationIdToEdit: editOrderData?.location_id,
        
        // for order update
        orderIdForStatusUpdate: updateOrderData?.order_id, // Use the selected update order data
        
        // for order promotion
        depotExternalId: currentMasterData?.depot_external_id,
        outletExternalId: currentMasterData?.outlet_external_id,
        
        // for order Create
        depotId: currentDepotId,
        outletId: currentMasterData?.outlet_id,
        customerId: currentMasterData?.['customer_id'],
        userEmail: currentMasterData?.['customer_email'],
        locationId: currentMasterData?.['location_id']
    };

    // Check if essential data like outletId is present before proceeding
    if (!flowConfigData.outletId) {
        console.error(`VU ${__VU}: Missing outletId after data selection. Halting iteration.`);
        return;
    }

    // Log the randomly selected outlet ID and potentially the edit/update order ID
    // console.log(`VU ${__VU} starting iteration with User ${currentUser.username}, using Depot ${currentDepotId}, Outlet Id ${currentMasterData?.outlet_id}, Edit Order ${editOrderData?.order_id || 'N/A'}, Update Order ${updateOrderData?.order_id || 'N/A'}, Promo Depot ${promoData?.depot_external_id || 'N/A'}`);

    // 1. Login
    const authToken = loginFlow(currentUser.username, currentUser.password);

    if (!authToken) {
        console.error(`VU ${__VU} - Halting iteration due to login failure.`);
        return; // Stop this iteration if login failed
    }

    // 2. Execute Order Flows (Add sleeps for think time)
    // sleep(1);
    // ordersCreateFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersEditFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersUpdateFlow(authToken, flowConfigData); 

    // sleep(1);
    // ordersUpdateToDeliveredFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersEditWithRetryFlow(authToken, flowConfigData);

    sleep(1);
    ordersInvoiceFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersFilterFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersScrollingFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersSearchFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersExportFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersPromoGetListFlow(authToken, flowConfigData);

    // sleep(1);
    // outletsSearchFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersPLScrollingFlow(authToken, flowConfigData);

    // sleep(1);
    // performanceDistributorFlow(authToken, flowConfigData);

    sleep(1); // Think time before logout

    // 3. Logout
    logoutFlow(authToken);

    console.log(`VU ${__VU} finished iteration.`);
}

// --- handleSummary ---
// Keep your preferred handleSummary logic (HTML, Console, CSV)
export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    // Adjust report name as needed
    const reportName = `./reports/summary_report_${timestamp}.html`;

    console.log("-------------------- Custom Metrics Summary --------------------");
    // Log specific metrics if desired (check if metric exists first)
    if (data.metrics.login_success_rate) {
        console.log(`Login Success Rate: ${(data.metrics.login_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_creation_success_rate) {
        console.log(`Order Creation Success Rate: ${(data.metrics.order_creation_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_editing_success_rate) {
        console.log(`Order Edit Success Rate:   ${(data.metrics.order_editing_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_editing_retry_success_rate) {
        console.log(`Order Edit Retry Success Rate: ${(data.metrics.order_editing_retry_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_updating_success_rate) {
        console.log(`Order Update Success Rate: ${(data.metrics.order_updating_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_update_to_delivered_success_rate) {
        console.log(`Order Update To Delivered Success Rate: ${(data.metrics.order_update_to_delivered_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_invoice_success_rate) {
        console.log(`Order Invoice Success Rate: ${(data.metrics.order_invoice_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_filter_success_rate) {
        console.log(`Order Filter Success Rate: ${(data.metrics.order_filter_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_scrolling_success_rate) {
        console.log(`Order Scrolling Success Rate: ${(data.metrics.order_scrolling_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_search_success_rate) {
        console.log(`Order Search Success Rate: ${(data.metrics.order_search_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.order_export_success_rate) {
        console.log(`Order Export Success Rate: ${(data.metrics.order_export_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.outlet_search_success_rate) {
        console.log(`Outlet Search Success Rate: ${(data.metrics.outlet_search_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.promo_get_list_success_rate) {
        console.log(`Promo Get List Success Rate: ${(data.metrics.promo_get_list_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.pl_scrolling_success_rate) {
        console.log(`Products List Scrolling Success Rate: ${(data.metrics.pl_scrolling_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.performance_distributor_success_rate) {
        console.log(`Products List Scrolling Success Rate: ${(data.metrics.performance_distributor_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    console.log("-----------------------------------------------------------------");

    // Example combining HTML and Console
    return {
        [reportName]: htmlReport(data, { debug: false }),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        // Add CSV export if using the logic from your original main.js
        // 'response_times.csv': convertToCSV(responseTimeData), // Need to define responseTimeData and convertToCSV
        // 'per_vu_summary.csv': generatePerVuSummary(responseTimeData) // Need to define generatePerVuSummary
    };
}

// --- Optional Setup/Teardown ---
// export { setup } from './setup.js'; // Uncomment if using setup.js
// export { teardown } from './teardown.js'; // Uncomment if using teardown.js