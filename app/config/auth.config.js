import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;
let secret;

if (fs.existsSync(path.join(__dirname, 'hs256.key'))) {
    secret = fs.readFileSync(path.join(__dirname, 'hs256.key'), 'utf8');
} else {
    secret = process.env.SECRET;
}
const config = {
    secret,
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
};

export default config