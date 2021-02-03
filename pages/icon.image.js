export default function IconImage({title}) {
  return (
    <div>
      <h1>hellosnapshot {title}</h1>
    </div>
  )
}

export function getServerSideProps(context) {
  return {
    props: context.query
  }
}
