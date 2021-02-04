# next-plugin-imagegen

🚧 🚧 🚧 
Experimental! WIP

A next.js plugin turns jsx components as image.

```js
// ./pages/logo.image.js

export default function redner({name}) {
  return <div>Logo {name}</div>
}
```

`/logo.image?name=hello` will return a image as the snapshot of your component

### Install

```
yarn add next-plugin-imagegen
```
### Usage

Add in next.config.js

```js
const withImagegen = require('next-plugin-imagegen')

module.exports = withImagegen()({
  // ... next.js config, or leave it empty
})
```

Or use with options
```js
module.exports = withImagegen({
  api: 'imagegen__',
})({
  // ... next.js config, or leave it empty
})
``` 

#### Options

* `api`, the endpoint receive image crawling requests, `'imagegen'` by default.

#### Setup Api Handler

Create `./pages/api/imagegen.js`. If you have overwritten the `api`, create the handler file matching the route you specify. 
e.g. `api: 'imagegen__'`, create `./pages/api/imagegen__.js` instead.

```js
// ./pages/api/imagegen.js
import imagegenMiddleware from 'next-plugin-imagegen/middleware'

export default imagegenMiddleware()
```

By default, imagegen plugin will use microlink for snapshot your component on production. If you want to use other provider, like puppeteer, just do:


```
yarn add next-plugin-imagegen-puppeteer
```

```js
import imagegenMiddleware from 'next-plugin-imagegen/middleware'

// Use pyppeteer for local environment debugging
export default imagegenMiddleware(
  process.env.NODE_ENV === 'production' ? null : require('next-plugin-imagegen-puppeteer')
)

// Or use it for all envrionments
export default imagegenMiddleware(require('next-plugin-imagegen-puppeteer'))
```

### How It Works

Imagegen plugin uses rewrites and redirects to proxy your image component routes, and setup a handler at the same time to snapshot your proxied image component routes and send back to the original proxy.
