/* eslint-disable func-names */
/* eslint-disable quote-props */
/* eslint-disable no-undef */
$(document).ready(() => {
  $('#notice').modal('show');
  // input欄位mask設置(排除規則外字符輸入)
  $('#name').inputmask({ 'mask': '*{5,10}' });
  $('#pwd').inputmask({ 'mask': '*{0,30}' });
  $('#confirmPwd').inputmask({ 'mask': '*{0,30}' });

  // 顯示欄位提示
  $('#picLabel').tooltip({ placement: 'right', trigger: 'hover' });
  $('[data-toggle="tooltip"]').tooltip({ placement: 'right', trigger: 'focus' });

  if (!$('#confirmPwd').val()) {
    $('#confirmPwd').prop('disabled', 'true');
    $('#confTitle').toggleClass('disableField');
  }

  for (let i = 1; i < $(':required').length; i += 1) {
    if ($(':required').eq(i).val()) $(':required').eq(i).addClass('modified');
  }

  // input第一次觸發事件時加入class
  $(':required').one('blur', function () {
    if (!$(this).hasClass('modified')) $(this).addClass('modified');
  });
  $('#pwd').on('blur', unlockCPW);
  $('#confirmPwd').on('focus', setCpwPattern);
});
