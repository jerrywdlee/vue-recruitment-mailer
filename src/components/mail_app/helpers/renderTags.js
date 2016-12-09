export default {
  renderTags: function (reg, data, params) {
    if (reg) {
      data = data.replace(reg, (match) => {
        return params[match.replace(/@#|#@/g, '')] || ''
      })
      return data
    } else {
      return data
    }
  }
}
