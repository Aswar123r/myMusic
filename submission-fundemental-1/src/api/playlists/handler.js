const autoBind = require('auto-bind')

class PlaylistHandler {
  constructor (servicePlaylist, validator, serviceCollaboration) {
    this._servicePlaylist = servicePlaylist
    this._validator = validator
    this._serviceCollaboration = serviceCollaboration

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    await this._validator.validatePostPlaylistpayload(request.payload)
    const { id } = request.auth.credentials
    const { name } = request.payload
    const playlist = await this._servicePlaylist.addPlaylist({ name, owner: id })
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: playlist
      }
    })
    response.code(201)
    return response
  }

  async postPlaylistIdSongHandler (request, h) {
    this._validator.validatePostSongPayload(request.payload)
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const { songId } = request.payload
    const validateCollabotaion = await this._serviceCollaboration.validateCollaboration(credentialId, id)
    if (!validateCollabotaion) await this._servicePlaylist.validateOwnerPlaylist(credentialId, id)
    await this._servicePlaylist.verifySongInDatabase(songId)
    await this._servicePlaylist.addSongToPlaylist(id, songId)
    await this._servicePlaylist.addActivitiePlaylist(id, songId, credentialId, 'add')
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil di tambahkan ke plalist'
    })
    response.code(201)
    return response
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._servicePlaylist.validateOwnerPlaylist(credentialId, id)
    await this._servicePlaylist.deletePlaylistById(id)
    return {
      status: 'success',
      message: 'Playlist berhasil di hapus'
    }
  }

  async deleteSongByIdInPlaylistIdHandler (request, h) {
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials
    const validateCollabotaion = await this._serviceCollaboration.validateCollaboration(credentialId, id)
    if (!validateCollabotaion) await this._servicePlaylist.validateOwnerPlaylist(credentialId, id)
    await this._servicePlaylist.deleteSongFromPlaylist(id, songId)
    await this._servicePlaylist.addActivitiePlaylist(id, songId, credentialId, 'delete')
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    }
  }

  async getPlaylistHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const plalist = await this._servicePlaylist.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists: plalist
      }
    }
  }

  async getSongByPlaylistIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const validateCollabotaion = await this._serviceCollaboration.validateCollaboration(credentialId, id)
    if (!validateCollabotaion) await this._servicePlaylist.validateOwnerPlaylist(credentialId, id)
    const Playlists = await this._servicePlaylist.getSongsFromPlaylist(id)
    return {
      status: 'success',
      data: {
        playlist: Playlists
      }
    }
  }

  async getActivitieByPlaylistIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const validateCollabotaion = await this._serviceCollaboration.validateCollaboration(credentialId, id)
    if (!validateCollabotaion) await this._servicePlaylist.validateOwnerPlaylist(credentialId, id)
    const Playlists = await this._servicePlaylist.getActivitiePlaylist(id)
    return {
      status: 'success',
      data: {
        playlistId: id,
        activities: Playlists
      }
    }
  }
}

module.exports = PlaylistHandler
