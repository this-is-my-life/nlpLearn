class Query {
  /**
   * @param {string} msg
   * @param {string} prefix
   */
  constructor (msg, prefix = 'nlp.') {
    this.raw = msg
    this.content = msg.replace(prefix, '')
    this.splited = this.content.split(' ')
    this.command = this.splited[0]
    this.args = this.splited.slice(1)
  }
}

module.exports = Query
