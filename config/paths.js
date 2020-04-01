const path = require('path');

const CWD = process.cwd();
const CLIENT_DIR = path.resolve(CWD, 'src');
const BUILD_DIR = path.resolve(CWD, 'build');
const MANIFEST_FILE = path.join(BUILD_DIR, 'manifest.json');

module.exports = {
  CWD,
  CLIENT_DIR,
  BUILD_DIR,
  MANIFEST_FILE
}
