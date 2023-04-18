const autoBind = require('auto-bind')
class UserHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postUserHandler (request, h) {
    await this._validator.validateUserPayload(request.payload)
    const UserId = await this._service.addUser(request.payload)
    const response = h.response({
      status: 'success',
      message: 'User berhasil di tambahkan',
      data: {
        userId: UserId
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UserHandler
