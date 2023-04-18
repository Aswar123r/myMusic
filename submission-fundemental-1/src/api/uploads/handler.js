const autoBind = require('auto-bind')

const config = require('../../utils/config')

class UploadsHandler {
  constructor (serviceStorage, validator, serviceAlbum) {
    this._serviceStorage = serviceStorage
    this._validator = validator
    this._serviceAlbum = serviceAlbum

    autoBind(this)
  }

  async postUploadImagesHandler (request, h) {
    const { cover } = request.payload
    const { albumId } = request.params
    await this._validator.validateImageHeaders(cover.hapi.headers)
    const fileName = await this._serviceStorage.writeFile(cover, cover.hapi)
    await this._serviceAlbum.addCoverAlbum(fileName, albumId)
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        coverURL: `http://${config.app.host}:${config.app.port}/albums/covers/${albumId}/${fileName}`
      }
    })
    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
