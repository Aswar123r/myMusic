const SongsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { serviceRabbitMq, validator, servicePlaylist }) => {
    const ExportHandler = new SongsHandler(serviceRabbitMq, validator, servicePlaylist)
    server.route(routes(ExportHandler))
  }
}
