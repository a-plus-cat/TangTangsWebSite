/* eslint-disable prefer-rest-params */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */

// let appearContent = null;

// 顯示當前時間
function currentTime() {
  const title = document.getElementById('time');
  const cTime = new Date();
  const timeString = cTime.toLocaleString();
  const toWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const output = timeString.replace(' ', ` ${toWeek[cTime.getDay()]} `);
  title.innerText = `🕰 ${output} 🕰`;
  setTimeout(currentTime, 1000);
}

// 顯示清單
function listOpen(event) {
  $(event.target.parentNode).find('div:visible').hide();
  const listNum = event.target.id[5];
  $(`#list${listNum}`).show();
}
// 關閉清單
function listClose(event) {
  $(event.target.parentNode).hide();
}
// 動態顯示放大鏡
function moveGlass(event) {
  const buttons = Array.from(event.target.parentNode.children);
  const buttonIndex = buttons.indexOf(event.target);
  const glassCss = event.target.parentNode.style;

  // 取消動畫填充模式-->讓js可在變動元素的style
  glassCss['animation-fill-mode'] = 'none';

  // 根據滑鼠位於第...個按鈕動態變更放大鏡當前位置
  glassCss['background-position'] = `23.5vw ${35 + buttonIndex * 5}vh, 20vw 36vh `;
}
// 顯示主要內容
function showContent(subject) {

}

// map的圖片舊寬度尺寸
let previousWidth = 343;
// 更新map座標
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

// 預覽上傳圖片
function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = $('#picBlock').get(0);
      $(img).css('background-image', `url(${e.target.result})`);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// 設置確認密碼欄位pattern
function setCpwPattern() {
  const cpwPattern = $('#pwd').val();
  $('#confirmPwd').attr('pattern', cpwPattern);
}

// 解鎖確認密碼欄位
function unlockCPW() {
  const pwValidity = document.getElementById('pwd').checkValidity();
  $('#confirmPwd').val('');
  const before = $('#confirmPwd').prop('disabled');
  $('#confirmPwd').prop('disabled', !pwValidity);
  if (before !== !pwValidity) $('#confTitle').toggleClass('disableField');
}

// 顯示蓋印動畫
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
// img map link
// log func
