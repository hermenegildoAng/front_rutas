/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Esto hace que 'sans' sea Inter por defecto en todo el sitio
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Creamos una paleta de morados personalizada para el gobierno/sistema
        brand: {
          light: '#f3e8ff', // Morado muy bajito para fondos o alertas
          DEFAULT: '#6b21a8', // El morado principal (puedes cambiar este HEX si tienes uno específico)
          dark: '#572671', // Morado oscuro para botones activos o texto fuerte
        },
      },
    },
  },
  plugins: [],
}
