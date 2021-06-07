class CommandError {
  constructor(code, stringPath, message) {
    if(!code) {
      this.code = 'UNKNOWN_ERROR'
      this.stringPath = 'errors.unknown'
      this.message = 'An unknown error occurred'
    } else {
      this.code = code
      this.stringPath = stringPath
      this.message = message
    }
  }

  get name() {
    return `CommandError [${this.code}]`
  }

  get fullMessage() {
    return `${this.name}: ${this.message}`
  }
}

module.exports = CommandError