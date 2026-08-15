/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base palette
        ivory: {
          50: '#FBFAF7',
          100: '#F6F4EF',
          200: '#EDEAE2',
        },
        cool: {
          50: '#F4F6F8',
          100: '#E8ECF1',
          200: '#D1D9E2',
          300: '#AEB8C6',
        },
        bluegrey: {
          400: '#7C8BA0',
          500: '#5B6B82',
          600: '#44526A',
        },
        // Dark anchors
        navy: {
          700: '#1E293B',
          800: '#172033',
          900: '#0F1626',
        },
        charcoal: {
          700: '#33373F',
          800: '#25292F',
          900: '#1A1D22',
        },
        // Accents
        brand: {
          50: '#EEF4FB',
          100: '#D6E4F5',
          200: '#AECBED',
          300: '#7DA8DE',
          400: '#4F84C9',
          500: '#2E63AE',
          600: '#234E8C',
          700: '#1C3E70',
        },
        teal: {
          400: '#3FB8AF',
          500: '#2B9D94',
          600: '#1F7C74',
        },
        indigo: {
          400: '#6B7AB8',
          500: '#4F5E9E',
          600: '#3D4A7C',
        },
        wine: {
          500: '#6E2A3E',
          600: '#5A2233',
        },
        strawberry: {
          500: '#B23A55',
          600: '#962F47',
        },
        // Feedback
        success: {
          50: '#ECF7EE',
          100: '#D4EDDA',
          500: '#2E8B57',
          600: '#247148',
          700: '#1D5A3A',
        },
        warning: {
          50: '#FBF3E4',
          100: '#F5E2C0',
          500: '#C99A2E',
          600: '#A8802A',
        },
        error: {
          50: '#FBECEE',
          100: '#F5D3D9',
          500: '#B23A55',
          600: '#962F47',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,22,38,0.06), 0 4px 16px rgba(15,22,38,0.06)',
        'card-hover': '0 2px 6px rgba(15,22,38,0.08), 0 12px 32px rgba(15,22,38,0.10)',
        'soft': '0 1px 2px rgba(15,22,38,0.04)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'confetti-fall': 'confettiFall 3s ease-in forwards',
        'petal-fall': 'petalFall 4s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confettiFall: {
          '0%': { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateY(100vh) rotate(720deg)' },
        },
        petalFall: {
          '0%': { opacity: '1', transform: 'translateY(0) rotate(0deg) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(110vh) rotate(540deg) scale(0.7)' },
        },
      },
    },
  },
  plugins: [],
};
