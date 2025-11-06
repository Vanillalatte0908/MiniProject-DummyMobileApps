document.getElementById('run-all-btn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  output.textContent = '🚀 Running all tests...\n';
  document.getElementById('view-allure').style.display = 'none';

  const response = await fetch('/run-tests', { method: 'POST' }); // no body → all tests
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    output.textContent += decoder.decode(value);
    output.scrollTop = output.scrollHeight;
  }

  output.textContent += '\n✅ All tests completed!';
  document.getElementById('view-allure').style.display = 'inline';
});
