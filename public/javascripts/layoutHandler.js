/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-lonely-if */
/* eslint-disable no-continue */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */

// let appearContent = null;

// show current time
function currentTime() {
  const title = document.getElementById('time');
  const cTime = new Date();
  const timeString = cTime.toLocaleString();
  const toWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const output = timeString.replace(' ', ` ${toWeek[cTime.getDay()]} `);
  title.innerText = `🕰 ${output} 🕰`;
  setTimeout(currentTime, 1000);
}

// show list
function listOpen(event, page) {
  if (window.location.pathname !== page) {
    window.location.pathname = page;
  } else {
    $(event.target.parentNode).find('div:visible').hide();
    const listNum = event.target.id[5];
    $(`#list${listNum}`).show();
  }
}

// close list
function listClose(event) {
  $(event.target.parentNode).hide();
}

// Animation about the magnifier following the movement of the mouse
function moveGlass(event) {
  const buttons = Array.from(event.target.parentNode.children);
  const buttonIndex = buttons.indexOf(event.target);
  const glassCss = event.target.parentNode.style;

  // 取消動畫填充模式-->讓js可在變動元素的style
  glassCss['animation-fill-mode'] = 'none';

  // 根據滑鼠位於第...個按鈕動態變更放大鏡當前位置
  glassCss['background-position'] = `23.5vw ${35 + buttonIndex * 6}vh, 20vw 36vh `;
}

// show articles of specific catagory
function showContent(event, c) {
  $(event.target.parentNode).hide();
  const category = c;
  $('.article-btn, .contentCeil').hide();
  $(`.${category}`).show();
}

// the original dimension of image map
let previousWidth = 343;
// refresh image map's coordinate
function resetMap() {
  const mapArea = document.getElementById('map_ID').getElementsByTagName('area');
  const coordNum = [];
  // 計算圖片reize後的縮放比例
  const scale = document.getElementById('img_ID').offsetWidth / previousWidth;
  // 將area座標字串拆分
  for (let i = 0; i < mapArea.length; i += 1) coordNum[i] = mapArea[i].coords.split(',');
  // 利用縮放比例更新map座標值
  for (let x = 0; x < mapArea.length; x += 1) {
    // 計算新座標值
    for (let y = 0; y < coordNum[x].length; y += 1) coordNum[x][y] *= scale;
    // 更新新座標值
    mapArea[x].coords = coordNum[x].join(',');
  }
  // map圖片舊寬度更新為現有尺寸
  previousWidth = document.getElementById('img_ID').offsetWidth;
}

// preview upload picture
function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      $('#picBlock').css('background-image', `url(${e.target.result})`);
    };

    if (!input.files[0].type.startsWith('image/')) {
      $('#picBlock').css('background-image', "url('../images/noImage.png')");
      alert('錯誤的頭像格式!!! 請重新選擇');
    } else reader.readAsDataURL(input.files[0]);
  }
}

// set the field's pattern of confirm pwd
function setCpwPattern() {
  const cpwPattern = $('#pwd').val();
  $('#confirmPwd').attr('pattern', cpwPattern);
}

// unlock the field of confirm pwd
function unlockCPW() {
  const pwValidity = document.getElementById('pwd').checkValidity();
  $('#confirmPwd').val('');
  const before = $('#confirmPwd').prop('disabled');
  $('#confirmPwd').prop('disabled', !pwValidity);
  if (before !== !pwValidity) $('#confTitle').toggleClass('disableField');
}

// play the animation of putting a seal on
function stampAni() {
  const fieldName = ['userIcon', 'name', 'email', 'pwd', 'confirmPwd'];
  // 確認表單填寫完整
  for (let i = 0; i < fieldName.length; i += 1) {
    const ele = $(`#${fieldName[i]}`).get(0);
    if (!ele.checkValidity()) {
      if (i === 0) $('#picLabel').tooltip('show');
      else $(`#${fieldName[i]}`).tooltip('show');
      return;
    }
  }

  // 顯示蓋印動畫
  $('#stamp').css('display', 'block');
  // 延後1秒進行表單傳送
  setTimeout(() => {
    $('form').submit();
  }, 500);
}
