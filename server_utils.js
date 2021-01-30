// Utils for Hypixel.

exports.clear_rank = (msg) => {
  return msg.replace(/\[.*?\]/g, '')
}
exports.clear_space = (msg) => {
  return msg.replace(/ /g, '')
}
