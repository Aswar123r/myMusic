const autoBind = require('auto-bind')
class CollaborationHandler {
  constructor (serviceCollaboration, validator, servicePlaylist, serviceUser) {
    this._serviceCollaboration = serviceCollaboration
    this._validator = validator
    this._servicePlaylist = servicePlaylist
    this._serviceUser = serviceUser

    autoBind(this)
  }

  async postCollaboration (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload
    await this._serviceUser.validateUser(userId)
    await this._servicePlaylist.validateOwnerPlaylist(credentialId, playlistId)
    const collaborationsId = await this._serviceCollaboration.addCollaboration(playlistId, userId)
    const response = h.response({
      status: 'success',
      message: 'Menambahkan collaborations',
      data: {
        collaborationId: collaborationsId
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaboration (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload
    await this._serviceUser.validateUser(userId)
    await this._servicePlaylist.validateOwnerPlaylist(credentialId, playlistId)
    await this._serviceCollaboration.deleteCollaboration(playlistId, userId)
    return {
      status: 'success',
      message: 'Berhasil Menghapus Collaboration'
    }
  }
}
module.exports = CollaborationHandler
