export function _type(param) {
  return Object.prototype.toString
    .call(param)
    .replace(/(\[object+\s|\])/g, '')
    .toLowerCase()
}
