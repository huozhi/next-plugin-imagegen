# next-plugin-imagegen
> A next.js plugin turns jsx components as image.


<p algin="left">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/next-plugin-imagegen">
    <img alt="" src="https://badgen.net/npm/v/next-plugin-imagegen">
  </a>
</p>


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
### HTML JSX

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

Visit route `/<path>.image.snapshot` to access the original rendered html page for image components.


To override the available microlink provider options, checkout [microlink options](https://microlink.io/docs/api/getting-started/overview) for details.

```js
import { handler, provider } from 'next-plugin-imagegen'

export default handler(
  provider({
    // Available options
    colorScheme: 'no-preference',
    viewport: { /* ... */ },
    omitBackground: false,
    // microlink PRO plan options
    apiKey: 'microlink api key',
    headers: { /* ... */ },
    ttl: 'max',
    type: 'png,
  })
)
```

Microlink options of pro plan

* `apiKey`: API token for microlink. Configure this option or just pass `MICROLINK_TOKEN` through env variable.
* `ttl`: the maximum quantity of time a resource served from cache layer is considered as valid. [microlink parameters/ttl](https://microlink.io/docs/api/parameters/ttl)
* `headers`: custom HTTP header to be passed along over the url. [microlink parameters/headers](https://microlink.io/docs/api/parameters/headers)

For rest options listed below, checkout [browserless API docs](https://browserless.js.org/#/?id=screenshoturl-options) for details of other options.

#### Puppeteer Provider

Use puppeteer to screenshot your image pages

```sh
yarn add next-plugin-imagegen next-plugin-imagegen-puppeteer
```

Specific puppeteer provider in `./pages/api/imagegen/[...imagegen].js`

```js
import { handler } from 'next-plugin-imagegen'
import { provider } from 'next-plugin-imagegen-puppeteer'


export default handler(
  provider({
    // Available options
    headers: { /* ... */ },
    viewport: {/* ... */ },
    colorScheme: 'no-preference',
    type: 'png',
    omitBackground: false,
    ttl: 31536000,
  })
)
```

* `ttl`: the maximum amount of time a resource is considered fresh, seconds in integer, `0` by default.
* `colorScheme`: value of `prefers-color-scheme`

#### HTML JSX Local Development

You can also specify puppeteer provider for local development, and default provider (microlink) for production.

Edit `./pages/api/imagegen/[...imagegen].js`

```js
import { handler, provider as defaultProvider } from 'next-plugin-imagegen'
import { provider } from 'next-plugin-imagegen-puppeteer'

export default handler(
  process.env.NODE_ENV === 'production' ? defaultProvider() : provider()
)
```

## How It Works

Imagegen plugin proxies your image component routes, and setup a handler at the same time to snapshot your original image component HTML and send back to user end.

