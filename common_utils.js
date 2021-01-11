// Common utils for HCNBot.
// Include Chat utils and so on.

const C = require('chalk')
const repl = require('repl')

const ERR = C.bgGray.bold.red("ERR")
const WRN = C.bgGray.bold.yellow("WRN")
const MSG = C.bold.whiteBright("MSG")
const DBG = C.bold.gray("DBG")
const GAM = C.bgGray(" # ")

const cfg = {
  "account": {"email": "", "password": ""},
  "server": {"host": "", "port": 0}
}

const vCfg = (cfg, st) => {
  let ret = true;
  if (cfg == undefined) return false;
  if (typeof st == "object") {
    for (var i in st) ret &= vCfg(cfg[i], st[i]);
  } else {
    ret = typeof cfg == typeof st;
  }
  return ret;
}

const iCon = () => {
  r = repl.start('> ')
  lg = r.context.lg = (a) => {
    const promptOffset = r._prompt.length + r.line.length;
    proc.stdout.write('\033[2K\033[1G')
    proc.stdout.write(a + "\n")
    proc.stdout.write('' + r._prompt + r.line)
    proc.stdout.write('\033[' + (promptOffset + 1) + 'G')
  };
  return lg
}

export {
  C, ERR, WRN, MSG, DBG, GAM,
  (st) => { return vCfg(cfg, st) } as validateCfg,
  iCon as initConsole
}
