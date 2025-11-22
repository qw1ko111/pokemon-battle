/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'attack-tackle-right': 'tackle-right 0.5s ease-in-out',
        'attack-tackle-left': 'tackle-left 0.5s ease-in-out',
        'attack-beam-right': 'beam-right 1s ease-out',
        'attack-beam-left': 'beam-left 1s ease-out',
        'flash': 'flash 0.2s ease-in-out 3',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        'tackle-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(60px)' }
        },
        'tackle-left': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-60px)' }
        },
        'beam-right': {
          '0%': { transform: 'translateX(0) scaleX(0)', opacity: 0 },
          '50%': { transform: 'translateX(30px) scaleX(1)', opacity: 1 },
          '100%': { transform: 'translateX(100px) scaleX(2)', opacity: 0 }
        },
        'beam-left': {
          '0%': { transform: 'translateX(0) scaleX(0)', opacity: 0 },
          '50%': { transform: 'translateX(-30px) scaleX(1)', opacity: 1 },
          '100%': { transform: 'translateX(-100px) scaleX(2)', opacity: 0 }
        },
        flash: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}
