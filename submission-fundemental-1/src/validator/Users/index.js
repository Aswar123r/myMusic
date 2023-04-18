const InvariantError = require('../../services/exceptions/InvariantError')
const { UserPayloadSchema } = require('./schemaUser')

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UserValidator
