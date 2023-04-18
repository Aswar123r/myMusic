const Jwt = require('@hapi/jwt')
const InvariantError = require('../services/exceptions/InvariantError')
const tokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  genereteRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid')
    }
  }
}
module.exports = tokenManager
