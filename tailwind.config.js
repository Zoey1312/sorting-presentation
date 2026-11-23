/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        bento: {
          DEFAULT: '#161617',
          hover: '#1D1D1F',
          code: '#0D0D0F',
        },
        apple: {
          text: '#F5F5F7',
          secondary: '#A1A1A6',
          muted: '#86868B',
          blue: '#2997FF',
          sky: '#5AC8FA',
          mint: '#30D158',
          cyan: '#64D2FF',
          purple: '#BF5AF2',
          indigo: '#5E5CE6',
          amber: '#FF9F0A',
          gold: '#FFD60A',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Inter"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
