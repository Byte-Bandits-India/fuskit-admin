/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'bg-page':    '#F7F3EE',
        'bg-sidebar': '#2C1A0E',
        'bg-sidebar2':'#3B2010',
        'bg-card':    '#FFFFFF',
        'bg-card2':   '#FBF7F3',
        'bg-hover-sb':'#4A2C16',
        'bg-hover':   '#F3EDE6',
        orange: {
          DEFAULT: '#D4722A',
          dim:     '#B85E1F',
          light:   'rgba(212,114,42,0.10)',
          bg:      'rgba(212,114,42,0.06)',
        },
        brown: {
          DEFAULT: '#2C1A0E',
          mid:     '#6B3F1E',
        },
        'text-primary':   '#1C0F05',
        'text-secondary': '#6B4A2E',
        'text-muted':     '#A07850',
        'text-sidebar':   '#F0D9C0',
        success: {
          DEFAULT: '#2D8653',
          bg:      'rgba(45,134,83,0.10)',
        },
        danger: {
          DEFAULT: '#C94040',
          bg:      'rgba(201,64,64,0.10)',
        },
        info: {
          DEFAULT: '#2D72B8',
          bg:      'rgba(45,114,184,0.10)',
        },
        accent: {
          DEFAULT: '#7C4DB8',
          bg:      'rgba(124,77,184,0.10)',
        },
      },
      borderColor: {
        DEFAULT: 'rgba(44,26,14,0.08)',
        strong:  'rgba(44,26,14,0.15)',
        sb:      'rgba(240,217,192,0.1)',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(44,26,14,0.08), 0 1px 2px rgba(44,26,14,0.04)',
        md: '0 4px 12px rgba(44,26,14,0.10), 0 2px 4px rgba(44,26,14,0.06)',
      },
      keyframes: {
        barUp: {
          from: { transform: 'scaleY(0)', opacity: '0' },
          to:   { transform: 'scaleY(1)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bar-up':  'barUp 0.55s cubic-bezier(.34,1.4,.64,1) forwards',
        'fade-up': 'fadeUp 0.7s ease forwards',
      },
    },
  },
  plugins: [],
}
