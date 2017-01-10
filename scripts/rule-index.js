const fs = require("fs");
const path = require("path");
const glob = require("glob");

const rulesDir = path.join(__dirname, "..", "src", "rules");
const indexFile = path.join(rulesDir, "index.js");
const ignore = [indexFile];
const nodir = true;
const files = glob.sync(`${rulesDir}/*.js`, { nodir, ignore });
const indexContent = files.map(f =>
  `import "./${path.basename(f)}";`
).join("\n");

fs.writeFileSync(indexFile, indexContent, "utf8");
console.log("Done!!");
