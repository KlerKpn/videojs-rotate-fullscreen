# Full-screen mode control when changing the mobile device orientation

1. Support window mode
2. Pause control
3. Auto enter/exit fullscreen

### Example

```js
player.rotateFullScreen({
  enterOnRotate: true, // - Enter fullscreen mode on rotate.
  exitOnRotate: true, // - Exit fullscreen mode on rotate.
  alwaysInLandscapeMode: true, // - Always in landscape mode.
  rotateWithPause: false, // - Enter fullscreen even when paused.
  windowMode: false, // - Use window mode instead of fullscreen. (option for Safari with custom ui)
})
```
<br>

### React Example
```js
import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'videojs-rotate-fullscreen'

export const Video = (options) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoRef.current.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options))

      player.rotateFullScreen({
        enterOnRotate: true,
        exitOnRotate: true,
        alwaysInLandscapeMode: true,
        rotateWithPause: true,
        windowMode: true,
      })
    } else {
      const player = playerRef.current
      player.src(options.sources)
    }

    return () => {
      const player = playerRef.current
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [options])

  return <div data-vjs-player ref={videoRef} />
}
```
