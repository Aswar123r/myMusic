const CollaborationHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server, { serviceCollaboration, validator, servicePlaylist, serviceUser }) => {
    const CollaborationsHandler = new CollaborationHandler(serviceCollaboration, validator, servicePlaylist, serviceUser)
    server.route(routes(CollaborationsHandler))
  }
}
