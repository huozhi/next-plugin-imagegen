export default function LogoImage({title} : {title: string}) {
  return (
    <div style={{width: '100vw', height: `100vh`, background: '#000', color: '#fff', fontWeight: 'bolder'}}>
      Logo {title}
    </div>
  )
}

