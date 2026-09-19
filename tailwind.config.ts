import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1913',
        ink2: '#16251E',
        paper: '#F3EEE2',
        paper2: '#E9E1CC',
        inktext: '#241F17',
        verified: '#229966',
        verifieddeep: '#176B47',
        brand: '#1C8FC2',
        branddeep: '#146690',
        alert: '#AD4430',
        line: 'rgba(36,31,23,.16)',
        linedark: 'rgba(243,238,226,.16)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
