/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1E2A32',
          light: '#263540',
          lighter: '#2E4050',
          900: '#162028',
        },
        orange: {
          DEFAULT: '#D4632C',
          light: '#E07A4F',
          dark: '#B85328',
          glow: '#FEF5F0',
        },
        surface: {
          DEFAULT: '#EDF2F7',
          100: '#E2E8F0',
          200: '#CBD5E0',
        },
        gray: {
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#6B7280',
        },
        success: '#22C55E',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        narrow: '980px',
        wide: '1120px',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(28, 28, 30, 0.06)',
        md: '0 4px 16px rgba(28, 28, 30, 0.08)',
        lg: '0 8px 32px rgba(28, 28, 30, 0.12)',
        'orange-glow': '0 0 24px rgba(212, 99, 44, 0.12)',
        'orange-glow-lg': '0 0 48px rgba(212, 99, 44, 0.20)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
