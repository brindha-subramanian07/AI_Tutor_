/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Soft Playful Blue Educational Theme Palette
        eduBlue: {
          primary: '#2563EB',         // Primary blue
          primaryHover: '#1D4ED8',    // Darker blue for hover
          soft: '#60A5FA',            // Soft blue
          light: '#DBEAFE',           // Light blue
          veryLight: '#EFF6FF',       // Very light blue
          cyan: '#38BDF8',            // Accent cyan
          text: '#172554',            // Deep navy text
          textMuted: '#475569',       // Slate muted text
          border: '#DBEAFE',          // Subtle blue border
          white: '#FFFFFF',
          // Dark Mode Palette
          darkBg: '#071426',          // Deep navy background
          darkSecondary: '#0B1F3A',   // Secondary dark navy background
          darkCard: '#102A4C',        // Dark card background
          darkPrimary: '#3B82F6',     // Primary blue (dark)
          darkBright: '#60A5FA',      // Bright blue
          darkCyan: '#22D3EE',        // Cyan accent (dark)
          darkSoft: '#93C5FD',        // Soft blue (dark)
          darkText: '#F0F9FF',        // Light text (dark)
          darkTextMuted: '#94A3B8',   // Secondary text (dark)
          darkBorder: '#1E3A5F',      // Subtle dark border
        },
        // Aliases for seamless backward compatibility with existing component classes
        snow: {
          bg: '#F0F6FF',              // Very soft blue canvas
          surface: '#EFF6FF',         // Soft blue separation
          card: '#FFFFFF',            // Card background
          cardHover: '#F8FAFC',
          border: '#DBEAFE',          // Subtle blue border
          borderLight: '#EFF6FF',
          borderDark: '#BFDBFE',
        },
        lavender: {
          primary: '#2563EB',         // Replaced with Primary Blue
          primaryHover: '#1D4ED8',
          primaryLight: '#EFF6FF',    // Replaced with Very Light Blue
          primaryDark: '#1E40AF',
          secondary: '#60A5FA',       // Replaced with Soft Blue
          secondaryLight: '#DBEAFE',
          accent: '#38BDF8',          // Replaced with Accent Cyan
          deep: '#172554',
          plum: '#172554',            // Deep Navy Text (Primary)
          slate: '#475569',           // Slate Blue Text (Secondary)
          slateLight: '#94A3B8',
          mint: '#10B981',            // Fresh Mint (Success)
          mintLight: '#ECFDF5',
          amber: '#F59E0B',           // Honey Amber (Warning)
          amberLight: '#FFFBEB',
          rose: '#EF4444',            // Soft Red (Error)
          roseLight: '#FEF2F2',
          ice: '#0284C7',             // Deep Ice Blue
          iceLight: '#F0F9FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'snow-sm': '0 1px 3px rgba(37, 99, 235, 0.05), 0 1px 2px rgba(23, 37, 84, 0.03)',
        'snow-md': '0 4px 16px rgba(37, 99, 235, 0.08), 0 2px 6px rgba(23, 37, 84, 0.04)',
        'snow-lg': '0 10px 28px rgba(37, 99, 235, 0.10), 0 4px 12px rgba(23, 37, 84, 0.05)',
        'snow-xl': '0 20px 40px rgba(37, 99, 235, 0.12), 0 8px 16px rgba(23, 37, 84, 0.06)',
        'blue-sm': '0 1px 3px rgba(37, 99, 235, 0.08), 0 1px 2px rgba(23, 37, 84, 0.04)',
        'blue-md': '0 4px 16px rgba(37, 99, 235, 0.10), 0 2px 6px rgba(23, 37, 84, 0.05)',
        'blue-lg': '0 10px 28px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(23, 37, 84, 0.06)',
        'blue-xl': '0 20px 40px rgba(37, 99, 235, 0.15), 0 8px 16px rgba(23, 37, 84, 0.07)',
        'warm-sm': '0 1px 3px rgba(37, 99, 235, 0.05), 0 1px 2px rgba(23, 37, 84, 0.03)',
        'warm-md': '0 4px 16px rgba(37, 99, 235, 0.08), 0 2px 6px rgba(23, 37, 84, 0.04)',
        'warm-lg': '0 10px 28px rgba(37, 99, 235, 0.10), 0 4px 12px rgba(23, 37, 84, 0.05)',
        'warm-xl': '0 20px 40px rgba(37, 99, 235, 0.12), 0 8px 16px rgba(23, 37, 84, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
