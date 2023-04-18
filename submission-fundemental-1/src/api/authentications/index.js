const AuthenticationHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { serviceUser, serviceAuthentication, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationHandler(
      serviceUser,
      serviceAuthentication,
      tokenManager,
      validator
    )
    server.route(routes(authenticationsHandler))
  }
}
