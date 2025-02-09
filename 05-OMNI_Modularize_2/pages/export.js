import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, masterData } from '../config.js';

export function fetchExportData(sessionCookie) {
    for (const { outletID } of masterData) {
        const res = http.get(`${BASE_URL}/api/export?outletID=${outletID}`, { 
            headers: { 'Cookie': `session=${sessionCookie}` } 
        });
        check(res, { [`Export completed for Outlet ${outletID}`]: (r) => r.status === 200 });
        sleep(1);
    }
}