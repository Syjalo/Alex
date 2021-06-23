class CommandError {
  constructor(client) {    
    this.client = client

    this.code = null

    this.titleStringPath = null

    this.descriptionStringPath = null

    this.messageStringPath = null

    this.titleString = null

    this.descriptionString = null

    this.messageString = null

    this.titleStringVariables = {}

    this.descriptionStringVariables = {}

    this.messageStringVariables = {}

    this.options = { ephemeral: true }
  }

  setCode(code) {
    this.code = code
    return this
  }

  setTitleStringPath(path) {
    this.titleStringPath = path
    return this
  }

  setDescriptionStringPath(path) {
    this.descriptionStringPath = path
    return this
  }

  setMessageStringPath(path) {
    this.messageStringPath = path
    return this
  }

  setTitleString(string) {
    this.titleString = string
    return this
  }

  setDescriptionString(string) {
    this.descriptionString = string
    return this
  }

  setMessageString(string) {
    this.messageString = string
    return this
  }

  setTitleStringVariables(variables) {
    this.titleStringVariables = variables
    return this
  }

  setDescriptionStringVariables(variables) {
    this.descriptionStringVariables = variables
    return this
  }

  setMessageStringVariables(variables) {
    this.messageStringVariables = variables
    return this
  }

  get getTitleStringPath() {
    return this.messageStringPath ? this.messageStringPath : this.titleStringPath
  }

  get getDescriptionStringPath() {
    return this.messageStringPath ? null : this.descriptionStringPath
  }

  getTitleString(locale) {
    const string = this.client.getString(this.getTitleStringPath, { locale, variables: this.titleStringVariables })
    return string ? string : this.messageString ? this.messageString : this.titleString ? this.titleString : ''
  }

  getDescriptionString(locale) {
    const string = this.client.getString(this.getDescriptionStringPath, { locale, variables: this.getDescriptionStringVariables })
    return string ? string : this.messageString ? null : this.descriptionString ? this.descriptionString : ''
  }

  get getTitleStringVariables() {
    return this.messageStringPath ? this.messageStringVariables : this.titleStringVariables
  }

  get getDescriptionStringVariables() {
    return this.messageStringPath ? null : this.descriptionStringVariables
  }

  setOptions(options) {
    this.options = Object.assign(this.options, options)
    return this
  }

  get name() {
    return `CommandError [${this.code}]`
  }

  get fullMessage() {
    return `${this.name}: ${this.getTitleString()}${this.getDescriptionString() ? `\n${this.getDescriptionString()}` : ''}`
  }

  toString() {
    return this.fullMessage
  }
}

module.exports = CommandError