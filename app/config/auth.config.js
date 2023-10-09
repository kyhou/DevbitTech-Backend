const fs = require('fs');
const path = require('path')

module.exports = {
    secret: fs.readFileSync(path.join(__dirname, 'hs256.key'), 'utf8'),
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
};