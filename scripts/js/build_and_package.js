import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootPath = path.resolve(__dirname, '..');
const packageJsonPath = path.resolve(rootPath, '../package.json');
const tempPackageJsonPath = path.resolve(rootPath, '../temp.package.json');

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    process.exit(1);
  }
};

const modifyPackageJson = (callback) => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  callback(packageJson);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};


const main = () => {
  const args = process.argv.slice(2);
  let targets = '';
  if (args.length > 0) {
    targets = args.join(' ');
  }

  console.log('Building renderer process...');
  runCommand('yarn run build:for:electron');


  console.log('Temporarily removing electron dependency...');
  modifyPackageJson((packageJson) => {
    packageJson._originalDependencies = { ...packageJson.dependencies };
    delete packageJson.dependencies.electron;
  });

  fs.copyFileSync(packageJsonPath, tempPackageJsonPath);

  console.log(`Running electron-builder with targets: ${targets}`);
  runCommand(`electron-builder ${targets}`);

  console.log('Restoring original package.json...');
  modifyPackageJson((packageJson) => {
    packageJson.dependencies = { ...packageJson._originalDependencies };
    delete packageJson._originalDependencies;
  });
  fs.unlinkSync(tempPackageJsonPath);

  console.log('Build and packaging completed successfully.');
};

main();
