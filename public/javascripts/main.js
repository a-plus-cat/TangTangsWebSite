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
  glassCss['background-position'] = `23.5vw ${35 + buttonIndex * 5}vh, 20vw 36vh `;
}

// --fix---
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
      const img = $('#picBlock').get(0);
      $(img).css('background-image', `url(${e.target.result})`);
    };
    reader.readAsDataURL(input.files[0]);
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

/* text editor's functions */
// check if the selection is already added style
function checkStyle(select, cmd) {
  // only these four tag are toggle style
  if (cmd !== 'B' && cmd !== 'I' && cmd !== 'U' && cmd !== 'DEL') return false;
  /*
    main concept :
    compare the character count of first selection
    with the character count of those wrapped by
    specified tag.
    If both are the same, then return true
    otherwise return false
  */
  const range = select.getRangeAt(0);
  let start = range.startContainer;
  let end = range.endContainer;
  let startIndex = range.startOffset;
  let endIndex = range.endOffset;
  let textCount = range.toString().length;
  let count = 0;
  let temp;

  // there is no selection
  if (range.collapsed) return false;

  // for firefox => reset the range start to more precise position
  if (startIndex === start.length) {
    temp = start;
    while (!temp.nextSibling) temp = temp.parentNode;
    temp = temp.nextSibling;
    while (temp.textContent === '') temp = temp.nextSibling;
    while (temp.nodeType !== 3) temp = temp.firstChild;
    start = temp;
    startIndex = 0;
  }

  // for firefox => reset the range end to more precise position
  if (endIndex === 0) {
    temp = end;
    while (!temp.previousSibling) temp = temp.parentNode;
    temp = temp.previousSibling;
    while (temp.textContent === '') temp = temp.previousSibling;
    while (temp.nodeType !== 3) temp = temp.lastChild;
    end = temp;
    endIndex = end.length;
  }

  const newRange = document.createRange();
  newRange.setStart(start, startIndex);
  newRange.setEnd(end, endIndex);
  const selectNodes = newRange.cloneContents().childNodes;
  let s = 0;
  let e = selectNodes.length;

  // upward comfirm : check if there is one ancestor which is exactly the specified element
  if (!$(start).parents(cmd).length) return false;
  temp = $(start).parents(cmd);
  if (temp[0].contains(end)) return true;
  textCount -= selectNodes[s].textContent.length;
  s = 1;
  if (!$(end).parents(cmd).length) return false;
  if (start !== end) textCount -= selectNodes[e - 1].textContent.length;
  e -= 1;

  // downward comfirm : check if there is one descendant which is exactly the specified element
  for (let i = s; i < e && count !== textCount; i += 1) {
    if (selectNodes[i].tagName === cmd) count += selectNodes[i].textContent.length;
    else {
      const elem = $(selectNodes[i]).find(cmd);
      if (!elem.length) return false;
      for (let j = 0; j < elem.length; j += 1) count += elem[j].textContent.length;
    }
  }

  if (count !== textCount) return false;
  return true;
}

// add style to the selection
function addStyle(subRange, cmd, prop, value) {
  let oriContent;
  if (subRange.startContainer === subRange.endContainer
      && subRange.startContainer.nodeType !== 3) oriContent = subRange.startContainer;
  else {
    oriContent = subRange.extractContents();
  }
  let newEle = document.createElement(cmd);

  // set new element's style
  if (prop) $(newEle).css(prop, value);

  // set new element's content
  $(newEle).html(oriContent);

  // remove old style setting by unwrapping the tag
  if (cmd !== 'SPAN') {
    $(newEle).find(cmd).contents().unwrap();
    newEle.normalize();
  } else {
    $(newEle).find(cmd).css(prop, '');
    $(newEle)
      .find(cmd)
      .filter("[style='']")
      .contents()
      .unwrap();
    newEle.normalize();
  }

  // insert new element to original position
  subRange.insertNode(newEle);

  let newEP = newEle.parentNode;
  const newEPC = newEP.childNodes;

  // remove empty element/text node
  for (let i = 0; i < newEPC.length; i += 1) {
    if (newEPC[i].textContent === '') {
      newEP.removeChild(newEPC[i]);
    }
  }

  const previous = newEle.previousSibling;
  const after = newEle.nextSibling;
  let parEquCmd = false;

  // find out the tag whose name is the same as cmd
  while (!$(newEP).is('div')) {
    if ($(newEP).is(cmd)) {
      parEquCmd = true;
      break;
    }
    newEP = newEP.parentNode;
  }

  // simplify complexity of html(reduce unnecessary tag)
  // if the style of parent can already cover to newEle
  if (parEquCmd) {
    if (!prop || newEP.style[prop] === value) {
      const tempP = newEle.parentNode;
      $(newEle).contents().unwrap();
      tempP.normalize();
    }
  }

  // if the style of previous sibling can already cover to newEle
  if (previous && $(previous).is(cmd)) {
    if (!prop || previous.style[prop] === value) {
      previous.appendChild(newEle);
      $(newEle).contents().unwrap();
      previous.normalize();
      newEle = previous;
    }
  }

  // if the style of next sibling can already cover to newEle
  if (after && $(after).is(cmd)) {
    if (!prop || after.style[prop] === value) {
      after.insertBefore(newEle, after.firstChild);
      $(newEle).contents().unwrap();
      after.normalize();
    }
  }
  // alert($('#writeField').html());
}

// remove style from the selection
function removeStyle(range, cmd) {
  // remove the particular tag or all of tag('*')
  // eslint-disable-next-line no-unneeded-ternary
  const rmStyle = cmd ? cmd : '*';
  let target;
  let virtualTag = false;
  /*
    If the range contains only one element, just put a pointer(target)
    on it, else wrap it/them by a span or particular tag(virtualTag),
    and also put a pointer(target) on it.
  */
  if (range.startContainer === range.endContainer && range.startContainer.nodeType !== 3) {
    target = range.startContainer;
  } else {
    if (!cmd) target = document.createElement('span');
    else target = document.createElement(rmStyle);
    const oriC = range.extractContents();
    $(target).html(oriC);
    range.insertNode(target);
    virtualTag = true;
    const pChildren = target.parentNode.childNodes;
    // remove empty element/text node
    for (let i = 0; i < pChildren.length; i += 1) {
      if (pChildren[i].textContent === '') {
        target.parentNode.removeChild(pChildren[i]);
      }
    }
  }

  let targetP = target.parentNode;
  let finishLoop = false;
  const rmObj = $(target).find(rmStyle).not('blockquote');

  // remove all/those particular tags inside target
  if (rmObj.length) {
    rmObj.contents().unwrap();
    target.normalize();
    if (rmStyle !== '*') {
      if (virtualTag) $(target).contents().unwrap();
      return;
    }
  }

  // check if the particular tag is one of target's parent node
  if (rmStyle !== '*' && !$(target).parents(rmStyle).length) {
    if (virtualTag || target.nodeName === rmStyle) {
      $(target).contents().unwrap();
    }
    return;
  }

  /*
    unwrap target's particular/all tag
    main concept :
    1. divide the directly parent of target into three parts
       (previousSiblings target nextSiblings)
    2. wrap previous, next and target(parent tag isn't equal to rmStyle)
    3. unwrap parent tag
    4. continue run step 1~3 until parent's tag is div
  */
  while (!finishLoop) {
    if (rmStyle !== '*' && targetP.nodeName === rmStyle) {
      finishLoop = true;
    }
    if (targetP.nodeName === 'DIV' || targetP.nodeName === 'BLOCKQUOTE') break;

    let wrap;
    let ptr;
    if (target.previousSibling) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      ptr = targetP.firstChild;
      while (ptr !== target) {
        ptr = ptr.nextSibling;
        wrap.appendChild(ptr.previousSibling);
      }
      targetP.insertBefore(wrap, target);
    }

    if (rmStyle !== '*' && targetP.nodeName !== rmStyle) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      $(target).wrapInner(wrap);
    }

    if (target.nextSibling) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      ptr = target.nextSibling;
      while (ptr) {
        const temp = ptr.nextSibling;
        wrap.appendChild(ptr);
        ptr = temp;
      }
      targetP.appendChild(wrap);
    }

    const nextParent = targetP.parentNode;
    $(targetP).contents().unwrap();
    targetP = nextParent;
  }

  // unwrap target's tag if necessary
  if (rmStyle === '*' || target.nodeName === rmStyle) $(target).contents().unwrap();
}

// change style of the selection
function changeStyle(cmd, prop, value) {
  const area = $('#writeField').get(0);
  const select = window.getSelection();
  // check the selection is style toggling or not
  const isToggle = checkStyle(select, cmd);

  for (let i = 0; i < select.rangeCount; i += 1) {
    const range = select.getRangeAt(i);
    let current = range.startContainer;
    let startIndex = range.startOffset;
    let endEle = range.endContainer;
    let endIndex = range.endOffset;
    let atEnd = false;
    let finish = false;

    // there is no selection
    if (range.collapsed) break;
    // check if the selection is inside contenteditable area
    if (!area.contains(current) || !area.contains(endEle)) continue;

    // for firefox => reset the range end to more precise position
    if (endIndex === endEle.textContent.length) atEnd = true;
    if (endIndex === 0) {
      if (!endEle.previousSibling) atEnd = true;
      while (!endEle.previousSibling) endEle = endEle.parentNode;
      endEle = endEle.previousSibling;
      endIndex = endEle.nodeName === '#text' ? endEle.length : endEle.childNodes.length;
    }

    // for firefox => reset the range start to more precise position
    if (startIndex === current.length) {
      while (!current.nextSibling) current = current.parentNode;
      current = current.nextSibling;
      startIndex = 0;
    }

    /*
      adjust range start/end to a better position
      What is better : if start/end points to a nested element, it is better to point outermost tag
      Why need better : convenient for DOM traveling, avoid to add redundant tags
    */
    // top down movement
    while (current.contains(endEle) && current !== endEle) current = current.firstChild;
    while (endEle.contains(current) && current !== endEle) {
      endEle = endEle.lastChild;
      endIndex = endEle.nodeName === '#text' ? endEle.length : endEle.childNodes.length;
    }

    // bottom up movement
    // eslint-disable-next-line max-len
    while (!startIndex && !current.parentNode.previousSibling && !current.parentNode.contains(endEle)) {
      if (current.parentNode.nodeName !== 'DIV' && current.parentNode.nodeName !== 'BLOCKQUOTE') {
        current = current.parentNode;
      } else break;
    }
    while (atEnd && !endEle.parentNode.nextSibling && !endEle.parentNode.contains(current)) {
      if (endEle.parentNode.nodeName !== 'DIV' && endEle.parentNode.nodeName !== 'BLOCKQUOTE') {
        endEle = endEle.parentNode;
        endIndex = endEle.childNodes.length;
      } else break;
    }
    while (current.parentNode.nodeName !== 'DIV' && current.parentNode.nodeName !== 'BLOCKQUOTE') {
      if (current.parentNode === endEle.parentNode && !startIndex && atEnd) {
        current = current.parentNode;
        endEle = current;
        endIndex = endEle.childNodes.length;
      } else break;
    }

    // change style for range part by part
    while (!finish) {
      const parent = current.parentNode;
      const previous = current.previousSibling;
      const subRange = document.createRange();

      // set the subRange by choosing all siblings of current(element/text node)
      subRange.setStart(current, startIndex);
      while (current.nextSibling && !current.contains(endEle)) {
        current = current.nextSibling;
      }

      // set the subRange's end and set current to the next subRange's start
      if (current.contains(endEle)) {
        if (current === endEle) {
          finish = true;
          subRange.setEnd(endEle, endIndex);
        } else {
          const p = current.previousSibling;
          subRange.setEnd(p, p.nodeName === '#text' ? p.textContent.length : p.childNodes.length);
          while (current.contains(endEle) && current !== endEle) current = current.firstChild;
        }
      } else {
        subRange.setEnd(current, current.nodeName === '#text' ? current.textContent.length : current.childNodes.length);
        while (!current.nextSibling) current = current.parentNode;
        current = current.nextSibling;
        // while (current.nodeName === 'BLOCKQUOTE') current = current.firstChild;
        while (current.nodeName === 'DIV' || current.nodeName === 'BLOCKQUOTE') current = current.firstChild;
        while (current.contains(endEle) && current !== endEle) current = current.firstChild;
      }

      /* determine to add/remove style according to the status of the parameter(cmd)
         and the flag(isToggle) */
      if (!cmd) removeStyle(subRange);
      else {
        // eslint-disable-next-line no-lonely-if
        if (isToggle) removeStyle(subRange, cmd);
        else addStyle(subRange, cmd, prop, value);
      }

      startIndex = 0;
    } // end while
  } // end for
  // alert($('#writeField').html());
}
