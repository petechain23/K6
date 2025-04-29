// v2/main.js
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// Import Configs, Data, Metrics, Workloads, Thresholds
import {
    users, orderId, orderId2, // Data loaders
    thresholdsSettings, DEPOT_ID_FILTER ,
    masterData, masterData_2, masterData_3, // Thresholds
    // Import workloads if needed directly for options
    pervuiterations, constantWorkload, sharedWorkload, ramupWorkload
} from './config.js';

// Import Flow Functions
import { loginFlow } from './pages/login.js';
import { logoutFlow } from './pages/logout.js';
import { ordersCreateFlow } from './pages/ordersCreate.js';
import { ordersEditFlow } from './pages/ordersEdit.js';
import { ordersUpdateFlow } from './pages/ordersUpdate.js';
import { ordersExportFlow } from './pages/ordersExport.js';
// Import other flows if created (Promotions, Performance, Inventory)
// import { promotionsFlow } from './flows/promotions.js';

// --- k6 Options ---
// Define scenarios using imported workloads
export const options = {
    cloud: {
        distribution: { 'amazon:sg:singapore': { loadZone: 'amazon:sg:singapore', percent: 100 } },
        apm: [],
    },
    scenarios: {
        // Choose one or more scenarios
        debug_run: pervuiterations,
        // load_run: ramupWorkload,
        // endurance_run: constantWorkload,
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

    // Select specific order IDs for edit/update if needed
    // --- MODIFIED: Select a RANDOM order for editing ---
    let editOrderData = null;
    if (orderId && orderId.length > 0) {
        const randomEditIndex = Math.floor(Math.random() * orderId.length);
        editOrderData = orderId[randomEditIndex];
    } else {
        console.error(`VU ${__VU}: orderId SharedArray is empty or undefined! Cannot select order for edit.`);
        // Depending on requirements, you might return here or let it proceed without an edit ID
        // If you proceed, ordersEditFlow will skip itself due to missing orderIdToEdit
    }
    // --- END MODIFICATION ---

    // Keep update order selection as round-robin (or change if needed)
    const updateOrderData = orderId2[__VU % orderId2.length];
    // --- End Data Selection ---

    // Log the randomly selected outlet ID and potentially the edit order ID
    console.log(`VU ${__VU} starting iteration with user ${currentUser.username} using Depot ${currentDepotId}, Outlet ${currentMasterData?.outletId}, Edit Order ${editOrderData?.order_Id || 'N/A'}`);

    // 1. Login
    const authToken = loginFlow(currentUser.username, currentUser.password);

    if (!authToken) {
        console.error(`VU ${__VU} - Halting iteration due to login failure.`);
        return; // Stop this iteration if login failed
    }

    // Prepare config data object to pass to flows
    const flowConfigData = {
        // Data needed by various flows
        outletId: currentMasterData?.outletId, // Use optional chaining
        userEmail: currentUser.username,
        orderIdToEdit: editOrderData?.order_Id, // Use optional chaining
        orderIdForStatusUpdate: updateOrderData?.order_Id, // Use optional chaining
        depotId: currentDepotId,
        // Add other dynamic data as needed by your flows
    };

     // Check if essential data like outletId is present before proceeding
     if (!flowConfigData.outletId) {
        console.error(`VU ${__VU}: Missing outletId after data selection. Halting iteration.`);
        // Optionally try logout before returning
        // logoutFlow(authToken);
        return;
     }

    // 2. Execute Order Flows (Add sleeps for think time)
    // sleep(2);
    // ordersCreateFlow(authToken, flowConfigData);

    sleep(2);
    // ordersEditFlow will now receive a potentially random orderIdToEdit (or null if the array was empty)
    ordersEditFlow(authToken, flowConfigData);

    // sleep(1);
    // ordersUpdateFlow(authToken, flowConfigData); // Pass token and data

    // sleep(2);
    // ordersExportFlow(authToken, flowConfigData);

    // Add calls to other flows if implemented
    // sleep(2);
    // promotionsFlow(authToken, flowConfigData);

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
    const reportName = `./summary_report_${timestamp}.html`;

    console.log("-------------------- Custom Metrics Summary --------------------");
    // Log specific metrics if desired (check if metric exists first)
    if (data.metrics.orderCreate_SuccessRate) {
        console.log(`Order Create Success Rate: ${(data.metrics.orderCreate_SuccessRate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.editOrder_SuccessRate) {
        console.log(`Order Edit Success Rate:   ${(data.metrics.editOrder_SuccessRate.values.rate * 100).toFixed(2)}%`);
    }
    if (data.metrics.updateOrder_SuccessRate) {
        console.log(`Order Update Success Rate: ${(data.metrics.updateOrder_SuccessRate.values.rate * 100).toFixed(2)}%`);
    }
     if (data.metrics.exportOrder_SuccessRate) {
        console.log(`Order Export Success Rate: ${(data.metrics.exportOrder_SuccessRate.values.rate * 100).toFixed(2)}%`);
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
export { setup } from './setup.js'; // Uncomment if using setup.js
export { teardown } from './teardown.js'; // Uncomment if using teardown.js
