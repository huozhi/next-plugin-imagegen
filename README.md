# next-plugin-imagegen
> A next.js plugin turns jsx components as image.

Experimental! Use it in production with caution!

## Introduction

Create `./pages/api/imagegen/[...imagegen].js`

```js
import { handler, provider } from 'next-plugin-imagegen'

export default handler(provider())
```

`./pages/logo.image.js` in your next.js project
```js
import styles from './styles.module.css'

export default function render({name}) {
  return <div className={styles.root}>Logo {name}</div>
}
```

`/logo.image?name=hello` will return a image as the snapshot of your component

## Install

```
yarn add next-plugin-imagegen
```
## Usage

Edit `next.config.js`

```js
const { withImagegen } = require('next-plugin-imagegen')

module.exports = withImagegen({/* next.js config */})
```

### Advanced options

By default, imagegen plugin will use [Microlink](https://microlink.io/) as default provider for snapshotting. This requires you to expose your network to the internet to make your endpoint accessible by microlink services. For example you can use `ngrok` to expose your localhost to web and visit the provided url for development.


Configure the microlink query [options](https://microlink.io/docs/api/getting-started/overview)

```js
export default handler(
  provider({
    mql: {/* microlink options */}
  })
)
```

> Note: Enable microlink PRO plan you can configure `apiKey` in the `mql` config or just pass env var `MICROLINK_TOKEN` 

#### Other Providers

If you want to use other provider, like puppeteer, just do:


```
yarn add next-plugin-imagegen-puppeteer puppeteer
```

Few puppeteer drivers are available: `puppeteer`, `puppeteer-core`, `puppeteer-firefox`

Specific puppeteer provider in `./pages/api/imagegen/[...imagegen].js`

```js
import { handler } from 'next-plugin-imagegen'
import { provider } from 'next-plugin-imagegen-puppeteer'

export default handler(provider({ type: 'jpeg' }))
```

### How It Works

Imagegen plugin uses rewrites and redirects to proxy your image component routes, and setup a handler at the same time to snapshot your proxied image component routes and send back to the original proxy.

