// Main File for HCNBot.

const mineflayer = require("mineflayer")
const mcchat = require("prismarine-chat")
const dashboard = require("mineflayer-dashboard")
const _ = require("data")

// ensure Data
let validateConfig = (cfg, st) => {
  let ret = true;
  if (cfg == undefined) return false;
  if (typeof st == "object") {
    for (var i in st) ret &= validateConfig(cfg[i], st[i]);
  } else {
    ret = typeof cfg == typeof st;
  }
  return ret;
};
let configStructure = {
  "account": {"email": "", "password": "", "host": "", "port": 0}
};

const bot = mineflayer.createBot({
  "username": _.account.email,
  "password": _.account.password,
  "host": _.account.host ? _.account.host : "mc.hypixel.net",
  "port": _.account.port ? _.account.port : 25565,
  "version": "1.8.8"
})
bot.loadPlugin(dashboard({
  chatPattern: /^/
}))
global.console.log = bot.dashboard.log
global.console.error = bot.dashboard.log

bot.on('chat', function (username, message) {
  if (username === bot.username) return
  bot.chat(message)
})

bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))

