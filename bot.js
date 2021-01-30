// Main class for HCNbot.
// Include a HCNBot Object.

const server_utils = require('./server_utils')
const common_utils = require('./common_utils')
const defs = require('./defs')
const proc = require('process')
const chalk = require('chalk')
const mineflayer = require('mineflayer')
const { REPLServer } = require('repl')

/**
 * @param {Object} cfg Bot configs
 * @param {REPLServer} con The repl console
 * @param {(a) => void} lg The output function
 * @param {Object} rules Messaging rules
 */
exports.getBot = (cfg, con, lg, rules) => {
  return new function() {
    this.cfg = cfg        // config Object for the bot
    this.con = con        // console Object for the bot
    this.lg = lg          // console.log that logs to the repl console
    this.rules = rules

    this.con.on('exit', () => {
      if (this.bot) {
        this.lg(`${defs.MSG} Exiting.`)
        this.bot.end()
      }
      proc.exit(0)
    })

    this.lg(`${defs.MSG} Connecting to ${chalk.whiteBright(this.cfg.server.host)}:${this.cfg.server.port} using ${chalk.yellow(this.cfg.account.email)}...`)
    this.lg(`${defs.DBG} ${JSON.stringify(common_utils.generateBotArguments(this.cfg))}`)

    this.con.context.bot = this.bot = mineflayer.createBot(
      common_utils.generateBotArguments(this.cfg)
    )

    if (!this.bot.chat) {
      this.lg(`${defs.ERR} Bot creation failed.`)
      proc.exit(6)
    }

    this.bot.chat_ = this.bot.chat
    this.bot.chat = (a) => {
      this.lg(`${defs.DBG} Sending chat: ${a}`)
      this.bot.chat_(a)
    }

    this.bot.chatAddPattern(defs.patterns.all_chat, 'all_chat', 'All chat messages')
    this.bot.chatAddPattern(defs.patterns.guild_chat, 'guild_chat', 'Guild chat messages')
    
    this.bot.on('error', err => {
      if (err.message == 'Invalid credentials. Invalid username or password.') {
        this.lg(`${defs.ERR} Bad account.`)
        proc.exit(2)
      }
      this.lg(`${defs.ERR} ${C.bold("Unknown expection:")} ${err}`)
      proc.exit(3)
    })

    this.bot.on('login', () => {
      this.lg(`${defs.MSG} Logged in.`)
      this.bot.chat('/language English')
      this.lg(`${defs.MSG} Transferring to Limbo...`)
      this.bot.chat('/achat §')
    })

    this.bot.on('spawn', () => {
      this.lg(`${defs.DBG} Bot spawned.`)
    })

    this.bot.on('all_chat', (a, b, c, rawmsg, e) => {
      let msg = rawmsg.getText().split('\n')
      msg.forEach((msg, index) => {
        this.lg(`${defs.GAM} ${msg}`)
        for (let i in this.rules) {
          let o = this.rules[i]
          if (o.re.test(msg)) {
            const player = o.re.exec(msg)[1]
            this.lg(`${defs.DGB} ${player}: ${i}`)
            o.cb(player, this)
          }
        }
      });
    })
    
    this.bot.on('guild_chat', (a, b) => {
      a = server_utils.clear_space(server_utils.clear_rank(a))
      b = b.trim()
      this.lg(`${defs.DBG} - from ${a}`)
      if (a == this.bot.username) return
      if (b == "bot") this.bot.chat(`/gc @${a}: HCNBot 可用, 版本为 ${defs.botversion}.`)
    })

    this.bot.on('kicked', (reason, loggedIn) => {
      this.lg(`${defs.ERR} Bot got kicked: ${reason} - ${loggedIn}`)
    })
  }
}
