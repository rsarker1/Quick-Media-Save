let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function getMediaUnderCursor(x, y) {
  let el = document.elementFromPoint(x, y)

  while (el) {
    if (el.tagName === 'IMG') {
      return {
        type: 'image',
        src: el.currentSrc || el.src || el.getAttribute('data-src'),
      }
    }

    if (el.tagName === 'VIDEO') {
      let src = el.currentSrc || el.src

      if (!src) {
        const source = el.querySelector('source')
        if (source) src = source.src
      }

      if (src) {
        return {
          type: 'video',
          src,
        }
      }
    }

    el = el.parentElement
  }

  return null
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_HOVERED_MEDIA') {
    try {
      const media = getMediaUnderCursor(mouseX, mouseY)
      sendResponse(media)
    } catch (error) {
      console.error('Error getting media:', error)
      sendResponse(null)
    }
    return true
  }
})
