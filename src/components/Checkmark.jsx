/** Large faceted green checkmark (recreated in SVG from UI reference 2). */
export default function Checkmark({ className = '' }) {
  const pts = '6,46 22,30 40,48 82,6 98,22 40,80';
  return (
    <svg className={`check ${className}`} viewBox="0 0 104 86" role="img" aria-label="Verified">
      <defs>
        <linearGradient id="chk-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8af0ae" />
          <stop offset="0.55" stopColor="#5fd68b" />
          <stop offset="1" stopColor="#2f8f55" />
        </linearGradient>
        <clipPath id="chk-c">
          <polygon points={pts} />
        </clipPath>
      </defs>
      <polygon points={pts} fill="url(#chk-g)" />
      <g clipPath="url(#chk-c)" className="check-facets">
        <polygon points="6,46 22,30 30,52" fill="#fff" opacity=".14" />
        <polygon points="22,30 40,48 30,52" fill="#000" opacity=".08" />
        <polygon points="30,52 40,48 40,80" fill="#fff" opacity=".07" />
        <polygon points="40,48 60,28 56,62" fill="#fff" opacity=".12" />
        <polygon points="60,28 82,6 72,40" fill="#000" opacity=".07" />
        <polygon points="82,6 98,22 72,40" fill="#fff" opacity=".16" />
        <polygon points="56,62 72,40 98,22 40,80" fill="#000" opacity=".1" />
      </g>
      <polygon points={pts} fill="none" stroke="#c9ffd9" strokeOpacity=".55" strokeWidth="1.2" />
    </svg>
  );
}
