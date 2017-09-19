module.exports = {
  presets: [
    [
      'env',
      {
        loose: true,
        modules: process.env.BABEL_ENV === 'cjs' ? 'commonjs' : false,
        forceAllTransforms: process.env.NODE_ENV === 'production',
      },
    ],
    'react',
    'stage-2',
  ],
  plugins: ['annotate-pure-calls'],
}
