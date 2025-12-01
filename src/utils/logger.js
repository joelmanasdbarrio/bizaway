export default class logger {
  static _normalizeArgs(args) {
    const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : Array.from(args)
    return list.map(item => {
      if (item === null) return 'null'
      if (item === undefined) return 'undefined'
      if (typeof item === 'string') return item
      try {
        return JSON.stringify(item)
      } catch (e) {
        return String(item)
      }
    })
  }

  /**
   * @param {...(string|Object|Error|null|undefined)} messages
   */
  static info(...messages) {
    const parts = this._normalizeArgs(messages)
    console.log(`${new Date().toISOString()} - [info]: ${parts.join(':\n\t')}`)
  }

  /**
   * @param {...(string|Object|Error|null|undefined)} messages
   */
  static error(...messages) {
    const parts = this._normalizeArgs(messages)
    console.error(`${new Date().toISOString()} - [error]: ${parts.join(':\n\t')}`)
  }

  /**
   * @param {...(string|Object|Error|null|undefined)} messages
   */
  static warn(...messages) {
    const parts = this._normalizeArgs(messages)
    console.warn(`${new Date().toISOString()} - [warn]: ${parts.join(':\n\t')}`)
  }

  /**
   * @param {...(string|Object|Error|null|undefined)} messages
   */
  static debug(...messages) {
    const parts = this._normalizeArgs(messages)
    console.debug(`${new Date().toISOString()} - [debug]: ${parts.join(':\n\t')}`)
  }
}