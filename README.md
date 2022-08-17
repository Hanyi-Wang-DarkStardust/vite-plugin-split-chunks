# vite-plugin-split-chunks

A Vite.js plugin to provide elegant solution for code splitting.


## Usage

Install plugin by npm related tools:

```bash
// npm version
npm i vite-plugin-split-chunks --save-dev

// pnpm version 
pnpm i vite-plugin-split-chunks --save-dev

// yarn version 
yarn add vite-plugin-split-chunks -D
```

Include plugin in ```vite.config.ts```

```typescript
// vite.config.js
import { defineConfig } from 'vite'
import splitChunksPlugin, { ESplitChunkType } from 'vite-plugin-split-chunks';

export default defineConfig({
  plugins: [splitChunksPlugin({
    type: ESplitChunkType.Custom,
    customChunkStrategy: {
      'react-vendor': {
        candidates: ['react', 'react-dom'], 
      },
      'main-components': {
        candidates: /src\/components/,
      }
    }
  })]
})
```
