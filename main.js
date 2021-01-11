// Main File for HCNBot.

const mineflayer = require("mineflayer")
const proc = require('process')
const fs = require('fs')
const _ = JSON.parse(fs.readFileSync('data.json', 'utf8'))
const U = Object.assign(require('server_utils.js'), require('common_utils.js'))

const ver = "0.0.1 DEV"

let I = {
  "fresh": [],
  "valid": [],
  "last_login": {}
}

if (!U.validateConfig(_)) {
  console.error(U.ERR, "Bad data.json file. Please check it and rerun the bot.");
  proc.exit(1)
}

lg = U.initConsole()

lg(`${MSG} Attempting to connect with following credentials:`)
lg(`${MSG} ${C.yellow(_.account.email)}:**** -- ${C.whiteBright(_.server.host)}:${_.server.port}`)

const bot = mineflayer.createBot({
  "username": _.account.email,
  "password": _.account.password,
  "host": _.server.host,
  "port": _.server.port,
  "version": "1.8.8"
})
bot.chatAddPattern(/(.)(.*)/, 'anychat', 'All chat messages')
bot.chatAddPattern(/^Guild > (.*): (.*)$/, 'guildchat', 'Guild chat messages')

const msgRules = {
  "guildjoining": {"re": /^(.*) has requested to join the Guild!.?$/, "cb": (player) => {

  }},
  "guildjoined": {"re": /^(.*) joined the guild!.?$/, "cb": (player) => {

  }},
  "playerjoin": {"re": /^Guild> (.*) joined.$/, "cb": (player) => {
  }}
}

bot.on('error', err => {
  if (err.message == 'Invalid credentials. Invalid username or password.') {
    lg(`${ERR} Bad account. Please check it and rerun the bot.`)
    proc.exit(2)
  }
  lg(`${ERR} ${C.bold("Unknown expection:")} ${err}`)
})

bot.on('login', () => {
  r.context.bot = bot
  r.on('exit', () => {
    bot.end()
  })

  lg(`${MSG} Logged in.`)
  bot.chat('/language english')
  lg(`${MSG} Transferring to limbo...`)
  bot.chat('/achat §')
})

bot.on('spawn', () => {
  lg(`${DBG} Bot spawned.`)
})

bot.on('anychat', (a, b, c, rawmsg, e) => {
  let msg = rawmsg.getText().split('\n')
  msg.forEach((msg, index) => {
    lg(`${GAM} ${msg}`)
    for (let i in msgRules) {
      let o = msgRules[i]
      if (o.re.test(msg)) {
        let player = o.re.exec(msg)[1]
        lg(`${DGB} Event ${i} triggered, sender ${player}`)
        o.cb(player)
      }
    }
  });
})
/*
<PLAYER> has requested to join the Guild!
<PLAYER> joined the guild!
Guild> <PLAYER> joined.
*/

bot.on('guildchat', (a, b) => {
  a = a.replace(/\[.*?\]/g, '').replace(' ', '')
  b = b.trim()
  lg(`${DBG} Sender: ${a}`)
  if (a == bot.username) return;
  if (b == "bot") bot.chat(`/gc @${a}: HCNBot is operational, version = ${version}.`)
})

bot.on('kicked', (reason, loggedIn) => lg(`${ERR} Bot got kicked: ${reason} - ${loggedIn}`))
