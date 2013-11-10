module.exports = function getTemplate(id) {
  var template = document.getElementById(id)
  var el = document.createElement('div')
  el.innerHTML = template.innerHTML
  return el.children[0]
}
