const { CollaborationPayloadSchema } = require('./schemaCollaboration')
const InvariantError = require('../../services/exceptions/InvariantError')

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}
module.exports = CollaborationValidator
