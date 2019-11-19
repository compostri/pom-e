module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier', 'prettier/react'],
  settings: {
    'import/resolver': {
      alias: [['~', './']]
    }
  }
}
