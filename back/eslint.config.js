export default [
    {
      files: ["**/*.js"], // S'applique à tous les fichiers JS
      languageOptions: {
        ecmaVersion: 2020, // Version d'ECMAScript
        sourceType: "module", // Pour les modules ES
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
      },
    },
  ];