const fs = require("fs");
const path = require("path");
const glob = require("glob");

const rulesDir = path.join(__dirname, "..", "src", "rules");
const indexFile = path.join(rulesDir, "index.js");
const mapRulesDir = arr => arr.map(f => path.join(rulesDir, f));

const ignore = mapRulesDir([
  "index.js"
]);

const coreRules = mapRulesDir([
  "array.js",
  "date.js",
  "falsy.js",
  "float.js",
  "integer.js",
  "number.js",
  "numeric.js",
  "object.js",
  "required.js",
  "string.js",
  "truthy.js"
]);

const nodir = true;
const globPath = `${rulesDir}/*.js`;
const advancedRules = glob.sync(globPath, { nodir, ignore: [...ignore, ...coreRules] });
const files = [...coreRules, ...advancedRules];
const indexContent = files.map(f =>
  `import "./${path.basename(f)}";\n`
).join("");

fs.writeFileSync(indexFile, indexContent, "utf8");
console.log("Done!!");
