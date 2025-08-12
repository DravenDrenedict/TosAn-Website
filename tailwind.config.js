module.exports = {
  content: [
    './html/**/*.html',
    './js/**/*.js',
    './src/**/*.css',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
// npx tailwindcss -i ./src/input.css -o ./src/output.css --watch