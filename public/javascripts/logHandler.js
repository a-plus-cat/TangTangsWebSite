/* eslint-disable quote-props */
/* eslint-disable no-undef */
$(document).ready(() => {
  // input欄位mask設置(排除規則外字符輸入)
  $('#username').inputmask({ 'mask': '*{5,10}' });
  $('#password').inputmask({ 'mask': '*{0,30}' });
});
