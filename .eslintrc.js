module.exports = {
  root: true,
  env: {
      node: true,
      es6: true, // Agrega esta línea para habilitar todas las características de ES6, incluyendo Promise.
      browser: true, // Esto te permitirá usar APIs del navegador, como localStorage.
  },
  extends: [
      'plugin:react/recommended',
      'eslint:recommended',
  ],
  parserOptions: {
      ecmaVersion: 2021, // Asegúrate de usar una versión reciente de ECMAScript.
      sourceType: 'module', // Esto permite el uso de import/export.
  },
  rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  }
};

