
const AlbumHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator, serviceLikeAlbum }) => {
    const AlbumsHandler = new AlbumHandler(service, validator, serviceLikeAlbum)
    server.route(routes(AlbumsHandler))
  }
}
