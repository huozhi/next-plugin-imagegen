async function imageGenLoader(source) {
  const appendedLoader =
  `export function getServerSideProps(context) {
    return {props: context.query}
  }`
  if (source.indexOf('getServerSideProps') !== -1) {
    throw new Error('should remove getServerSideProps')
  }
  return source + '\n' + appendedLoader
}

module.exports = imageGenLoader
