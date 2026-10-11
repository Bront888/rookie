import { getCategory, type Pattern } from "@/lib/products";

// A tasteful stand-in for product photography: a tinted glass tile with a
// simple motif per product type. If a product has a real `image`, that wins.

type Props = {
  category: string;
  tones?: [string, string];
  image?: string;
  alt: string;
  tint?: string; // optional colour swatch override (selected colour)
  className?: string;
};

function Motif({ pattern }: { pattern: Pattern }) {
  const soft = "rgba(255,255,255,0.55)";
  const faint = "rgba(255,255,255,0.28)";
  switch (pattern) {
    case "pillow":
      return (
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <rect x="22" y="58" width="112" height="84" rx="30" fill={faint} transform="rotate(-8 78 100)" />
          <rect x="62" y="56" width="116" height="88" rx="32" fill={soft} transform="rotate(5 120 100)" />
          <path d="M84 100 Q120 90 156 100" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
        </svg>
      );
    case "towel":
      return (
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <rect x="36" y="118" width="128" height="28" rx="10" fill={faint} />
          <rect x="42" y="90" width="116" height="28" rx="10" fill={soft} />
          <rect x="50" y="62" width="100" height="28" rx="10" fill="rgba(255,255,255,0.7)" />
          <rect x="62" y="70" width="76" height="3" rx="1.5" fill="rgba(0,0,0,0.08)" />
        </svg>
      );
    case "robe":
      return (
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <path d="M78 44 L100 70 L122 44 L158 60 L170 150 L132 156 L128 108 L128 164 L72 164 L72 108 L68 156 L30 150 L42 60 Z" fill={soft} />
          <path d="M78 44 L100 92 L122 44" stroke="rgba(255,255,255,0.8)" strokeWidth="3" fill="none" />
          <rect x="72" y="112" width="56" height="7" rx="3.5" fill="rgba(0,0,0,0.12)" />
        </svg>
      );
    case "flowers":
      return (
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none">
            <path d="M100 176 L100 100" />
            <path d="M100 176 L66 112" />
            <path d="M100 176 L136 118" />
          </g>
          {[[100, 84, 22], [64, 98, 17], [138, 104, 18]].map(([cx, cy, r]) => (
            <g key={`${cx}-${cy}`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle
                  key={deg}
                  cx={cx + Math.cos((deg * Math.PI) / 180) * r * 0.6}
                  cy={cy + Math.sin((deg * Math.PI) / 180) * r * 0.6}
                  r={r * 0.55}
                  fill={soft}
                />
              ))}
              <circle cx={cx} cy={cy} r={r * 0.3} fill="rgba(255,255,255,0.9)" />
            </g>
          ))}
        </svg>
      );
    case "books":
      return (
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {[
            [40, 70, 20, 90, 0.45],
            [62, 60, 22, 100, 0.65],
            [86, 78, 18, 82, 0.4],
            [106, 66, 24, 94, 0.6],
            [132, 74, 20, 86, 0.5],
          ].map(([x, y, w, h, o]) => (
            <g key={x}>
              <rect x={x} y={y} width={w} height={h} rx="3" fill={`rgba(255,255,255,${o})`} />
              <rect x={x + 3} y={y + 12} width={w - 6} height="2.5" rx="1" fill="rgba(0,0,0,0.12)" />
              <rect x={x + 3} y={y + 18} width={w - 6} height="2.5" rx="1" fill="rgba(0,0,0,0.08)" />
            </g>
          ))}
        </svg>
      );
    default:
      return null; // CSS-only patterns (quilt, fur, ribs, folds, sheet)
  }
}

export default function ProductVisual({ category, tones, image, alt, tint, className = "" }: Props) {
  const cat = getCategory(category);
  const [a, b] = tones ?? cat?.tones ?? ["#eee", "#ccc"];
  const pattern: Pattern = cat?.pattern ?? "sheet";

  if (image) {
    return (
      <div className={`visual ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt} className="visual-img" />
      </div>
    );
  }

  return (
    <div
      className={`visual pat-${pattern} ${className}`}
      style={{ "--tone-a": tint ?? a, "--tone-b": b } as React.CSSProperties}
      role="img"
      aria-label={alt}
    >
      <Motif pattern={pattern} />
      <span className="visual-sheen" aria-hidden="true" />
    </div>
  );
}
