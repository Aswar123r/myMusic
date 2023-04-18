const autoBind = require('auto-bind')

class ExportHandler {
  constructor (serviceRabbitMq, validator, servicePlaylist) {
    this._serviceRabbitMq = serviceRabbitMq
    this._validator = validator
    this._servicePlaylist = servicePlaylist

    autoBind(this)
  }

  async postExportPlaylistByIdHandler (request, h) {
    this._validator.validateExportPayload(request.payload)
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._servicePlaylist.validateOwnerPlaylist(credentialId, playlistId)
    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail
    }
    await this._serviceRabbitMq.sendMessage('export:playlistOpenMusic', JSON.stringify(message))
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportHandler
