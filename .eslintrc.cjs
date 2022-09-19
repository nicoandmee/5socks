require('@rushstack/eslint-config/patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@rushstack/eslint-config/profile/node',
    '@rushstack/eslint-config/mixins/friendly-locals',
    '@nodesuite/eslint-config'
  ],
  overrides: [
    {
      files: ['src/**/*.ts'],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      rules: {
        // To disable rules you don't like...
        '@typescript-eslint/typedef': 'off',
        'no-return-await': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      }
    },
  ]
}
