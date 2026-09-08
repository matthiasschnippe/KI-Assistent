/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* KERN-orientierte Farbpalette. Alle Textfarben auf weiss >= 4,5:1,
           alle Bedienelement-Konturen >= 3:1. */
        primary: {
          50: '#EDF3FA',
          100: '#D7E4F4',
          200: '#B0C9E8',
          600: '#0B4B8C', // 7,3:1 auf weiss
          700: '#083A6E',
          800: '#062C53',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F7F8F9',
          100: '#EFF1F2',
          200: '#DDE1E4',
          300: '#C2C8CD',
          400: '#9AA1A7',
          500: '#6B7176', // 4,6:1 auf weiss - Platzhaltertext
          600: '#565C61',
          700: '#3A4045',
          800: '#26292C',
          900: '#15181A',
        },
        success: { 50: '#E9F5EE', 200: '#A9D5BA', 700: '#0E6B3D', 800: '#0A5330' },
        warning: { 50: '#FCF3E4', 200: '#EAD4A4', 700: '#7A4B00', 800: '#5C3800' },
        danger: { 50: '#FCEDEC', 200: '#EFB8B4', 700: '#A81F17', 800: '#82150F' },
      },
      fontFamily: {
        sans: [
          'BundesSans',
          'Segoe UI',
          'Frutiger',
          'Helvetica Neue',
          'Arial',
          'system-ui',
          'sans-serif',
        ],
        mono: ['Consolas', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.25rem' }], // 13px - nur Metadaten
        sm: ['0.875rem', { lineHeight: '1.375rem' }], // 14px
        base: ['1rem', { lineHeight: '1.625rem' }], // 16px Fliesstext
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.125rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
      },
      borderRadius: { DEFAULT: '2px', md: '3px', lg: '4px' },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
};
