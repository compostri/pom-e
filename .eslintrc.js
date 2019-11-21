module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', './']],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  }
}
