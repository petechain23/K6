import http from 'k6/http';
import { check } from 'k6';

export function createOrder(credential) {
    const res = http.post('https://example.com/create-order', {
        username: credential.username,
        // Add other order details here
        item: 'exampleItem',
        quantity: 1,
    });

    check(res, {
        'order created': (r) => r.status === 200,
    });

    return res;
}