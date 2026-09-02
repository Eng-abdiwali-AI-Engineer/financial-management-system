/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { brand: { 50:'#eef6ff',100:'#d9eaff',500:'#1565d8',600:'#0b5ed7',700:'#084db4',900:'#0b1f4b' } },
    boxShadow: { soft:'0 8px 30px rgba(15,31,70,.07)', card:'0 2px 14px rgba(15,31,70,.06)' },
    borderRadius: { xl2:'1rem' }
  } },
  plugins: []
};
