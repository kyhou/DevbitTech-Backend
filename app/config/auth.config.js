const fs = require('fs');
const path = require('path')

let secret;

if (fs.existsSync(path.join(__dirname, 'hs256.key'))) {

    secret = fs.readFileSync(path.join(__dirname, 'hs256.key'), 'utf8');
} else {
    secret = process.env.SECRET;
}
module.exports = {
    secret,
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
};