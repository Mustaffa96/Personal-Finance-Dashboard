import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Gundam 00 inspired blue colors
          50: '#e6f7ff',
          100: '#bae3ff',
          200: '#7cceff',
          300: '#36b9ff',
          400: '#00a6ff',  // Celestial Being blue
          500: '#0091ea',  // Exia blue
          600: '#0077cc',
          700: '#005db9',  // 00 Raiser blue
          800: '#004494',
          900: '#002e6e',
          950: '#001a45',
        },
        secondary: {
          // Gundam 00 inspired red colors
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336',  // Trans-Am red
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
          950: '#7f0000',
        },
        accent: {
          // Gundam 00 inspired green colors
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',  // GN particles green
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
          950: '#0d3010',
        },
        neutral: {
          // Gundam 00 inspired gray/white colors
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#121212',
        },
        // Argon Dashboard colors
        blueGray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        blue: {
          500: '#5e72e4',  // Argon primary blue
        },
        orange: {
          500: '#fb6340',  // Argon orange
        },
        green: {
          500: '#2dce89',  // Argon green
        },
        red: {
          500: '#f5365c',  // Argon red
        },
        yellow: {
          500: '#ffd600',  // Argon yellow
        },
      },
      backgroundImage: {
        'gundam-gradient': 'linear-gradient(to right bottom, #0091ea, #002e6e)',
        'trans-am-gradient': 'linear-gradient(to right bottom, #f44336, #7f0000)',
      },
      height: {
        '350-px': '350px',
      },
    },
  },
  plugins: [],
};

export default config;
