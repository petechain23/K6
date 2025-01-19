import { setup } from './setup.js';
import { teardown } from './teardown.js';
import { login } from './login.js';
import { createOrder } from './createOrder.js';
import { sharedWorkload } from "./config.js";

export { setup, teardown };

export const options = {
    scenarios: {
        my_scenario: __ENV.WORKLOAD === 'breaking' ?  ramupWorkload :sharedWorkload
    }
};

export default function (data) {
    // const credential = setupData[Math.floor(Math.random() * setupData.length)];
    const credential = JSON.stringify(data.credential);
    // console.log('Random user3: ', JSON.stringify(data.credential));
    login(credential);

    // console.log('Random user3: ', loginRes);
    // if (loginRes.status === 200) {
    //     createOrder(credential);
    // }
}