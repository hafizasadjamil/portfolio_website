const path = require('path');

const BUNDLED_UPLOADS = path.join(__dirname, '..', 'uploads');

// On hosts with a temporary disk, point UPLOADS_DIR at a persistent volume.
// Images that ship with the repo are still served from BUNDLED_UPLOADS.
const UPLOADS_DIR = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : BUNDLED_UPLOADS;

module.exports = { BUNDLED_UPLOADS, UPLOADS_DIR };
