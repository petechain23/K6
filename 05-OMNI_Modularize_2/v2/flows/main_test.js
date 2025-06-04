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
        debug_run: { ...pervuIterationsWorkload, exec: 'debugScenario' },
        load_run: { ...ramupWorkload, exec: 'loadScenario' },
        // endurance_run: constantWorkload
    },
    thresholds: thresholdsSettings.thresholds, // Use thresholds from config
};

function getVUData() {
    // --- Data Selection ---
    // Select user data
    const currentUser = users[__VU % users.length];

    // Determine the index for depot selection (0, 1, or 2)
    const depotIndex = __VU % DEPOT_ID_FILTER.length;

    // Select the Depot ID based on the index
    const currentDepotId = DEPOT_ID_FILTER[depotIndex];

    let selectedMasterDataArray;
    let selectedOrderIdEditArray; // Variable to hold the chosen orderId array
    let selectedOrderIdUpdateArray; // Variable to hold the chosen orderId array

    if (depotIndex === 0) {
        selectedMasterDataArray = masterData;
        selectedOrderIdEditArray = orderId; // Use orderId for index 0
        selectedOrderIdUpdateArray = orderIdUpdate;
    } else if (depotIndex === 1) {
        selectedMasterDataArray = masterData_2;
        selectedOrderIdEditArray = orderId_2; // Use orderId for index 1
        selectedOrderIdUpdateArray = orderIdUpdate_2;
    } else { // Assuming index 2 (or any other index if DEPOT_ID_FILTER grows)
        selectedMasterDataArray = masterData_3;
        selectedOrderIdEditArray = orderId_3; // Use orderId for index 2
        selectedOrderIdUpdateArray = orderIdUpdate_3;
    }

    let currentMasterData = null;
    if (selectedMasterDataArray && selectedMasterDataArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedMasterDataArray.length);
        currentMasterData = selectedMasterDataArray[randomIndex];
    } else {
        console.error(`VU ${__VU}: Selected master data array (Index ${depotIndex}) is empty or undefined! Halting iteration.`);
        return null; 
    }

    let editOrderData = null;
    if (selectedOrderIdEditArray && selectedOrderIdEditArray.length > 0) {
        // Use Math.random() for random selection in each iteration
        //const editIndex = Math.floor(Math.random() * selectedOrderIdEditArray.length);
        //editOrderData = selectedOrderIdEditArray[editIndex];

        // Use VU number for sequential selection within the VU's assigned array
        const editIndex = __VU % selectedOrderIdEditArray.length; // Cycle through the array based on VU number
        editOrderData = selectedOrderIdEditArray[editIndex]; // Pick the order at the calculated index
    } else {
        console.error(`VU ${__VU}: Selected orderId array (Index ${depotIndex}) is empty or undefined! Cannot select order for edit/update.`);
    }

    let updateOrderData = null;
    if (selectedOrderIdUpdateArray && selectedOrderIdUpdateArray.length > 0) {
        // Use Math.random() for random selection in each iteration
        //const editIndex = Math.floor(Math.random() * selectedOrderIdUpdateArray.length);
        //updateOrderData = selectedOrderIdUpdateArray[editIndex];

        // Use VU number for sequential selection within the VU's assigned array
        const editIndex = __VU % selectedOrderIdUpdateArray.length; // Cycle through the array based on VU number
        updateOrderData = selectedOrderIdUpdateArray[editIndex]; // Pick the order at the calculated index

    } else {
        console.error(`VU ${__VU}: Selected orderId array (Index ${depotIndex}) is empty or undefined! Cannot select order for edit/update.`);
    }

    let promoData = null;
    if (outlet_depot && outlet_depot.length > 0) {
        const randomPromoIndex = Math.floor(Math.random() * outlet_depot.length);
        promoData = outlet_depot[randomPromoIndex];
    } else {
        console.error(`VU ${__VU}: outlet_depot SharedArray is empty or undefined! Cannot select data for promotions.`);
    }

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
        return null;
    }
    return { currentUser, flowConfigData };
}

// --- Main VU Function (default - can be used if no specific scenario exec is defined) ---
export default function () {
    console.log(`VU ${__VU} running default function - this will execute all flows if not overridden by a scenario 'exec'.`);
    const vuData = getVUData();
    if (!vuData) return;
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} - Halting iteration due to login failure.`);
        return; // Stop this iteration if login failed
    }

    // Default execution runs a sequence of flows
    sleep(1);
    ordersCreateFlow(authToken, flowConfigData);
    sleep(1);
    ordersEditFlow(authToken, flowConfigData);
    sleep(1);
    ordersExportFlow(authToken, flowConfigData);
    // ... add other flows if this default function is intended to run more

    // logoutFlow(authToken);
}

// --- Scenario Specific Execution Functions ---
export function debugScenario() {
    console.log(`VU ${__VU} executing debugScenario (OrdersExport).`);
    const vuData = getVUData();
    if (!vuData) return; // Stop if essential data missing
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} [debugScenario] - Halting iteration due to login failure.`);
        return;
    }

    sleep(1);
    ordersExportFlow(authToken, flowConfigData);

    // logoutFlow(authToken);
    // console.log(`VU ${__VU} [debugScenario] finished iteration.`);
}

export function loadScenario() {
    console.log(`VU ${__VU} executing loadScenario (OrdersCreate, OrdersEdit).`);
    const vuData = getVUData();
    if (!vuData) return; // Stop if essential data missing
    const { currentUser, flowConfigData } = vuData;

    const authToken = loginFlow(currentUser.username, currentUser.password);
    if (!authToken) {
        console.error(`VU ${__VU} [loadScenario] - Halting iteration due to login failure.`);
        return;
    }
    sleep(1);
    ordersCreateFlow(authToken, flowConfigData);
    sleep(1);
    ordersEditFlow(authToken, flowConfigData);

    // logoutFlow(authToken);
    // console.log(`VU ${__VU} [loadScenario] finished iteration.`);
}

// Import reporting utilities
import { generateReport } from './utils/reporting.js';

// --- handleSummary ---
// Use the reporting module to generate the summary
export function handleSummary(data) {
    return generateReport(data);}

// --- Optional Setup/Teardown ---
// export { setup } from './setup.js'; // Uncomment if using setup.js
// export { teardown } from './teardown.js'; // Uncomment if using teardown.js