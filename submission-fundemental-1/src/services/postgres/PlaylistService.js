/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const dateNow = new Date()

const InvariantError = require('../exceptions/InvariantError')
const NotFoundError = require('../exceptions/NotFoundError')
const AuthorizationError = require('../exceptions/AuthorizationError')
const ClientError = require('../exceptions/ClientError')

class PlaylistsService {
  constructor (serviceCache) {
    this._pool = new Pool()
    this._serviceCache = serviceCache
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }
    await this._serviceCache.delete('playlists')
    return result.rows[0].id
  }

  async getPlaylists (user) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id  
      WHERE playlists.owner = $1 OR collaborations.user_id = $1 LIMIT 2;`,
      values: [user]
    }
    const result = await this._pool.query(query)
    await this._serviceCache.set('playlists', JSON.stringify(result.rows))
    return result.rows
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
    await this._serviceCache.delete('playlists')
  }

  async addSongToPlaylist (playlistId, songId) {
    const id = `playlistSong-${nanoid(10)}`
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist')
    }
  }

  async getSongsFromPlaylist (playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlist_songs
      ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId]
    }
    const querygetplaylist = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
      JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1;`,
      values: [playlistId]
    }
    const playlist = await this._pool.query(querygetplaylist)
    const allSongByIdPlaylist = await this._pool.query(query)

    if (!allSongByIdPlaylist.rows.length) {
      throw new NotFoundError('gagal mendapatkan lagu di  playlist')
    }
    const result = playlist.rows[0]
    result.songs = allSongByIdPlaylist.rows
    return result
  }

  async deleteSongFromPlaylist (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new ClientError('Lagu gagal dihapus')
    }
    return result.rows[0].id
  }

  async verifySongInDatabase (songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id =  $1',
      values: [songId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak di temukan')
    }
  }

  async validateOwnerPlaylist (credentialId, playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id =  $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist Tidak ada')
    }
    if (result.rows[0].owner !== credentialId) {
      throw new AuthorizationError('Anda Tidak berhak Untuk mengakses resource ini')
    }
    return result.rows
  }

  async addActivitiePlaylist (playlistId, songId, userId, action) {
    const id = `playlistSong-${nanoid(10)}`
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, dateNow]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('Terjadi Kesalahan')
    }
  }

  async getActivitiePlaylist (playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      INNER JOIN users ON playlist_song_activities.user_id = users.id
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistsService
