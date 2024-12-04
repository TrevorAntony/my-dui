import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const tempPackageJsonPath = path.resolve(__dirname, '../../temp.package.json');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
};

const parseArguments = () => {
  const args = process.argv.slice(2);
  const parsed = { target: null, options: {} };

  args.forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      const normalizedKey = key.replace('--', '');
      if (value) {
        parsed.options[normalizedKey] = value;
      } else if (!parsed.target) {
        parsed.target = normalizedKey;
      } else {
        process.exit(1);
      }
    }
  });

  return parsed;
};

const modifyPackageJson = (filePath, callback) => {
  const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  callback(packageJson);
  fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
};

const main = () => {
  const { target, options } = parseArguments();
  if (!target) process.exit(1);

  const implementationCode = options.code || '';

  fs.copyFileSync(packageJsonPath, tempPackageJsonPath);

  try {
    modifyPackageJson(packageJsonPath, (packageJson) => {
      delete packageJson.dependencies.electron;
      const targetConfig = packageJson.build[target];
      if (targetConfig && targetConfig.artifactName) {
        targetConfig.artifactName = targetConfig.artifactName.replace('${implementationCode}', implementationCode);
      } else {
        process.exit(1);
      }
    });

    runCommand(`electron-builder --${target}`);
  } finally {
    fs.copyFileSync(tempPackageJsonPath, packageJsonPath);
    fs.unlinkSync(tempPackageJsonPath);
  }
};

main();
