async function imageGenLoader(source) {
  const appendedLoader =
  `export function getServerSideProps(ctx) {
    return {props: ctx.query}
  }`
  if (source.indexOf('getServerSideProps') !== -1) {
    throw new Error('`getServerSideProps` are not available for image components!')
  }
  return source + '\n' + appendedLoader
}

module.exports = imageGenLoader
