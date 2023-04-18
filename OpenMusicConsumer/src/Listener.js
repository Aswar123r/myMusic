require('dotenv').config()

class Listener {
  constructor (openMusicPlaylistService, mailSender) {
    this._openMusicPlaylistService = openMusicPlaylistService
    this._mailSender = mailSender

    this.listen = this.listen.bind(this)
  }

  async listen (message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString())
      const playlist = await this._openMusicPlaylistService.getPlaylist(playlistId)
      await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist))
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Listener
