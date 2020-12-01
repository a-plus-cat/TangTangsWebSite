/* eslint-disable no-useless-escape */
/* eslint-disable quote-props */
/* eslint-disable func-names */
/* eslint-disable no-alert */
/* eslint-disable comma-dangle */
/* eslint-disable no-undef */
let show = true;
const garbageCan = {};
const insideAlbum = $('#photoAlbum').html();

function magnifyPhoto() {
  $('#showZoomImg').attr('src', $(this).attr('src'));
  $('#zoomImg').modal('show');
}

$(document).ready(() => {
  $('[data-toggle="tooltip"]').tooltip({
    placement: 'top',
    trigger: 'manual'
  });
  if ($('#errMsg').text() || $('#okMsg').text()) $('#photoAlert').modal('show');

  if (window.innerWidth > 900) {
    $('#photoAlbum').turn({
      width: '70%',
      height: '50vh',
      autoCenter: true
    });
  } else show = false;

  $('#delPhotos').on('click', () => $('#delImg').modal('show'));

  $('#deletePhoto').on('click', () => {
    const idCollect = Object.keys(garbageCan);

    if (!idCollect.length) {
      alert('未剪下任何相片!!!');
      $('#delImg').modal('hide');
    } else {
      // remove pasted back photo's id
      for (let i = 0; i < idCollect.length; i += 1) {
        if (garbageCan[idCollect[i]].value) delete garbageCan[idCollect[i]];
      }

      const delIdStr = JSON.stringify(Object.keys(garbageCan));
      const location = window.location.href;

      $.ajax({
        method: 'POST',
        type: 'POST',
        url: `/photoAlbum/deletePhoto?_csrf=${encode}`,
        contentType: 'application/json; charset=utf-8',
        data: delIdStr
      })
        .done((data) => {
          $('#screenMask').empty();
          $('#screenMask').show();
          if (data) alert('相片刪除成功!!!');
          else alert('相片刪除失敗...請稍後再試');
          window.location.replace(location);
        })
        .fail(() => alert('刪除處理失敗....請重新嘗試'));
    }
  });

  $('#addPhotos').on('click', () => {
    $('#addImg').modal('show');
    $('#fileInput').click();
  });

  $('#uploadPreview').on('load', function () {
    const imgSrc = $(this).attr('src');

    $('#screenMask').removeClass('d-flex justify-content-center align-items-center');

    if (imgSrc !== '/images/noImage.png' && imgSrc !== '/images/addImage.png') {
      $(this).css({
        'width': '70%',
        'max-height': '40%'
      });
      $('#uploadPhoto').removeAttr('disabled');
    } else {
      $('#urlUpload').trigger('reset');
      if (imgSrc === '/images/noImage.png') $("[data-toggle='tooltip']").tooltip('show');
    }
  });

  $('#fileInput').on('click', () => {
    $('#uploadPhoto').removeAttr('disabled');
    $("[data-toggle='tooltip']").tooltip('hide');
  });

  $('#urlInput').on('click', () => {
    $('#urlUpload').trigger('reset');
    $('#uploadPhoto').attr('disabled', 'true');
    $('#uploadPreview').attr('src', '/images/addImage.png');
    $('#uploadPreview').css('width', '128px');
  });

  $('#uploadPreview').on('error', function () {
    $(this)
      .attr('src', '/images/noImage.png')
      .css('width', '128px');
  });

  $('#photo').on('focus', () => {
    $('#uploadPhoto').attr('disabled', 'true');
    $("[data-toggle='tooltip']").tooltip('hide');
  });

  $('#photo').on('blur', function () {
    const preview = $('#uploadPreview').get(0);
    const rule = /(^https:\/\/(?:[a-z0-9\-]+\.)+[a-z0-9]+\/(?:[^\s\/]+\/)*[^\\\/\:\?\*\"<>\|]+\.(?:jpg|jpeg|gif|png))(?:\?[^\?]*)?$/i;
    const urlStr = this.value;
    const isUrl = urlStr.match(rule);
    if (isUrl) {
      $('#uploadPreview').attr('src', isUrl[1]);
      if (!preview.complete) {
        $('#screenMask').addClass('d-flex justify-content-center align-items-center');
      }
    } else {
      $('#urlUpload').trigger('reset');
      $('#uploadPreview').attr('src', '/images/addImage.png');
      $('#uploadPreview').css('width', '128px');
      $("[data-toggle='tooltip']").tooltip('show');
    }
  });

  $('#uploadPhoto').on('click', () => {
    const processMsg = '<span class="spinner-border text-primary"></span><span style="font-size:24px">圖片上傳中...請稍後</span>';
    if ($('#localPaste').hasClass('active')) {
      if ($('#photos').get(0).files.length) {
        $('#uploadNotice').html(processMsg);
        $('#screenMask').empty();
        $('#screenMask').show();
        $('#photoUpload').submit();
      } else alert('請選擇上傳圖檔!!!');
    } else {
      $('#screenMask').show();
      $('#urlUpload').submit();
    }
  });

  $('#prePage').on('click', () => {
    $('#photoAlbum').turn('previous');
  });

  $('#nextPage').on('click', () => {
    $('#photoAlbum').turn('next');
  });

  $('#pages').on('focus', function () {
    this.size = 3;
  });
  $('#pages').on('blur', function () {
    this.size = 1;
  });
  $('#pages').on('change', function () {
    this.size = 1;
    this.blur();
    const targetPage = parseInt(this.value, 10) + 2;
    $('#photoAlbum').turn('page', targetPage);
  });

  if (window.innerWidth <= 850) $('.photo').on('click', magnifyPhoto);
});

$(window).resize(() => {
  if (window.innerWidth > 850) {
    if (show) $('#photoAlbum').turn('size', '70%', '50vh');
    else {
      $('#photoAlbum').turn({
        width: '70%',
        height: '50vh',
        autoCenter: true
      });
      show = true;
    }
  } else if (show) {
    $('#photoAlbum').turn('destroy').remove();
    const e = document.createElement('div');
    $(e).attr('id', 'photoAlbum');
    $(e).html(insideAlbum);
    $('#zoomImg').before(e);
    show = false;
    setTimeout(() => window.location.reload());
  }
});

$('#photoAlbum').bind('turned', () => {
  $('.photo').off('click');
  $('.bookmark').off('click');
  $('.deleteBtn').off('click');

  $('.photo').on('click', magnifyPhoto);

  $('.bookmark').on('click', function () {
    const pageNum = $(this).next().text();
    if ($(this).find('i').is('.far')) {
      $(this).empty().append('<i class="fas">&#xf005;</i>');
      $(this).css('color', 'orange');
      $(this).attr('title', '取消書籤');
      $('#pages > option').eq(pageNum).text(`${pageNum}  🌟`);
    } else {
      $(this).empty().append('<i class="far">&#xf005;</i>');
      $(this).css('color', 'black');
      $(this).attr('title', '加入書籤');
      $('#pages > option').eq(pageNum).text(pageNum);
    }
  });

  $('.deleteBtn').on('click', function () {
    if ($(this).find('i').is('.fas')) {
      $(this).empty().append('<i class="far">&#xf1c5;</i>');
      $(this).css('color', 'lightskyblue');
      $(this).next().hide();
      garbageCan[$(this).next().attr('id')] = true;
      $(this).attr('title', '貼回照片');
    } else {
      $(this).empty().append('<i class="fas">&#xf0c4;</i>');
      $(this).css('color', 'gray');
      $(this).next().show();
      garbageCan[$(this).next().attr('id')] = false;
      $(this).attr('title', '剪下照片');
    }
  });
});
