const autoBind = require('auto-bind')

class AuthenticationsHandler {
  constructor (serviceUser, serviceAuthentication, tokenManager, validator) {
    this._usersService = serviceUser
    this._serviceAuthentication = serviceAuthentication
    this._tokenManager = tokenManager
    this._validator = validator

    autoBind(this)
  }

  async postAuthenticationHandler (request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload)
    const { username, password } = request.payload
    const id = await this._usersService.verifyUserCredential(username, password)
    const accessToken = await this._tokenManager.generateAccessToken({ id })
    const refreshToken = await this._tokenManager.genereteRefreshToken({ id })
    await this._serviceAuthentication.addRefreshToken(refreshToken)
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(201)
    return response
  }

  async putAuthenticationHandler (request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload
    await this._serviceAuthentication.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
    const accessToken = this._tokenManager.generateAccessToken({ id })
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  async deleteAuthenticationHandler (request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload
    await this._serviceAuthentication.verifyRefreshToken(refreshToken)
    await this._serviceAuthentication.deleteRefreshToken(refreshToken)
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    }
  }
}

module.exports = AuthenticationsHandler
