import styles from './icon.image.module.css'

export default function IconImage({title}) {
  return (
    <div className={styles.root}>
      <h1>Imagegen</h1>
      <h2>{title}</h2>
    </div>
  )
}

