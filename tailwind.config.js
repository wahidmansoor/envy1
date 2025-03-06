/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        background: {
          DEFAULT: 'var(--background-color)',
          card: 'var(--card-background)',
        },
        text: {
          DEFAULT: 'var(--text-color)',
          light: 'var(--text-light)',
          dark: 'var(--text-dark)',
        },
        accent: 'var(--accent-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        error: 'var(--error-color)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
      boxShadow: {
        DEFAULT: 'var(--box-shadow)',
        card: 'var(--card-shadow)',
      }
    },
  },
  plugins: [],
}
