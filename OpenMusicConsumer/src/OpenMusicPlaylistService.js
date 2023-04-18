const { Pool } = require('pg')

class OpenMusicPlaylistService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylist (playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            JOIN playlist_songs
            ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId]
    }
    const queryGetPlaylist = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId]
    }
    const playlist = await this._pool.query(queryGetPlaylist)
    const allSongByIdPlaylist = await this._pool.query(query)
    let result = playlist.rows[0]
    result.songs = allSongByIdPlaylist.rows
    return result
  }
}

module.exports = OpenMusicPlaylistService
