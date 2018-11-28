module.exports = (aliases) => {
  return Array.from(aliases).sort(sortSets).reduce((all, aliases) => {
    return Object.assign(all, aliases)
  }, {})
}

function sortSets (a, b) {
  const ar = JSON.stringify(Array.from(a))
  const br = JSON.stringify(Array.from(b))
  if (ar < br) {
    return -1
  } else if (ar === br) {
    return 0
  }
  return 1
}
