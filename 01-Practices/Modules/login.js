import http from 'k6/http';
import { check } from 'k6';

export function login(credential) {
    const res = http.post('https://example.com/login', {
        username: credential.username,
        password: credential.password,
    });

    check(res, {
        'login successful': (r) => r.status === 200,
    });

    return res;
}