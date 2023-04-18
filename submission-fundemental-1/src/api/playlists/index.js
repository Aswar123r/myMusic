const SongsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { servicePlaylist, validator, serviceCollaboration }) => {
    const MusicHandler = new SongsHandler(servicePlaylist, validator, serviceCollaboration)
    server.route(routes(MusicHandler))
  }
}
