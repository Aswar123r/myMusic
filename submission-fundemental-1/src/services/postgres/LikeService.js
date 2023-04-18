const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')

class LikeService {
  constructor (serviceCache) {
    this._pool = new Pool()
    this._serviceCache = serviceCache
  }

  async addLikeAlbum (userId, albumId) {
    const id = `like-${nanoid(10)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('kesalahan terjadi')
    }
    await this._serviceCache.delete(`likes:${albumId}`)
  }

  async deleteLikeAlbum (userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
    await this._serviceCache.delete(`likes:${albumId}`)
  }

  async getLikeAlbum (albumId) {
    try {
      const result = await this._serviceCache.get(`likes:${albumId}`)
      return {
        data: JSON.parse(result),
        source: 'cache'
      }
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(album_id) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const result = await this._pool.query(query)
      if (!result.rows.length) {
        throw new NotFoundError('Lagu tidak ditemukan')
      }
      await this._serviceCache.set(`likes:${albumId}`, JSON.stringify(result.rows[0].likes))
      return {
        data: result.rows[0].likes,
        source: 'Database'
      }
    }
  }

  async validateLikeAlbum (userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }
    const result = await this._pool.query(query)
    if (result.rows.length) {
      throw new ClientError('Anda sudah like album ini.')
    }
  }
}
module.exports = LikeService
