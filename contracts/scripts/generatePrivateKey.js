const crypto = require('crypto');

const privateKey = `0x${crypto.randomBytes(32).toString('hex')}`;
console.log(`Private Key: ${privateKey}`);
