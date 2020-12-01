/* eslint-disable quote-props */
/* eslint-disable no-undef */
$(document).ready(() => {
  // input欄位mask設置(排除規則外字符輸入)
  $('#pwd').inputmask({ 'mask': '*{0,30}' });
  $('#confirmPwd').inputmask({ 'mask': '*{0,30}' });
  // 顯示欄位提示
  $('[data-toggle="tooltip"]').tooltip({ placement: 'right', trigger: 'hover focus' });
  $('#confirmPwd').prop('disabled', 'true');
  $('#confTitle').toggleClass('disableField');
  $('#pwd').on('blur', unlockCPW);
  $('#confirmPwd').on('focus', setCpwPattern);
  $('#setPwdReq').on('click', () => $('#screenMask').show());
});
