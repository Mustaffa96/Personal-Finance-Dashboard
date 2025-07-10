module.exports = {
  root: true,
  // Specify that we're working with a monorepo structure
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    // Point to the specific tsconfig for each project
    project: ['./client/tsconfig.json', './server/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  // Global settings
  settings: {
    next: {
      rootDir: 'client',
    },
  },
  // Ignore build artifacts
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/.next/**'],
  rules: {
    // Common rules for all projects
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  // Specific overrides for different directories
  overrides: [
    {
      files: ['client/**/*.ts', 'client/**/*.tsx'],
      extends: ['next/core-web-vitals'],
      rules: {
        // Client-specific rules
      }
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        // Server-specific rules
      }
    }
  ]
};
