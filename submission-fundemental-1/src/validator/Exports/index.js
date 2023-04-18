const ExportOpenMusicPayloadSchema = require('./schemaExport')

const InvariantError = require('../../services/exceptions/InvariantError')

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportOpenMusicPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = ExportsValidator
