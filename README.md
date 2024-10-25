# Full-screen mode control when changing the mobile device orientation

1. Support window mode
2. Pause control
3. Auto enter/exit fullscreen

### Example

```js
/* Default values */
player.rotateFullScreen({
  onlyInView: true, // - Rotate only when the video fits in the viewport
  enterOnRotate: true, // - Enter fullscreen mode on rotate.
  exitOnRotate: true, // - Exit fullscreen mode on rotate.
  alwaysInLandscapeMode: true, // - Always in landscape mode.
  rotateWithPause: false, // - Enter fullscreen even when paused.
  windowMode: false, // - Use window mode instead of fullscreen. (option for Safari with custom ui)
  disabled: false, // - Manual disable rotation
})
```

<br>

### React Example

```js
import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-rotate-fullscreen'

export const Video = (props) => {
  const videoRef = useRef(null)
  const playerRef = useRef(null)

  const { fill, playsinline, playbackRates, src, type } = props

  const videoJsOptions = {
    fill: fill,
    responsive: false,
    fluid: false,
    playbackRates: playbackRates,
    sources: [
      {
        src: src,
        type: type ?? 'video/mp4',
      },
    ],
  }

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoRef.current.appendChild(videoElement)
      const player = (playerRef.current = videojs(videoElement, videoJsOptions))

      player.rotateFullScreen({
        enterOnRotate: true,
        exitOnRotate: true,
        alwaysInLandscapeMode: false,
        rotateWithPause: true,
        windowMode: false,
        onlyInView: true,
      })
    } else {
      const player = playerRef.current
      player.src(videoJsOptions.sources)
    }

    return () => {
      const player = playerRef.current
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [videoJsOptions])

  return (
    <div
      data-vjs-player
      ref={videoRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}
```
