# next-plugin-imagegen

🚧 🚧 🚧 
Experimental! WIP

### Install

```
yarn add next-plugin-imagegen
```
### Usage

Add in next.config.js

```js
const withImagegen = require('next-plugin-imagegen')

module.exports = withImagegen({
  // ... your custom next.js config, or leave it empty
})
``` 


Create `./pages/api/imagegen.js`

```js
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