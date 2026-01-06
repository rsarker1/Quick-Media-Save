chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'save-hovered-media') return

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (!tab?.id) {
      console.error('No active tab found')
      return
    }

    chrome.tabs.sendMessage(
      tab.id,
      { type: 'GET_HOVERED_MEDIA' },
      async (media) => {
        if (chrome.runtime.lastError) {
          console.error('Message error:', chrome.runtime.lastError.message)
          return
        }

        if (!media?.src) {
          console.log('No media found under cursor')
          return
        }

        try {
          let downloadUrl = media.src
          // if (!downloadUrl.startsWith("http") && !downloadUrl.startsWith("data:")) {
          //   downloadUrl = new URL(media.src, tab.url).href;
          // }

          // const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

          let ext = media.type === 'video' ? 'mp4' : 'jpg'
          const urlExt = downloadUrl.match(/\.([a-z0-9]+)(?:[?#]|$)/i)

          if (urlExt) {
            const detectedExt = urlExt[1].toLowerCase()
            if (
              ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(detectedExt)
            ) {
              ext = detectedExt === 'jpeg' ? 'jpg' : detectedExt
            } else if (['mp4', 'webm', 'mov', 'avi'].includes(detectedExt)) {
              ext = detectedExt
            }
          }

          // const filename = `media-${timestamp}.${ext}`
          await chrome.downloads.download({
            url: downloadUrl,
            // filename: filename,
            conflictAction: 'uniquify',
            saveAs: false,
          })

          console.log(`Downloaded`)
        } catch (error) {
          console.error('Download failed:', error)
        }
      }
    )
  } catch (error) {
    console.error('Command handler error:', error)
  }
})
