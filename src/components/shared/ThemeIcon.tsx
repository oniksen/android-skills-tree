import type { ResolvedTheme } from "@/lib/theme";

interface ThemeIconProps {
  theme: ResolvedTheme;
  className?: string;
}

export default function ThemeIcon({ theme, className }: ThemeIconProps) {
  if (theme === "dark") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden
        focusable="false"
      >
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
      <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <path d="M12 2.5v2.2" />
        <path d="M12 19.3v2.2" />
        <path d="M2.5 12h2.2" />
        <path d="M19.3 12h2.2" />
        <path d="M5.2 5.2l1.6 1.6" />
        <path d="M17.2 17.2l1.6 1.6" />
        <path d="M18.8 5.2l-1.6 1.6" />
        <path d="M6.8 17.2l-1.6 1.6" />
      </g>
    </svg>
  );
}
