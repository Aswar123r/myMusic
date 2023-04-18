const routes = require('./routes')
const UploadsHandler = require('./handler')

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { serviceStorage, validator, serviceAlbum }) => {
    const uploadsHandler = new UploadsHandler(serviceStorage, validator, serviceAlbum)
    server.route(routes(uploadsHandler))
  }
}
