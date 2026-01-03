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

    // Request media from content script
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

        chrome.downloads.download({
          url: media.src,
          conflictAction: 'uniquify',
          saveAs: false,
        })
        // try {
        //   // Handle relative URLs
        //   let downloadUrl = media.src;
        //   if (!downloadUrl.startsWith("http") && !downloadUrl.startsWith("data:")) {
        //     downloadUrl = new URL(media.src, tab.url).href;
        //   }

        //   // Generate filename with extension
        //   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        //   const ext = media.type === "video" ? "mp4" : "jpg";
        //   const filename = `media-${timestamp}.${ext}`;

        //   await chrome.downloads.download({
        //     url: downloadUrl,
        //     filename: filename,
        //     conflictAction: "uniquify",
        //     saveAs: false
        //   });

        //   console.log(`Downloaded: ${filename}`);
        // } catch (error) {
        //   console.error("Download failed:", error);
        // }
      }
    )
  } catch (error) {
    console.error('Command handler error:', error)
  }
})
