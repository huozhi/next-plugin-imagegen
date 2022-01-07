# SVG Imagegen

```sh
yarn add next-plugin-imagegen-svg
```

```js
// next.config.js
const withImageGen = require('next-plugin-imagegen-svg/plugin')

module.exports = withImageGen()
```

Place your SVG react components under `./pages/api` folder with `.og.image.js` extension, like `./pages/api/card.og.image.js`

```jsx
export default function Card() {
  return <svg>...</svg>
}
```

Then its route could be directly converted to png image response when you access. e.g. `/api/card.og.image` will return the image response of the SVG component render result.

