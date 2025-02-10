import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, masterData } from '../config.js';

export function inventory(sessionCookie) {
    for (const { outletID, skuID } of masterData) {
        const res = http.get(`${BASE_URL}/api/inventory?outletID=${outletID}&skuID=${skuID}`, { 
            headers: { 'Cookie': `session=${sessionCookie}` } 
        });
        check(res, { [`Fetched inventory for Outlet ${outletID} - SKU ${skuID}`]: (r) => r.status === 200 });
        sleep(0.5);
    }
}