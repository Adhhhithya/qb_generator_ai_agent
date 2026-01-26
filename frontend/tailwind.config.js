/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Education Brand - Professional Blue (Trust & Intelligence)
        brand: {
          primary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6', // Primary Blue
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A'
          },
          // Success & Growth - Emerald Green
          success: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            500: '#10B981',
            600: '#059669',
            700: '#047857'
          },
          // Warning & Attention - Amber
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309'
          },
          // Error & Critical - Red
          error: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C'
          },
          // Analytics & Data - Purple
          analytics: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            500: '#A855F7',
            600: '#9333EA',
            700: '#7E22CE'
          },
          // Highlight & Featured - Cyan
          highlight: {
            50: '#ECFEFF',
            100: '#CFFAFE',
            500: '#06B6D4',
            600: '#0891B2',
            700: '#0E7490'
          }
        },
        // Legacy support - map to new brand colors
        soft: {
          orange: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706' },
          green: { 50: '#ECFDF5', 100: '#D1FAE5', 500: '#10B981', 600: '#059669' },
          purple: { 50: '#FAF5FF', 100: '#F3E8FF', 500: '#A855F7', 600: '#9333EA' },
          blue: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#3B82F6', 600: '#2563EB' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}