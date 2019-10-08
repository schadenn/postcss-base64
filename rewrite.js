const fs = require("fs");
const path = require("path");

const cjsPath = path.join(__dirname, "dist/cjs/index.js");

fs.writeFileSync(
  cjsPath,
  `${fs.readFileSync(cjsPath)}\n module.exports = exports["default"];`
);
