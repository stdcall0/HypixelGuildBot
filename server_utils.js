// Utils for Hypixel.
const defs = require('./defs')

/**
 * @param {string} msg Incoming message
 * @return {string} the processed one
 */
exports.clear_rank = (msg) => {
  return msg.replace(/\[.*?\]/g, '')
}

/**
 * @param {string} msg Incoming message
 * @return {string} the processed one
 */
exports.clear_space = (msg) => {
  return msg.replace(/ /g, '')
}

/**
 * @param {string} msg Incoming message
 * @return {string} the processed one
 */
exports.clear_all = (msg) => {
  return exports.clear_rank(exports.clear_space(msg))
}

/**
 * @param {string} msg Incoming message
 * @return {string} the processed one
 */
exports.chat_bypass = (msg) => {
  let A = msg
  const prefixes = ['/gc ', '/gchat ', '/pc ', '/pchat ', '/oc ', '/ochat ', '/ac ', '/achat ']

  const randomChar = () => {
    return defs.bypass_char[Math.floor(Math.random() * defs.bypass_char.length)]
  }

  prefixes.forEach((o) => {
    if (msg.startsWith(o)) {
      const content = msg.slice(o.length)
      let output = '', freq = 0
      
      if (content.length > 12) freq = 4
      else if (content.length > 6) freq = 2

      for (let i = 0; i < content.length; ++i) {
        if (!freq || !(i % freq)) output += content[i] + randomChar()
        else output += content[i]
      }

      A = o + output
    }
  })

  return A
}

exports.on_all_chat = (sender, msg, rawmsg, bot) => {
  let m = rawmsg.getText().split('\n')
  
  m.forEach((msg) => {
    bot.lg(`${defs.GAM} ${m}`)

    Object.entries(defs.msg_rules).forEach((a) => {
      const o = a[1]

      if (o.re.test(msg)) {
        const player = o.re.exec(msg)[1] | '<none>'

        bot.lg(`${defs.MSG} Event from ${player}: ${a[0]}`)
        o.cb(player, bot)
      }
    })
  })
}

exports.on_guild_chat = (sender, msg, rawmsg, bot) => {
  const a = exports.clear_all(sender),
    b = msg.trim()

  bot.lg(`${defs.DBG} - from ${a}`)

  if (a == bot.bot.username) return

  if (b == "bot") {
    if (a == "ImHuYue") bot.bot.chat(`/gc @${a}: L`)
    else bot.bot.chat(`/gc @${a}: Hi!`)
  }
}
