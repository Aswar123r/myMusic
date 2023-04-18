const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')

class SongService {
  constructor (serviceCache) {
    this._pool = new Pool()
    this._serviceCache = serviceCache
  }

  async addSong ({
    title, year, genre, performer, duration, albumId
  }) {
    const id = `song-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Lagu Tidak Ditemukan')
    }
    await this._serviceCache.delete(`album:${albumId}`)
    await this._serviceCache.delete('songs')
    return result.rows[0].id
  }

  async getAllSong () {
    const result = await this._pool.query('SELECT id, title, performer FROM songs')
    if (!result.rows.length) {
      throw new NotFoundError('Lagu Tidak Ditemukan')
    }
    await this._serviceCache.set('songs', JSON.stringify(result.rows[0]))
    return result.rows
  }

  async getAllSongByTitle (title) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
      values: [`%${title}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu Tidak Ditemukan')
    }
    return result.rows
  }

  async getAllSongByPerformer (performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
      values: [`%${performer}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu Tidak Ditemukan')
    }
    return result.rows
  }

  async getAllSongByTitleAndPerformer (title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1 AND title LIKE $2',
      values: [`%${performer}%`, `%${title}%`]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu Tidak Ditemukan')
    }
    return result.rows
  }

  async getSongById (songId) {
    try {
      const result = await this._serviceCache.get(`song:${songId}`)
      return {
        data: JSON.parse(result),
        source: 'cache'
      }
    } catch (error) {
      const query = {
        text: 'SELECT id, title, year, performer, genre, duration FROM songs WHERE id = $1',
        values: [songId]
      }
      const result = await this._pool.query(query)
      if (!result.rows.length) {
        throw new NotFoundError('Lagu Tidak Ditemukan')
      }
      await this._serviceCache.set(`song:${songId}`, JSON.stringify(result.rows[0]))
      return {
        data: result.rows[0],
        source: 'Database'
      }
    }
  }

  async updateSongById (songId, {
    title, year, performer, genre, duration
  }) {
    const query = {
      text: 'UPDATE songs SET title = ($1), year = ($2), genre = ($3), performer = ($4), duration = ($5) WHERE id = ($6) RETURNING id, title, year, performer, genre, duration',
      values: [title, year, genre, performer, duration, songId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu Tidak Ditemukan')
    }
    await this._serviceCache.delete(`song:${songId}`)
    await this._serviceCache.delete('songs')
    return result.rows[0]
  }

  async deleteSongById (songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
    await this._serviceCache.delete(`song:${songId}`)
    await this._serviceCache.delete('songs')
    return result.rows[0].id
  }
}

module.exports = SongService
