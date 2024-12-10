module.exports = {
    preset: 'ts-jest', // Utilise ts-jest pour transformer les fichiers TypeScript
    testEnvironment: 'jsdom', // Utilise jsdom pour simuler un environnement navigateur
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transforme les fichiers TypeScript
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensions supportées
    moduleNameMapper: {
      '\\.(css|scss|sass)$': 'identity-obj-proxy', // Ignore les fichiers CSS dans les tests
    },
    transformIgnorePatterns: [
      'node_modules/(?!(some-esm-module|other-esm-module)/)', // Ajoutez ici des modules spécifiques si nécessaires
    ],
  };
  