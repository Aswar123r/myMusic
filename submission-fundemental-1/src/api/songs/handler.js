const autoBind = require('auto-bind')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postSongHandler (request, h) {
    this._validator.validateSongPayload(request.payload)
    const songId = await this._service.addSong(request.payload)
    const response = h.response({
      status: 'success',
      message: 'Menambahkan lagu',
      data: {
        songId
      }
    })
    response.code(201)
    return response
  }

  async getAllSongHandler (request, h) {
    const { title, performer } = request.query
    let allSongs
    if (!title & !performer) {
      allSongs = await this._service.getAllSong()
    } else if (title && performer === undefined) {
      allSongs = await this._service.getAllSongByTitle(title)
    } else if (title === undefined && performer) {
      allSongs = await this._service.getAllSongByPerformer(performer)
    } else if (title && performer) {
      allSongs = await this._service.getAllSongByTitleAndPerformer(title, performer)
    }
    return {
      status: 'success',
      message: 'detail lagu',
      data: {
        songs: allSongs
      }
    }
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)
    const response = h.response({
      status: 'success',
      data: {
        song: song.data
      }
    })
    if (song.source === 'cache') {
      response.header('X-Data-Source', 'cache')
    }
    response.code(200)
    return response
  }

  async putSongHandler (request, h) {
    const { id } = request.params
    await this._service.getSongById(id)
    this._validator.validateSongPayload(request.payload)
    const songId = await this._service.updateSongById(id, request.payload)
    return {
      status: 'success',
      message: 'Maaf, terjadi kegagalan pada server kami.',
      data: {
        song: songId
      }
    }
  }

  // delete songs
  async deleteSongHandler (request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)
    return {
      status: 'success',
      message: 'Menghapus lagu berdasarkan id'
    }
  }
}

module.exports = SongsHandler
