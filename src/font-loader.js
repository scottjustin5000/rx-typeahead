function loadFonts () {
   // load google roboto font
  let scripts = document.getElementsByTagName('head')
  let script = scripts[scripts.length - 1]
  var roboto = document.createElement('link')
  roboto.setAttribute('rel', 'stylesheet')
  roboto.setAttribute('type', 'text/css')
  roboto.setAttribute('href', '//fonts.googleapis.com/css?family=Roboto:300,400,500')
  script.parentNode.appendChild(roboto)
}

export default loadFonts
