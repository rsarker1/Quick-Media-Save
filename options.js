const defaultSettings = {
  saveAs: false,
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(defaultSettings)

  document.getElementById('saveAs').checked = settings.saveAs
}

async function saveSettings() {
  const settings = {
    saveAs: document.getElementById('saveAs').checked,
  }

  await chrome.storage.sync.set(settings)

  const statusMessage = document.getElementById('statusMessage')
  statusMessage.textContent = 'Settings saved successfully!'
  statusMessage.className = 'status-message success'
  statusMessage.style.display = 'block'

  setTimeout(() => {
    statusMessage.style.display = 'none'
  }, 3000)
}

document.addEventListener('DOMContentLoaded', loadSettings)
document.getElementById('saveButton').addEventListener('click', saveSettings)

// Ctrl+S or Cmd+S for accessibility for saving
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveSettings()
  }
})
