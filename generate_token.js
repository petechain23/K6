const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex'); // 64 character hex string
console.log(token);