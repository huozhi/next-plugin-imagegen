export default function Svg({ title = 'Make Web Faster' }) {
  return (
    <svg viewBox="0 0 1024 580" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="580" fill="white" />
      <rect x="142" y="182" width="739" height="140" fill="black" />

      <text fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="30"
        fontWeight="bold" letterSpacing="0em">
        <tspan x="94" y="82.7539">rauchg.com</tspan>
      </text>
      <text fill="#fff" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="62"
        fontWeight="bold" letterSpacing="0em">
        <tspan x="278.41" y="265.691">{title}</tspan>
      </text>

      <rect x="51" y="58" width="30" height="30" fill="black" />
    </svg>
  )
}
