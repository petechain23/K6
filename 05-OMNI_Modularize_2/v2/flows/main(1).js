// v2/main.js
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Import Configs, Data, Metrics, Workloads, Thresholds
import {
    thresholdsSettings, // Thresholds
    DEPOT_ID_FILTER, users, orderId, orderId2, outlet_depot, // Data loaders
    masterData, masterData_2, masterData_3,
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

// --- k6 Options ---
// Define scenarios using imported workloads
export const options = {
    cloud: {
        distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
        apm: [],
    },
    scenarios: {
        // Choose one or more scenarios
        // Assign specific exec functions to each scenario
        debug_run: { ...pervuIterationsWorkload, exec: 'pervuIterations' },
        // load_run: { ...ramupWorkload, exec: 'rampingVus' },
        // endurance_run: { ...constantWorkload, exec: 'constantVus' }
    },
    thresholds: thresholdsSettings.thresholds, // Use thresholds from config
};

// --- Common Data Selection Logic (Can be refactored further if desired) ---
function getVUData() {
    // Select user data
    const currentUser = users[__VU % users.length];

    // Determine the index for depot selection (0, 1, or 2)
    const depotIndex = __VU % DEPOT_ID_FILTER.length;

    // Select the Depot ID based on the index
    const currentDepotId = DEPOT_ID_FILTER[depotIndex];

    // Select the appropriate master data array based on the depot index
    let selectedMasterDataArray;
    if (depotIndex === 0) {
        selectedMasterDataArray = masterData;
        console.log(`VU ${__VU}: Using masterData (Index 0)`);
    } else if (depotIndex === 1) {
        selectedMasterDataArray = masterData_2;
        console.log(`VU ${__VU}: Using masterData_2 (Index 1)`);
    } else { // Assuming index 2 (or any other index if DEPOT_ID_FILTER grows)
        selectedMasterDataArray = masterData_3;
        console.log(`VU ${__VU}: Using masterData_3 (Index 2)`);
    }

    // Select RANDOM master data (e.g., outlet for creation) FROM THE CHOSEN ARRAY
    let currentMasterData = null;
    if (selectedMasterDataArray && selectedMasterDataArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedMasterDataArray.length);
        currentMasterData = selectedMasterDataArray[randomIndex];
    } else {
        console.error(`VU ${__VU}: Selected master data array (Index ${depotIndex}) is empty or undefined! Halting iteration.`);
        return; // Stop iteration if data source is invalid
    }

    // Select specific order IDs for edit if needed
    let editOrderData = null;
    if (orderId && orderId.length > 0) {
        const randomEditIndex = Math.floor(Math.random() * orderId.length);
        editOrderData = orderId[randomEditIndex];
    } else {
        console.error(`VU ${__VU}: orderId SharedArray is empty or undefined! Cannot select order for edit.`);
        // Depending on requirements, you might return here or let it proceed without an edit ID
        // If you proceed, ordersEditFlow will skip itself due to missing orderIdToEdit
    }

    // Select specific order IDs for update if needed
    let updateOrderData = null;
    if (orderId2 && orderId2.length > 0) {
        const randomUpdateIndex = Math.floor(Math.random() * orderId2.length);
        updateOrderData = orderId2[randomUpdateIndex];
    } else {
        console.error(`VU ${__VU}: orderId2 SharedArray is empty or undefined! Cannot select order for update.`);
    }

    // Select specific depot/outlet external IDs for promotions
    let promoData = null;
    if (outlet_depot && outlet_depot.length > 0) {
        const randomPromoIndex = Math.floor(Math.random() * outlet_depot.length);
        promoData = outlet_depot[randomPromoIndex];
    } else {
        console.error(`VU ${__VU}: outlet_depot SharedArray is empty or undefined! Cannot select data for promotions.`);
        // Decide if this is critical enough to halt the iteration
    }

    // Prepare config data object to pass to flows
    const flowConfigData = {
        // Data needed by various flows
        outletId: currentMasterData?.outletId, // Use optional chaining
        externalId2: currentMasterData?.['outlet_External_Id'],
        userEmail: currentUser.username,
        orderIdToEdit: editOrderData?.order_Id, // Add data for order edit
        orderIdForStatusUpdate: updateOrderData?.order_Id, // Add data for update status
        depotExternalId: promoData?.depot_external_id, // Add data for promo flow
        outletExternalId: promoData?.outlet_external_id, // Add data for promo flow
        depotId: currentDepotId, //Add to select Depot
        // Add other dynamic data as needed by your flows
    };

    // Check if essential data like outletId is present before proceeding
    if (!flowConfigData.outletId) {
        console.error(`VU ${__VU}: Missing outletId after data selection. Halting iteration.`);
        // Optionally try logout before returning
        // logoutFlow(authToken);
        return;
    } // Return null or an indicator if essential data is missing

    // Log the randomly selected outlet ID and potentially the edit order ID
    console.log(`VU ${__VU} starting iteration with User ${currentUser.username}, using Depot ${currentDepotId}, Outlet Id ${currentMasterData?.outletId}, Edit Order ${editOrderData?.order_Id || 'N/A'}, Update Order ${updateOrderData?.order_Id || 'N/A'}, Promo Depot ${promoData?.depot_external_id || 'N/A'}`);
    return { currentUser, flowConfigData };
}

// --- Scenario Specific Execution Functions ---
// Scenario for: ordersCreateFlow, ordersEditFlow, ordersUpdateFlow
export function rampingVus() {
    const vuData = getVUData();
    if (!vuData) return; // Stop if essential data missing
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} [rampingVus] - Halting iteration due to login failure.`);
        return;
    }
    console.log(`VU ${__VU} [rampingVus] logged in.`);

    sleep(1);
    ordersCreateFlow(authToken, flowConfigData);
    sleep(1);
    ordersEditFlow(authToken, flowConfigData);
    sleep(1);
    ordersUpdateFlow(authToken, flowConfigData);

    // logoutFlow(authToken); // Optional logout
    console.log(`VU ${__VU} [rampingVus] finished iteration.`);
}

// Scenario for: ordersFilterFlow, ordersScrollingFlow, ordersSearchFlow, outletsSearchFlow
export function constantVus() {
    const vuData = getVUData();
    if (!vuData) return;
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} [constantVus] - Halting iteration due to login failure.`);
        return;
    }
    console.log(`VU ${__VU} [constantVus] logged in.`);

    sleep(1);
    ordersFilterFlow(authToken, flowConfigData);
    sleep(1);
    ordersScrollingFlow(authToken, flowConfigData);
    sleep(1);
    ordersSearchFlow(authToken, flowConfigData);
    sleep(1);
    outletsSearchFlow(authToken, flowConfigData);
    sleep(1);
    ordersPromoGetListFlow(authToken, flowConfigData);
    // logoutFlow(authToken); // Optional logout
    console.log(`VU ${__VU} [constantVus] finished iteration.`);
}

// Scenario for: ordersExportFlow (The "others")
export function pervuIterations() {
    const vuData = getVUData();
    if (!vuData) return;
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} [pervuIterations] - Halting iteration due to login failure.`);
        return;
    }
    console.log(`VU ${__VU} [pervuIterations] logged in.`);

    // sleep(1);
    // ordersExportFlow(authToken, flowConfigData);
    sleep(1);
    ordersPromoGetListFlow(authToken, flowConfigData);
    sleep(1);
    ordersPLScrollingFlow(authToken, flowConfigData);
    // logoutFlow(authToken); // Optional logout
    console.log(`VU ${__VU} [pervuIterations] finished iteration.`);
}

    // 3. Logout
    // logoutFlow(authToken);
    // console.log(`VU ${__VU} finished iteration.`);

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
    if (data.metrics.order_updating_success_rate) {
        console.log(`Order Update Success Rate: ${(data.metrics.order_updating_success_rate.values.rate * 100).toFixed(2)}%`);
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
        console.log(`Orders Promotions Get List Success Rate: ${(data.metrics.promo_get_list_success_rate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.pl_scrolling_success_rate) {
        console.log(`Orders PL Scrolling Success Rate: ${(data.metrics.pl_scrolling_success_rate.values.rate * 100).toFixed(2)}%`);
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
