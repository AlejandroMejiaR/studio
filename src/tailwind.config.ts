
import type {Config} from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', ...fontFamily.sans],
        headline: ['"Space Grotesk"', ...fontFamily.sans],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'footer-bg': 'hsl(var(--footer-background))',
        'footer-fg': 'hsl(var(--footer-foreground))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'accent-glow': '0 10px 15px -3px hsl(var(--accent) / 0.5), 0 4px 6px -4px hsl(var(--accent) / 0.5)',
        'accent-glow-lg': '0 0 24px 2px hsl(var(--accent) / 0.5)',
        'white-glow': '0 10px 15px -3px rgba(255, 255, 255, 0.07), 0 4px 6px -4px rgba(255, 255, 255, 0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'slideInLeftWithTerminalBounce': { 
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '70%': { opacity: '1', transform: 'translateX(10px)' },
          '85%': { transform: 'translateX(-5px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'letter-reveal-from-below': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '60%': { opacity: '1', transform: 'translateY(-5px)' }, 
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'fadeIn': { // Added fadeIn keyframes
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'controls-fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'blink-cursor': 'blink-cursor 0.7s step-end infinite',
        'slideInLeftWithTerminalBounce': 'slideInLeftWithTerminalBounce 1s ease-out forwards',
        'letter-reveal': 'letter-reveal-from-below 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-out forwards', // Added fadeIn animation
        'controls-fade-in': 'controls-fade-in 1s ease-out forwards',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('@tailwindcss/typography')],
} satisfies Config;
