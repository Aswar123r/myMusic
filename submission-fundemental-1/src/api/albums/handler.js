const autoBind = require('auto-bind')

class AlbumHandler {
  constructor (service, validator, serviceLikeAlbum) {
    this._service = service
    this._validator = validator
    this._serviceLikeAlbum = serviceLikeAlbum

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload
    const albumId = await this._service.addAlbum({ name, year })

    const response = h.response({
      status: 'success',
      message: 'Menambahkan album.',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)
    console
    const response = h.response({
      status: 'success',
      data: {
        album: album.data
      }
    })
    if (album.source === 'cache') {
      response.header('X-Data-Source', 'cache')
    }
    response.code(200)
    return response
  }

  async putAlbumHandler (request, h) {
    const { id } = request.params
    await this._service.getAlbumById(id)
    this._validator.validateAlbumPayload(request.payload)
    const { name, year } = request.payload
    const result = await this._service.updateAlbumById(id, { name, year })
    return {
      status: 'success',
      message: 'Mengubah album berdasarkan id album.',
      data: {
        result
      }
    }
  }

  async deletetAlbumHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Menghapus album berdasarkan id.'
    }
  }

  async postLikeAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._service.getAlbumById(id)
    await this._serviceLikeAlbum.validateLikeAlbum(credentialId, id)
    await this._serviceLikeAlbum.addLikeAlbum(credentialId, id)
    const response = h.response({
      status: 'success',
      message: 'Menambahkan like.'
    })
    response.code(201)
    return response
  }

  async deleteLikeAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._serviceLikeAlbum.deleteLikeAlbum(credentialId, id)
    return {
      status: 'success',
      message: 'Menghapus like.'
    }
  }

  async getLikeAlbumHandler (request, h) {
    const { id } = request.params
    const countLike = await this._serviceLikeAlbum.getLikeAlbum(id)
    const response = h.response({
      status: 'success',
      data: {
        likes: Number(countLike.data)
      }
    })
    if (countLike.source === 'cache') {
      response.header('X-Data-Source', 'cache')
    }
    response.code(200)
    return response
  }
}
module.exports = AlbumHandler
