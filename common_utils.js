// Common utils for HCNBot.
// Include Chat utils and so on.

const repl = require('repl')
const proc = require('process')
const sprintf = require('sprintf-js').sprintf
const defs = require('./defs')

const validateCfg = (cfg, st) => {
  let ret = true;
  if (cfg == undefined) return false;
  if (typeof st == "object") {
    for (var i in st) ret &= validateCfg(cfg[i], st[i]);
  } else {
    ret = typeof cfg == typeof st;
  }
  return ret;
}

exports.validateConfig = (cfg) => {
  return validateCfg(
    {
      "account": {"email": "", "password": ""},
      "server": {"host": "", "port": 0}
    },
    cfg
  )
}

exports.initializeConsole = () => {
  r = repl.start({prompt: '> ', eval: (a,b,c,d) => d(new repl.Recoverable()) })
  lg = r.context.lg = (a) => {
    a.split('\n').forEach((b) => {
      const line = '' + r._prompt + r.line
      const output = sprintf(`%s[2K%s[1G${b}\n${line}%s[${line.length + 1}G`, '\033', '\033', '\033')
      proc.stdout.write(output)
    })
  }
  r.defineCommand('ac', {
    help: 'Send chat messages',
    action(msg) {
      this.displayPrompt(false)
      if (this.context.bot.chat) this.context.bot.chat(`/ac ${msg}`)
      this.displayPrompt(true)
    }
  })
  r.defineCommand('gc', {
    help: 'Send guild chat messages',
    action(msg) {
      this.displayPrompt(false)
      if (this.context.bot.chat) this.context.bot.chat(`/gc ${msg}`)
      this.displayPrompt(true)
    }
  })
  r.defineCommand('pc', {
    help: 'Send party chat messages',
    action(msg) {
      this.displayPrompt(false)
      if (this.context.bot.chat) this.context.bot.chat(`/pc ${msg}`)
      this.displayPrompt(true)
    }
  })
  r.defineCommand('c', {
    help: 'Send commands',
    action(msg) {
      this.displayPrompt(false)
      if (this.context.bot.chat) this.context.bot.chat(`/${msg}`)
      this.displayPrompt(true)
    }
  })
  return [lg, r]
}

exports.generateBotArguments = (_) => {
  return {
    "username": _.account.email,
    "password": _.account.password,
    "host": _.server.host,
    "port": _.server.port,
    "version": defs.version
  }
}
