/* eslint-disable quote-props */
/* eslint-disable no-undef */
$(document).ready(() => {
  // input欄位mask設置(排除規則外字符輸入)
  $('#name').inputmask({ 'mask': '*{5,10}' });
  // 顯示欄位提示
  $('[data-toggle="tooltip"]').tooltip({ placement: 'right', trigger: 'hover focus' });
  $('#resetPwdReq').on('click', () => $('#screenMask').show());
});
