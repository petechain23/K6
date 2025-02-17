import { sleep, check, group } from 'k6'
import http from 'k6/http'
import { BASE_URL, AUTH_URL } from '../config.js';

export function login(cookies) {
  if (!cookies) {
      console.error('No session cookies available. Please check setup.js');
      return null;
  }
  // console.log(`Reusing Session Cookies for Login: ${JSON.stringify(cookies)}`);
  // Verify session by calling a protected endpoint (optional)
  const res = http.get(`${BASE_URL}/${AUTH_URL}`, { 
    headers: { 'Content-Type': 'application/json', cookies: cookies }  //Reuse cookies from setup.js},
  });
  // console.log(`login - print response status: ${res.status}`);
  
  check(res, {
    'Login - Session validation successful': (r) => r.status === 200
  });
  return cookies;  // Keep returning cookies for other modules
}