document.getElementById('run-btn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  output.textContent = '🚀 Running WebdriverIO tests...\n';
  document.getElementById('view-allure').style.display = 'none';

  const response = await fetch('/run-tests', { method: 'POST' });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    output.textContent += decoder.decode(value);
    output.scrollTop = output.scrollHeight;
  }

  output.textContent += '\n✅ Tests completed!';
  document.getElementById('view-allure').style.display = 'inline';
});
