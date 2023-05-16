// renderer process
// const counter = document.getElementById('counter')
// window.$ = window.jQuery = require('jquery');

// let $ = jQuery = require('jquery');
// const datepicker = require('js-datepicker');


// window.electronAPI.handleCounter((event, value) => {
//     const oldValue = Number(counter.innerText)
//     const newValue = oldValue + value
//     counter.innerText = newValue
// });

window.electronAPI.handleContent((e, v) => {
  console.warn(e, v);
})

window.addEventListener('send-content', data => {
  console.warn(data);
});

electronAPI.openFile();
// $(() => {
//   $('#counter').html('hello!');
// });