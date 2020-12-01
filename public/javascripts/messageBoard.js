/* eslint-disable no-alert */
/* eslint-disable comma-dangle */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
$(document).ready(function () {
  function toggleArticle() {
    $($(this).next()).slideToggle();
  }

  function retractArticle() {
    $(this).parents('.contentCeil').slideToggle();
  }

  if ($('#welcomeMsg').text()) $('#inform').modal('show');
  $('.article-btn').hide();
  $('.mainArea').css({
    'padding-top': '5%',
    'justify-content': 'flex-start'
  });
  $('.article-btn').on('click', toggleArticle);

  $('.delBtn').on('click', function () {
    $('#deleteAlert').modal('show');
    $('#articleId').val($(this).attr('id'));
  });

  $('#delArticle').on('click', () => {
    const token = '#{csrfToken}';
    const location = window.location.href;
    $.ajax({
      method: 'POST',
      type: 'POST',
      url: `/forum/deleteArticle?_csrf=${token}`,
      data: { articleId: $('#articleId').val() }
    })
      .always((msg) => {
        alert(msg);
        $('#screenMask').show();
        window.location.replace(location);
      });
  });

  $('.reBtn').on('click', retractArticle);
});
