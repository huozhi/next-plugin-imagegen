import styles from './icon.image.module.css'

export default function IconImage({title}) {
  return (
    <div className={styles.root}>
      <h1 style={{margin: 0}}>Imagegen {title}</h1>
    </div>
  )
}

