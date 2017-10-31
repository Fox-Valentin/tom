/**
 * Created
 */
exports.install = function (Vue, options) {
  Vue.prototype.can = function (as) {
    const rules = JSON.parse(localStorage.getItem('user')).rules
    if (rules.indexOf(as) > -1) {
      return true
    }
    return true
  }
  Vue.prototype.trim = function (val) {
    return val.replace(/^\s*/, '').replace(/\s*$/, '')
  }
}
