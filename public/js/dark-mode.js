const darkModeToggle = document.querySelector('#dark-mode');
const accountIdInput = document.querySelector('#account-id');

if (darkModeToggle && accountIdInput) {
  const accountId = accountIdInput.value;

  if (darkModeToggle.checked) {
    document.body.classList.add('dark');
  }


darkModeToggle.addEventListener("change", async () => {
    const darkMode = darkModeToggle.checked;

    document.body.classList.toggle('dark', darkMode);

    try {
        const response = await fetch('/account/dark-mode', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId, darkMode})
        });

        const data = await response.json();

        if (!data.success) {
            console.error('Failed to update dark mode in database');
            darkModeToggle.checked = !darkMode;
            document.body.classList.toggle('dark', !darkMode);
        }
    } catch (error) {
        console.error('Error sending toggle:', error);
        darkModeToggle.checked = !darkMode;
        document.body.classList.toggle('dark', !darkMode);
    }
});
}