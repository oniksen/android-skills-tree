import type { ReactNode } from "react";

interface TierIconProps {
  tier: string | null;
  className?: string;
}

function SvgBase({
  className,
  tier,
  children,
}: {
  className?: string;
  tier: string | null;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      data-tier={tier ?? "unknown"}
    >
      {children}
    </svg>
  );
}

export default function TierIcon({ tier, className }: TierIconProps) {
  const sizeClass = className ?? "h-8 w-8";

  switch (tier) {
    case "Камень":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-stone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#44403c" />
            </linearGradient>
          </defs>
          <path
            d="M18 46 C14 38 16 24 24 18 C30 14 40 14 46 20 C52 26 52 40 46 48 C40 54 28 56 20 52 Z"
            fill="url(#tier-stone)"
          />
          <path
            d="M24 20 C28 18 34 18 38 22"
            stroke="#e7e5e4"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
            fill="none"
          />
          <path
            d="M26 30 L31 36 M34 24 L39 31 M29 43 L37 41"
            stroke="#292524"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.45"
            fill="none"
          />
        </SvgBase>
      );
    case "Агат":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <radialGradient id="tier-agate" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#tier-agate)" />
          <circle cx="32" cy="32" r="14" fill="#fde68a" opacity="0.25" />
        </SvgBase>
      );
    case "Оникс":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <radialGradient id="tier-onyx" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="24" fill="url(#tier-onyx)" />
          <circle cx="32" cy="32" r="14" fill="#94a3b8" opacity="0.15" />
        </SvgBase>
      );
    case "Опал":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-opal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <polygon
            points="32,6 40,24 58,32 40,40 32,58 24,40 6,32 24,24"
            fill="url(#tier-opal)"
          />
        </SvgBase>
      );
    case "Жемчуг":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <radialGradient id="tier-pearl" cx="0.4" cy="0.35" r="0.6">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="22" fill="url(#tier-pearl)" />
          <circle cx="24" cy="24" r="6" fill="#ffffff" opacity="0.6" />
        </SvgBase>
      );
    case "Бирюза":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-turquoise" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
          </defs>
          <path
            d="M32 6 C20 20 14 34 14 44 C14 54 22 60 32 60 C42 60 50 54 50 44 C50 34 44 20 32 6 Z"
            fill="url(#tier-turquoise)"
          />
        </SvgBase>
      );
    case "Гранат":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-garnet" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>
          <polygon points="32,6 52,20 52,44 32,58 12,44 12,20" fill="url(#tier-garnet)" />
          <polygon points="32,6 42,32 32,58 22,32" fill="#fecaca" opacity="0.2" />
        </SvgBase>
      );
    case "Аметист":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-amethyst" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>
          </defs>
          <polygon points="32,6 52,20 52,44 32,58 12,44 12,20" fill="url(#tier-amethyst)" />
          <polygon points="32,6 42,32 32,58 22,32" fill="#e9d5ff" opacity="0.2" />
        </SvgBase>
      );
    case "Топаз":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <radialGradient id="tier-topaz" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="16" fill="url(#tier-topaz)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 32 + Math.cos(rad) * 20;
            const y1 = 32 + Math.sin(rad) * 20;
            const x2 = 32 + Math.cos(rad) * 28;
            const y2 = 32 + Math.sin(rad) * 28;
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#facc15"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </SvgBase>
      );
    case "Аквамарин":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-aqua" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          <path
            d="M4 36 Q16 24 28 36 T52 36 T60 36"
            stroke="url(#tier-aqua)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M4 48 Q16 36 28 48 T52 48 T60 48"
            stroke="url(#tier-aqua)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </SvgBase>
      );
    case "Изумруд":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-emerald" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>
          <path
            d="M32 6 C44 6 52 18 50 34 C48 50 40 58 32 58 C24 58 16 50 14 34 C12 18 20 6 32 6 Z"
            fill="url(#tier-emerald)"
          />
          <path
            d="M32 14 C38 14 42 22 41 34 C40 46 36 52 32 52"
            stroke="#a7f3d0"
            strokeWidth="2"
            fill="none"
            opacity="0.4"
          />
        </SvgBase>
      );
    case "Рубин":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-ruby" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
          <path
            d="M32 56 C20 44 8 32 8 22 C8 14 14 8 22 8 C26 8 30 10 32 14 C34 10 38 8 42 8 C50 8 56 14 56 22 C56 32 44 44 32 56 Z"
            fill="url(#tier-ruby)"
          />
        </SvgBase>
      );
    case "Сапфир":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-sapphire" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <polygon points="32,4 54,20 54,44 32,60 10,44 10,20" fill="url(#tier-sapphire)" />
          <polygon points="32,4 43,32 32,60 21,32" fill="#bfdbfe" opacity="0.18" />
        </SvgBase>
      );
    case "Алмаз":
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-diamond" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cffafe" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
          <polygon points="32,4 54,20 54,44 32,60 10,44 10,20" fill="url(#tier-diamond)" />
          <polygon points="32,4 43,32 32,60 21,32" fill="#ffffff" opacity="0.35" />
        </SvgBase>
      );
    default:
      return (
        <SvgBase className={sizeClass} tier={tier}>
          <defs>
            <linearGradient id="tier-default" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <polygon points="32,6 54,24 46,54 18,54 10,24" fill="url(#tier-default)" />
        </SvgBase>
      );
  }
}
