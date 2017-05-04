const fs = require('fs');
const path = require('path');
const glob = require('glob');

const createIndex = (dirname, ignore = [], priority = []) => {
  const dir = path.join(__dirname, '..', 'src', dirname);
  const indexFile = path.join(dir, 'index.ts');
  const map = arr => arr.map(f => path.join(dir, f));
  const ignoreList = map(['index.ts', ...ignore]);
  const priorityList = map(priority);

  const nodir = true;
  const globPath = `${dir}/*.ts`;
  const advancedFiles = glob.sync(globPath, { nodir, ignore: [...ignoreList, ...priorityList] });
  const files = [...priorityList, ...advancedFiles];

  const content = files.map(f =>
    `import './${path.basename(f, '.ts')}';\n`
  ).join('');

  fs.writeFileSync(indexFile, content, 'utf8');

  console.log('Done!!');
};

module.exports = createIndex;
