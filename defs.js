// defs for HCNBot.
// Include the defs that HCNbot uses.

const C = require('chalk')

exports.ERR = C.bgGray.bold.red("ERR")
exports.WRN = C.bgGray.bold.yellow("WRN")
exports.MSG = C.bold.whiteBright("MSG")
exports.DBG = C.bold.gray("DBG")
exports.GAM = C.bgGray(" # ")

exports.version = "1.8.8"
exports.botversion = "0.1.0 Beta"

exports.patterns = {
  'all_chat': /(.)(.*)/,
  'guild_chat': /^Guild > (.*): (.*)$/
}

exports.msg_rules = {
  "limbo_spawn": {"re": /^You were spawned in Limbo.$/, "cb": (player, bot) => {
    setTimeout(() => bot.bot.chat(`/gc [BOT] HCNBot 已在线 - Powered by MineFlayer - Created by ImChinaNB.`), 1000)
  }},
  "guild_joining": {"re": /^(.*) has requested to join the Guild!.?$/, "cb": (player, bot) => {

  }},
  "guild_joined": {"re": /^(.*) joined the guild!.?$/, "cb": (player, bot) => {

  }},
  "player_join": {"re": /^Guild> (.*) joined.$/, "cb": (player, bot) => {
  }}
}

exports.bypass_char = ['‎','‏','','','‍‌','‬']
