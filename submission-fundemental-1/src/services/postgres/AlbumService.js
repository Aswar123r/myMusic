const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const config = require('../../utils/config')

const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')

class AlbumService {
  constructor (serviceCache) {
    this._pool = new Pool()
    this._serviceCache = serviceCache
  }

  async addAlbum ({ name, year }) {
    const id = nanoid(16)
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Terdapat Kesalahan Dari User')
    }
    await this._serviceCache.delete(`album:${id}`)
    return result.rows[0].id
  }

  async getAlbumById (id) {
    try {
      const result = await this._serviceCache.get(`album:${id}`)
      return {
        data: JSON.parse(result),
        source: 'cache'
      }
    } catch (error) {
      const queryAlbum = {
        text: 'SELECT id, name, year, cover AS coverUrl FROM albums WHERE id = $1',
        values: [id]
      }
      const querySong = {
        text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
        values: [id]
      }
      const Album = await this._pool.query(queryAlbum)
      const Song = await this._pool.query(querySong)
      if (!Album.rows.length) {
        throw new NotFoundError('Album Tidak Ditemukan')
      }
      const url = Album.rows[0].coverurl
      const result = Album.rows[0]
      delete result.coverurl
      if (url !== null) {
        const fileName = `http://${config.app.host}:${config.app.port}/albums/covers/${id}/${url}`
        result.coverUrl = fileName
      } else {
        result.coverUrl = null
      }
      result.songs = Song.rows
      await this._serviceCache.set(`album:${id}`, JSON.stringify(result))
      return {
        data: result,
        source: 'cache'
      }
    }
  }

  async updateAlbumById (id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id, name, year',
      values: [name, year, id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album Tidak Ditemukan')
    }
    await this._serviceCache.delete(`album:${id}`)
    return result.rows[0]
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album Tidak Ditemukan')
    }
    await this._serviceCache.delete(`album:${id}`)
    return result.rows[0].id
  }

  async addCoverAlbum (cover, albumId) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('Terjadi kesalhan pada file image')
    }
    await this._serviceCache.delete(`album:${albumId}`)
  }
}

module.exports = AlbumService
