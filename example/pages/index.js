import { useState } from 'react'
import styles from './index.module.css'

const getImagePath = (text) => `/icon.image?title=${encodeURIComponent(text)}`

export default function Index() {
  const [title, setTitle] = useState(`T'he Id'ea`)
  const [query, setQuery] = useState(getImagePath(title))
  return (
    <div className={styles.root}>
      <h1>Generate Image</h1>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={() => setQuery(getImagePath(title))}>Generate</button>
      </div>
      <img src={query} width={640} height={320} />
    </div>
  )
}
