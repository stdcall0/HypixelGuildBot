// Main File for HCNBot.

const fs = require('fs')
const proc = require('process')
const common_utils = require('./common_utils')
const defs = require('./defs')
const bot = require('./bot')

if (!fs.existsSync('config.json')) {
  console.error(defs.ERR, "No config.json. Create it and rerun the bot.")
  proc.exit(1)
}
const cfg = require('root-require')('config.json')
if (!common_utils.validateConfig(cfg)) {
  console.error(defs.ERR, "Bad config.json. Check it and rerun the bot.");
  proc.exit(1)
}

const _ = common_utils.initializeConsole()
const con = _[1], lg = _[0]
const Bot = bot.getBot(cfg, con, lg)
