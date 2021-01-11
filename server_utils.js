// Utils for Hypixel.

const clear_rank = (msg) => {
  return msg.replace(/\[.*?\]/g, '')
}
const clear_space = (msg) => {
  return msg.replace(/ /g, '')
}

export { clear_rank, clear_space }
