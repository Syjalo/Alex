const kCode = Symbol('code')

class CommandError {
  constructor(code, stringPath, message) {
    if(!code) {
      this[kCode] = 'UNKNOWN_ERROR'
      this.stringPath = 'errors.unknownError'
      this.message = 'An unknown error occurred'
    } else {
      this[kCode] = code
      this.stringPath = stringPath
      this.message = message
    }
    if (Error.captureStackTrace) Error.captureStackTrace(this, CommandError)
  }

  get name() {
    return `CommandError [${this[kCode]}]`
  }

  get code() {
    return this[kCode]
  }

  get fullMessage() {
    return `${this.name}: ${this.message}`
  }
}

module.exports = CommandError