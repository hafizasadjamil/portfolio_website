const dns = require('dns');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Some networks refuse the SRV lookups that mongodb+srv:// URIs need.
// Set DNS_SERVERS=1.1.1.1,8.8.8.8 to use other resolvers for this process only.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map(item => item.trim()).filter(Boolean));
}

const requireEnv = (...names) => {
  const missing = names.filter(name => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')} (see backend/.env.example)`);
  }
};

module.exports = { requireEnv };
