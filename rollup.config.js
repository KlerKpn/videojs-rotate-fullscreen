import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import { min, main, browser } from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: browser,
        format: 'umd',
        name: 'videojsFullscreenRotatePlugin',
        globals: {
          videojs: 'videojs',
        },
      },
      {
        file: min,
        format: 'umd',
        name: 'videojsFullscreenRotatePlugin',
        plugins: [terser()],
      },
    ],
    external: ['videojs'],
    plugins: [json()],
  },
  {
    input: 'src/index.js',
    output: {
      file: main,
      format: 'es',
    },
    external: ['videojs'],
    plugins: [json()],
  },
]
