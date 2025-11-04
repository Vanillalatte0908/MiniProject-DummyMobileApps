import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve generated Allure report
app.use('/allure-report', express.static(path.join(__dirname, 'allure-report')));

// 🔹 Run all tests via WDIO config
app.post('/run-tests', (req, res) => {
  const command = 'npx';
  const args = ['wdio', 'wdio.conf.js'];

  const child = spawn(command, args, { shell: true });
  res.setHeader('Content-Type', 'text/plain');

  child.stdout.on('data', data => res.write(data));
  child.stderr.on('data', data => res.write(data));
  child.on('close', code => {
    res.write(`\n✅ WDIO finished with exit code ${code}`);
    res.write(`\n✅ Allure report should now be available at /allure-report/index.html`);
    res.end();
  });
});

const PORT = 3002;
app.listen(PORT, () =>
  console.log(`🚀 WDIO Test Runner + Allure UI running at http://localhost:${PORT}`)
);
