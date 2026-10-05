// One Tailwind config for every page. Before this, each HTML file carried its own
// inline copy for the play CDN. After adding or changing Tailwind classes in any
// page, run from this folder:  npm install  (first time)  then  npm run build:css
// The output is assets/tailwind.css, which is committed and served as a static file.
const path = require('path');

module.exports = {
  // Pages that load assets/tailwind.css. Map.html has its own stylesheet and is left out
  // on purpose. Add a new page here if it uses Tailwind classes.
  content: ['index', 'Boutiques', 'About', 'Contact', 'Accessibility'].map(p => path.join(__dirname, '../..', p + '.html')),
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-container': '#3b3b3b',
        'surface-container-highest': '#e5e2de',
        'surface-container': '#F0ECE4',
        'secondary': '#5e5e5e',
        'on-background': '#1A1A18',
        'tertiary': '#3b3b3b',
        'outline': '#777777',
        'primary': '#000000',
        'on-surface-variant': '#474747',
        'surface-container-low': '#F4F4F4',
        'surface-container-high': '#EDE9E1',
        'on-surface': '#1A1A18',
        'background': '#F4F4F4',
        'outline-variant': '#c6c6c6',
        'surface-container-lowest': '#ffffff',
        'on-primary': '#e2e2e2',
        'surface': '#F4F4F4',
        'inverse-surface': '#31302e',
        'secondary-container': '#d4d4d4',
      },
      borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '9999px' },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
