import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve Allure report
app.use('/allure-report', express.static(path.join(__dirname, 'allure-report')));

// ✅ Endpoint to list test files
app.get('/tests', (req, res) => {
  const testDir = path.join(__dirname, 'test', 'specs');

  // recursive function to find all .js files
  function getAllTestFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllTestFiles(filePath)); // recursive
      } else if (file.endsWith('.js')) {
        // normalize to forward slashes for frontend
        const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
        results.push(relativePath);
      }
    });
    return results;
  }

  try {
    const files = getAllTestFiles(testDir);
    res.json({ tests: files });
  } catch (err) {
    console.error('❌ Error reading test files:', err);
    res.status(500).json({ error: 'Failed to read test files' });
  }
});

// ✅ Run one or all tests
app.post('/run-tests', (req, res) => {
  const { spec, grep } = req.body || {};
  const command = 'npx';
  const args = ['wdio', 'run', 'wdio.conf.js'];

  if (spec) args.push('--spec', spec);
  if (grep) args.push('--grep', grep);

  console.log(`🚀 Running WDIO with args: ${args.join(' ')}`);

  const child = spawn(command, args, { shell: true });
  res.setHeader('Content-Type', 'text/plain');

  child.stdout.on('data', data => res.write(data));
  child.stderr.on('data', data => res.write(data));
  child.on('close', code => {
    res.write(`\n✅ WDIO finished with exit code ${code}`);
    res.write(`\n✅ Allure report available at /allure-report/index.html`);
    res.end();
  });
});

const PORT = 3002;
app.listen(PORT, () =>
  console.log(`🚀 WDIO Test Runner + Allure UI running at http://localhost:${PORT}`)
);