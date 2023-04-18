const InvariantError = require('../../services/exceptions/InvariantError')
const { ImageHeadersSchema } = require('./schemaUpload')

const uploadsImageValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}
module.exports = uploadsImageValidator
