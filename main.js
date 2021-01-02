// Main File for HCNBot.

const mineflayer = require("mineflayer")
const C = require('chalk')
const proc = require('process')
const repl = require('repl')
const fs = require('fs')
const _ = JSON.parse(fs.readFileSync('data.json', 'utf8'))

const ERR = C.bgGray.bold.red("ERR")
const WRN = C.bgGray.bold.yellow("WRN")
const MSG = C.bold.whiteBright("MSG")
const DBG = C.bold.gray("DBG")
const GAM = C.bgGray(" # ")


// ensure Data
const validateConfig = (cfg, st) => {
  let ret = true;
  if (cfg == undefined) return false;
  if (typeof st == "object") {
    for (var i in st) ret &= validateConfig(cfg[i], st[i]);
  } else {
    ret = typeof cfg == typeof st;
  }
  return ret;
}
const configStructure = {
  "account": {"email": "", "password": ""},
  "server": {"host": "", "port": 0}
}
if (!validateConfig(_, configStructure)) {
  console.error(C.bgGray.bold.red("ERR"), "Bad data.json file. Please check it and rerun the bot.");
  proc.exit(1)
}

r = repl.start('> ')
lg = r.context.lg = (a) => {
  const promptOffset = r._prompt.length + r.line.length;
  proc.stdout.write('\033[2K\033[1G') // erase to the beginning of the line
  proc.stdout.write(a + "\n")
  proc.stdout.write('' + r._prompt + r.line)
  proc.stdout.write('\033[' + (promptOffset + 1) + 'G')
};

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
*/

bot.on('guildchat', (a, b) => {
  a = a.replace(/\[.*?\]/g, '').replace(' ', '')
  b = b.trim()
  lg(`${DBG} Sender: ${a}`)
  if (a == bot.username) return;
  if (b == "bot") bot.chat(`/gc @${a}: HCNBot is operational, version = 0.0.1 DEV.`)
})

bot.on('kicked', (reason, loggedIn) => lg(`${ERR} Bot got kicked: ${reason} - ${loggedIn}`))
