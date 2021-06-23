class CommandOption {
  constructor() {
    this.type = null

    this.name = null

    this.description = null
    
    this.required = false

    this.choices = null

    this.options = null
  }

  setType(type) {
    this.type = type
    return this
  }

  setName(name) {
    this.name = name
    return this
  }

  setDescription(description) {
    this.description = description
    return this
  }

  setRequired(required = true) {
    this.required = Boolean(required)
    return this
  }

  addChoice(choice) {
    if(!this.choices) this.choices = []
    this.choices = this.choices.concat([choice])
    return this
  }

  addChoices(choices) {
    if(!this.choices) this.choices = []
    this.choices = this.choices.concat(choices)
    return this
  }

  addOption(option) {
    if(this.options) this.options = []
    this.options = this.options.concat([option])
    return this
  }

  addOptions(options) {
    if(this.options) this.options = []
    this.options = this.options.concat(options)
    return this
  }

  resolveData() {
    const commandOptionTypes = ['SUB_COMMAND', 'SUB_COMMAND_GROUP', 'STRING', 'INTEGER', 'BOOLEAN', 'USER', 'CHANNEL', 'ROLE', 'MENTIONABLE']
    if(!commandOptionTypes.includes(this.type) && typeof this.type !== 'number') throw new Error('COMMAND_OPTION_TYPE_INVALID')
    if(typeof this.name !== 'string') throw new Error('COMMAND_OPTION_NAME_INVALID')
    if(typeof this.description !== 'string') throw new Error('COMMAND_OPTION_DESCRIPTION_INVALID')
    if(typeof this.required !== 'boolean' && this.required !== null) throw new Error('COMMAND_OPTION_REQUIRED_INVALID')
    if((typeof this.choices !== 'object' && !this.choices.every(c => 'name' in c && 'value' in c)) || this.choices !== null) throw new Error('COMMAND_OPTION_CHOICES_INVALID')
    if((typeof this.options !== 'object' && !this.options.every(o => ((o instanceof this && o.resolveData()) || (this.options !== null) || ('type' in o && 'name' in o && 'description' in o))))) throw new Error('COMMAND_OPTION_OPTIONS_INVALID')
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      required: this.required,
      choices: this.choices,
      options: this.options
    }
  }

  toJSON() {
    return this.resolveData()
  }
}

module.exports = CommandOption