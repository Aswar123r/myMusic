const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')

class CollaborationService {
  constructor () {
    this._pool = new Pool()
  }

  async addCollaboration (playlistId, userId) {
    const id = `collab-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING user_id',
      values: [id, playlistId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Terdapat kesalahan Input')
    }
    return result.rows[0].user_id
  }

  async deleteCollaboration (playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING user_id',
      values: [playlistId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('data tidak di temukan')
    }
  }

  async validateCollaboration (userId, playlistId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      return false
    }
    return true
  }
}

module.exports = CollaborationService
