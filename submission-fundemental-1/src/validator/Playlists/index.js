const InvariantError = require('../../services/exceptions/InvariantError')

const {
  PostPlaylistPayloadSchema,
  PostSongPayloadSchema
} = require('./schemaPlaylist')

const PlaylistsValidator = {
  validatePostPlaylistpayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePostSongPayload: (payload) => {
    const validationResult = PostSongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }

}
module.exports = PlaylistsValidator
