import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — Sistema editorial GTC (Sep 2026)
        navy: {
          DEFAULT: '#062E55',
          soft: '#0a2444',
          deep: '#041E3A',
        },
        gold: '#F59E0B',
        'gold-deep': '#C98A2B',
        coral: {
          DEFAULT: '#FF5A39',
          hover: '#E8482A',
        },
        'blue-prime': '#2280AD',
        'blue-deep': '#1a6590',
        'blue-light': '#4AADDB',
        cream: {
          DEFAULT: '#F6F3EC',
          2: '#EFEAE0',
        },
        'off-white': '#F7F7F7',
        ink: {
          DEFAULT: '#0E2A47',
          soft: '#48596D',
        },
        sand: '#8A948F',
        'dark-gray': '#37516b',
        'border-soft': '#d9e2ec',
        // shadcn/ui semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        headline: ['Montserrat', 'sans-serif'],
        subtitle: ['Poppins', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-in': 'fade-in 0.6s ease forwards',
        'slide-in-left': 'slide-in-left 0.6s ease forwards',
        'slide-in-right': 'slide-in-right 0.6s ease forwards',
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config
