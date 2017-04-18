// var $ = require('jquery');

['click', 'change'].forEach(ev => {
  document.forms[0]['on' + ev] = (event) => console.log(event);
})

function f(...args) {
  console.log(args);
}
