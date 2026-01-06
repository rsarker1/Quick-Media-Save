const defaultSettings = {
  saveAs: false,
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast')
  const toastMessage = toast.querySelector('.toast-message')
  const toastIcon = toast.querySelector('.toast-icon')

  toastMessage.textContent = message

  if (type === 'success') {
    toastIcon.textContent = '✓'
    toast.className = 'toast success'
  } else if (type === 'error') {
    toastIcon.textContent = '✕'
    toast.className = 'toast error'
  }

  setTimeout(() => {
    toast.classList.add('show')
  }, 10)

  setTimeout(() => {
    toast.classList.remove('show')
  }, 3000)
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(defaultSettings)

  document.getElementById('saveAs').checked = settings.saveAs
}

async function saveSettings() {
  const settings = {
    saveAs: document.getElementById('saveAs').checked,
  }

  try {
    await chrome.storage.sync.set(settings)
    showToast('Settings saved successfully!', 'success')
  } catch (error) {
    showToast('Failed to save settings', 'error')
    console.error('Save error:', error)
  }
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
