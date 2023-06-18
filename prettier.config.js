module.exports = {
  plugins: [require('prettier-plugin-nativewind')],
  tailwindConfig: './tailwind.config.js',
  tailwindCustomFunctions: ['cva'],
  tailwindCustomTaggedTemplates: ['tw'],
  tailwindCustomProps: ['className', '^[a-z]+ClassName$'],
};
