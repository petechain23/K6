import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { thresholdsSettings, sharedWorkload, ramupWorkload } from "./config.js";
import { setup } from './setup.js';
import { teardown } from './teardown.js';
import { login } from "./login.js";
import { createOrder } from "./orders.js";

export { setup, teardown }

export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ? sharedWorkload : ramupWorkload
    },
    thresholds: thresholdsSettings.thresholds
};

const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';

export default function (data) {   
    // //Pick a random outletId
    // const randomOutlet = csvData[Math.floor(Math.random() * csvData.length)];
    // // export const outletId = randomOutlet.outlet_id;
    // const oID = randomOutlet.outlet_id;
    // console.log('Random Outlet: ', outletId);
    
    // //Pick a random variant_id
    // const randomSku = csvData2[Math.floor(Math.random() * csvData2.length)];   
    // const vID = randomSku.variant_id;
    // console.log('Random Sku: ', variant_id);

    // //Pick a random number of qty
    // const randomQty = Math.floor(Math.random() * 10) + 1;
    // const qTY = randomQty;
    // console.log('Random Qty: ', randomQty);

    const credential = JSON.stringify(data.payloads);
    console.log('credential: ', credential);
    const oID = data.outletIds;
    console.log('oID: ', oID);
    const vID = data.variant_ids;
    console.log('vID: ', vID);
    const qTY = data.randomQtys;
    console.log('qTY: ', qTY);
    const loginRes = login(credential); // console.log('Status: ', JSON.parse(loginRes.status));
    // console.log('Random user3: ', JSON.parse(loginRes.body));
    
    if (JSON.parse(loginRes.status) === 200) {
        console.log('OK NHA!!!')
        // createOrder(baseUrl, oID, vID, qTY);
    }
}