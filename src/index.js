import videojs from 'video.js'
import { version as VERSION } from '../package.json'
import window from 'global/window'

function isInViewport() {
  const rect = document?.querySelector('.vjs-tech')?.getBoundingClientRect()
  const html = document.documentElement

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  )
}

/**
 * @typedef {Object} RotateOptions
 * @property {boolean} disabled - Manual disable rotation
 * @property {boolean} onlyInView - Rotate only when the video fits in the viewport
 * @property {boolean} enterOnRotate - Enter fullscreen mode on rotate.
 * @property {boolean} exitOnRotate - Exit fullscreen mode on rotate.
 * @property {boolean} alwaysInLandscapeMode - Always in landscape mode.
 * @property {boolean} rotateWithPause - Enter fullscreen even when paused.
 * @property {boolean} windowMode - Use window mode instead of fullscreen.
 */

/** @type {RotateOptions} */
const defaults = {
  disabled: false,
  enterOnRotate: true,
  exitOnRotate: true,
  alwaysInLandscapeMode: true,
  onlyInView: true,
  rotateWithPause: false,
  windowMode: false,
}

const screen = window.screen

const lockOrientationUniversal = (mode) => {
  const screen = window.screen

  if (screen.orientation && screen.orientation.lock) {
    return screen.orientation.lock(mode)
  } else if (screen.mozLockOrientation) {
    return screen.mozLockOrientation(mode)
  } else if (screen.msLockOrientation) {
    return screen.msLockOrientation(mode)
  }
  console.log('Orientation locking not supported')
  return null
}

const angle = () => {
  // iOS
  if (typeof window.orientation === 'number') {
    return window.orientation
  }
  // Android
  if (screen && screen.orientation && screen.orientation.angle) {
    return window.orientation
  }
  videojs.log('angle unknown')
  return 0
}

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  if (options.disabled) {
    return
  }

  if (videojs.browser.IS_IOS && videojs.browser.IOS_VERSION > 9) {
    player.tech_.el_.setAttribute('playsinline', 'playsinline')
    player.tech_.supportsFullScreen = function () {
      return false
    }
  }

  const rotationHandler = () => {
    if (options.onlyInView) {
      if (!isInViewport()) {
        return
      }
    }
    const currentAngle = angle()
    const isFullScreen = player.isFullscreen() || player.isFullWindow
    if (currentAngle === 90 || currentAngle === 270 || currentAngle === -90) {
      if (options.enterOnRotate && (player.paused() === false || options.rotateWithPause)) {
        if (options.windowMode) {
          player.enterFullWindow()
        }
        if (!options.windowMode) {
          player.requestFullscreen()
        }
        lockOrientationUniversal('landscape')
      }
    }
    if (currentAngle === 0 || currentAngle === 180) {
      if (options.exitOnRotate && isFullScreen) {
        if (options.windowMode) {
          player.exitFullWindow()
        }
        if (!options.windowMode) {
          player.exitFullscreen()
        }
      }
    }
  }

  if (videojs.browser.IS_IOS) {
    window.addEventListener('orientationchange', rotationHandler)
  } else if (screen && screen.orientation) {
    // addEventListener('orientationchange') is not a user interaction on Android
    screen.orientation.onchange = rotationHandler
  }

  player.on('fullscreenchange', (e) => {
    if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
      if (
        !angle() &&
        (player.isFullscreen() || player.isFullWindow) &&
        options.alwaysInLandscapeMode
      ) {
        lockOrientationUniversal('landscape')
      }
    }
  })

  player.on('dispose', () => {
    window.removeEventListener('orientationchange', rotationHandler)
  })
}

/**
 * A video.js plugin to handle fullscreen rotation based on device orientation.
 *
 * @function rotateFullScreen
 * @param {RotateOptions} [options={}]
 * Options to customize rotation and fullscreen behavior.
 */
const rotateFullScreen = function (/** @type {RotateOptions} */ options = {}) {
  if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
    this.ready(() => {
      onPlayerReady(this, videojs.mergeOptions(defaults, options))
    })
  }
}

registerPlugin('rotateFullScreen', rotateFullScreen)

rotateFullScreen.VERSION = VERSION

export { rotateFullScreen as default }
