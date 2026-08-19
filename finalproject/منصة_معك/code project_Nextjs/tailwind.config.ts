import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F1E36',
          navyLight: '#1B2E4B',
          teal: '#028090',
          tealLight: '#E0F2F1',
          coral: '#F26440',
          coralLight: '#FDEEE9',
          purple: '#584B9B',
          purpleLight: '#EDEBF7',
          amber: '#EAA812',
          amberLight: '#FEF6E7',
          green: '#2E8B57',
          greenLight: '#EAF6EE',
        },
      },
    },
  },
  plugins: [],
};
export default config;
