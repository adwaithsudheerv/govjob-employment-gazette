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
        gazette: {
          paper: '#fbf9f5',
          card: '#ffffff',
          dark: '#f0ece1',
          ink: '#1c1f33',
          inkLight: '#383e5c',
          inkMuted: '#686f8a',
          border: '#1c1f33',
          borderLight: '#dcd7c7',
          crimson: '#991b1b',
          crimsonBg: '#fef2f2',
          forest: '#065f46',
          forestBg: '#ecfdf5',
          navy: '#1e3a8a',
          navyBg: '#eff6ff',
          amber: '#92400e',
          amberBg: '#fffbeb',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald primary
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        obsidian: {
          800: '#111b2e',
          850: '#0e1726',
          900: '#0a101d',
          950: '#060a13',
        },
        accent: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        title: ['"Playfair Display"', 'Georgia', 'serif'],
        sc: ['"Playfair Display SC"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gazette-stamp': '0 0 0 1px #1c1f33, 3px 3px 0 0 #1c1f33',
        'gazette-card': '0 2px 0 0 #1c1f33, 4px 6px 0 0 rgba(28, 31, 51, 0.12)',
        'gazette-card-hover': '0 2px 0 0 #1c1f33, 6px 10px 0 0 rgba(28, 31, 51, 0.22)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
      }
    },
  },
  plugins: [],
}
