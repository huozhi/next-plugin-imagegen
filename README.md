# next-plugin-imagegen
> A next.js plugin turns jsx components as image.


## Introduction

> ⚠️ Still in experiment! Use it in production with caution!

This plugin gives you ability to create image with next.js primitives (jsx/css), and serve images with routes. Any url query will be passed as props to the component to create any dynamic image. The generated image are cached to serve fast and in good quality.

For example, create `./pages/<path>.image.js` in your next.js projects
```js
import styles from './styles.module.css'

export default function render({name}) {
  return <div className={styles.root}>Logo {name}</div>
}
```

Accessing `/logo.image?name=hello` will return a image as the snapshot of the component.

## Install

```
yarn add next-plugin-imagegen
```
## Usage
### Basic usage

Edit `next.config.js`

```js
const { withImagegen } = require('next-plugin-imagegen')

module.exports = withImagegen({/* next.js config */})
```

Edit `./pages/api/imagegen/[...imagegen].js`

```js
import { handler, provider } from 'next-plugin-imagegen'

export default handler(provider())
```

By default, imagegen plugin will use [Microlink](https://microlink.io/) as default provider for snapshotting. This requires you to expose your network to the internet to make your endpoint accessible by microlink services. For example you can use `ngrok` to expose your localhost to web and visit the provided url for development.
### Advanced usage

To override the available microlink provider options, checkout [microlink options](https://microlink.io/docs/api/getting-started/overview) for details.

```js
import { handler, provider } from 'next-plugin-imagegen'

export default handler(
  provider({
    // Available options
    device: 'Macbook Pro 13',
    colorScheme: 'no-preference',
    viewport: { /* ... */ },
    
    // microlink PRO plan options
    apiKey: 'microlink api key',
    ttl: 'max',
    headers: { /* ... */ },
  })
)
```

> Note: Enable microlink PRO plan you can configure `apiKey` in the `mql` config or just pass `MICROLINK_TOKEN` as env variable.

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


export default handler(
  provider({
    // Available options
    headers: { /* ... */ },
    viewport: {/* ... */ },
    device: 'Macbook Pro 13',
    colorScheme: 'no-preference',
    type: 'png',
    quality: 50,
    clip: { /* ... */},
    omitBackground: false,
  })
)
```

To override the available puppeteer provider options, checkout [browserless screenshot options](https://browserless.js.org/#/?id=screenshoturl-options) for details.
### How It Works

Imagegen plugin uses rewrites and redirects to proxy your image component routes, and setup a handler at the same time to snapshot your proxied image component routes and send back to the original proxy.

