const nextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')
const withOffline = require('next-offline')

dotenvLoad()

const withNextEnv = nextEnv()

module.exports = withNextEnv(
  withOffline({
    // Your Next.js config.
  })
)
