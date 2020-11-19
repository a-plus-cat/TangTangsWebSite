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

  const range = select.getRangeAt(0);
  // there is no selection
  if (range.collapsed) return false;

  if (range.startContainer === range.endContainer && range.startContainer.nodeType === 1) {
    if ($(range.startContainer).find('img').length === range.endOffset - range.startOffset) {
      return !!$(range.startContainer).find(cmd).length;
    }
  }

  /*
    main concept :
    compare the character count of first selection
    with the character count of those wrapped by
    specified tag.
    If both are the same, then return true
    otherwise return false
  */

  const content = range.cloneContents().childNodes;
  const textCount = range.toString().length;
  const commonAnc = range.commonAncestorContainer;
  let styleTextCount = 0;

  if (commonAnc.nodeName !== 'DIV') {
    if (commonAnc.nodeName === cmd || $(commonAnc).parents(cmd).length) return true;
  }

  for (let i = 0; i < content.length; i += 1) {
    if (content[i].nodeName === cmd) styleTextCount += content[i].textContent.length;
    else {
      const styleText = $(content[i]).find(cmd);
      for (let j = 0; j < styleText.length; j += 1) {
        styleTextCount += styleText.get(j).textContent.length;
      }
    }
  }

  if (styleTextCount === textCount) return true;
  return false;
}

// add style to the selection
function addStyle(subRange, cmd, prop, value) {
  if (subRange.startContainer === subRange.endContainer) {
    if ($(subRange.startContainer).is(cmd)) {
      if (!prop || subRange.startContainer.style[prop] === value) return false;
    }
  }
  // find out the ancestors' tag whose name is the same as cmd
  let ancestor = subRange.startContainer.parentNode;
  while (!$(ancestor).is('div')) {
    if ($(ancestor).is(cmd)) {
      if (!prop || ancestor.style[prop] === value) return false;
    }
    ancestor = ancestor.parentNode;
  }

  // set wrap element for adding new style
  let newEle = document.createElement(cmd);
  if (prop) $(newEle).css(prop, value);
  if (subRange.startContainer === subRange.endContainer
    && subRange.startContainer.nodeType === 1
    && subRange.startContainer.nodeName !== 'DIV') {
    const wrapContent = subRange.startContainer;
    $(wrapContent).wrap(newEle);
    newEle = wrapContent.parentNode;
  } else {
    $(newEle).html(subRange.extractContents());
    subRange.insertNode(newEle);
  }

  // remove old style inside selection by unwrapping the tag
  if (cmd !== 'SPAN') {
    $(newEle).find(cmd).contents().unwrap();
    // newEle.normalize();
  } else {
    $(newEle)
      .find(cmd)
      .filter(`[style='${prop}: ${value};']`)
      .contents()
      .unwrap();
    // newEle.normalize();
  }

  // remove empty element/text node
  const newEP = newEle.parentNode;
  let ptr = newEP.firstChild;
  while (ptr) {
    const next = ptr.nextSibling;
    if (ptr.textContent === '' && ptr.nodeName !== 'IMG') {
      if (!$(ptr).find('*').is('img')) newEP.removeChild(ptr);
    }
    ptr = next;
  }

  const previous = newEle.previousSibling;
  const after = newEle.nextSibling;

  // if the style of previous sibling can already cover to newEle
  if (previous && $(previous).is(cmd)) {
    if (!prop || previous.style[prop] === value) {
      previous.appendChild(newEle);
      $(newEle).contents().unwrap();
      // previous.normalize();
      newEle = previous;
    }
  }

  // if the style of next sibling can already cover to newEle
  if (after && $(after).is(cmd)) {
    if (!prop || after.style[prop] === value) {
      after.insertBefore(newEle, after.firstChild);
      $(newEle).contents().unwrap();
      // after.normalize();
    }
  }
  return true;
  // alert($('#writeField').html());
}

// remove style from the selection
function removeStyle(range, cmd) {
  // remove the particular tag or all of tag('*')
  const rmStyle = cmd || '*';
  let target;
  const contentNum = range.cloneContents().childNodes.length;
  let checkPtr = range.startContainer.nodeName === 'DIV' ? $(range.startContainer).contents().get(range.startOffset) : range.startContainer;

  let noNeedRm;
  for (let i = 0; i < contentNum; i += 1) {
    if ((checkPtr.nodeType === 3 || checkPtr.nodeName === 'IMG') && checkPtr.parentNode.nodeName === 'DIV') {
      noNeedRm = true;
      checkPtr = checkPtr.nextSibling;
    } else {
      noNeedRm = false;
      break;
    }
  }
  if (noNeedRm) return;

  /*
    If the range contains only one element, just put a pointer(target)
    on it, else wrap it/them by a span or particular tag(rmStyle),
    and also put a pointer(target) on it.
  */
  if (range.startContainer === range.endContainer && range.startContainer.nodeType !== 3) {
    if (range.startContainer.nodeName !== 'DIV') target = range.startContainer;
    else if ((range.endOffset - range.startOffset) === 1) target = $(range.startContainer).contents().get(range.startOffset);
    else {
      target = !cmd ? document.createElement('span') : document.createElement(rmStyle);
      $(target).html(range.extractContents());
      range.insertNode(target);
    }
  } else {
    target = !cmd ? document.createElement('span') : document.createElement(rmStyle);
    $(target).html(range.extractContents());
    range.insertNode(target);
  }

  // remove empty element/text node
  let targetP = target.parentNode;
  let ptr = targetP.firstChild;

  while (ptr) {
    const next = ptr.nextSibling;
    if (ptr.textContent === '' && ptr.nodeName !== 'IMG') {
      if (!$(ptr).find('*').is('img')) targetP.removeChild(ptr);
    }
    ptr = next;
  }

  let finishLoop = false;
  const rmObj = $(target).find(rmStyle);

  // remove all/those particular tags inside target
  if (rmObj.length) {
    rmObj.contents().unwrap();
    // target.normalize();
    if (rmStyle !== '*') finishLoop = true;
  } else if (rmStyle !== '*' && !$(target).parents(rmStyle).length) {
    finishLoop = true;
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
    if (targetP.nodeName === 'DIV') break;

    let wrap;
    if (target.previousSibling) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      const prePart = document.createRange();
      prePart.setStart(targetP, 0);
      prePart.setEndBefore(target);
      prePart.surroundContents(wrap);
      prePart.detach();
    }

    if (rmStyle !== '*' && targetP.nodeName !== rmStyle) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      $(target).wrapInner(wrap);
    }

    if (target.nextSibling) {
      wrap = document.createElement(targetP.nodeName);
      if (targetP.style.cssText) wrap.style.cssText = targetP.style.cssText;
      const nextPart = document.createRange();
      nextPart.setStartAfter(target);
      nextPart.setEnd(targetP, $(targetP).contents().length);
      nextPart.surroundContents(wrap);
      nextPart.detach();
    }
    const nextParent = targetP.parentNode;
    $(targetP).contents().unwrap();
    targetP = nextParent;
  }

  // unwrap target's tag if necessary
  if (rmStyle === '*' || target.nodeName === rmStyle) {
    $(target).contents().unwrap();
    // targetP.normalize();
  }
}

// change style of the selection
function changeStyle(cmd, prop, value) {
  const area = $('#writeField').get(0);
  const select = window.getSelection();
  // check the selection is style toggling or not
  const isToggle = checkStyle(select, cmd);
  const selectStore = [];

  for (let i = 0; i < select.rangeCount; i += 1) {
    const range = select.getRangeAt(i);
    const rangeLength = range.toString().length;
    let endLength = rangeLength;
    let current = range.startContainer;
    let startIndex = range.startOffset;
    let endEle = range.endContainer;
    let endIndex = range.endOffset;
    let atEnd = false;
    let finish = false;
    let mergeBefore = false;
    let mergeBehind = false;
    // let selectFull = false;

    // there is no selection
    if (range.collapsed) break;

    // check if the selection is inside contenteditable area
    if (!area.contains(current) || !area.contains(endEle)) continue;

    // alert(`B1-${current.nodeName}-${current.textContent}--${startIndex}`);
    // alert(`B2-${endEle.nodeName}-${endEle.textContent}--${endIndex}`);

    // adjust range for not manual selection
    if (current.nodeType === 1 && startIndex !== current.textContent.length) {
      current = $(current).contents().length !== startIndex ? $(current).contents().get(startIndex) : current.nextSibling;
      startIndex = 0;
    }
    if (endEle.nodeType === 1 && endIndex !== 0) {
      endEle = $(endEle).contents().get(endIndex - 1);
      endIndex = endEle.nodeType === 3 ? endEle.length : endEle.childNodes.length;
    }

    // alert(`B3-${current.nodeName}-${current.textContent}--${startIndex}`);
    // alert(`B4-${endEle.nodeName}-${endEle.textContent}--${endIndex}`);

    // reset the range end to more precise position
    if (endEle.nodeType === 1 && endIndex && endIndex === endEle.childNodes.length) atEnd = true;
    if (endEle.nodeName === 'IMG') atEnd = true;
    if (endEle.nodeType === 3 && endIndex === endEle.length) atEnd = true;
    if (endIndex === 0 && endEle.nodeName !== 'IMG') {
      atEnd = true;
      while (!endEle.previousSibling) endEle = endEle.parentNode;
      endEle = endEle.previousSibling;
      endIndex = endEle.nodeName === '#text' ? endEle.length : endEle.childNodes.length;
    }

    // reset the range start to more precise position
    if (startIndex && startIndex === current.length) {
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
      endEle = $(endEle).contents().get(endIndex - 1);
      endIndex = endEle.nodeName === '#text' ? endEle.length : endEle.childNodes.length;
    }

    // bottom up movement
    while (!startIndex && !current.previousSibling && !current.parentNode.contains(endEle)) {
      if (current.parentNode.nodeName !== 'DIV') current = current.parentNode;
      else break;
    }

    while (atEnd && !endEle.nextSibling && !endEle.parentNode.contains(current)) {
      if (endEle.parentNode.nodeName !== 'DIV') {
        endEle = endEle.parentNode;
        endIndex = endEle.childNodes.length;
      } else break;
    }
    while (current.parentNode.nodeName !== 'DIV') {
      const cond1 = current.parentNode === endEle.parentNode;
      const cond2 = !startIndex && !current.previousSibling;
      const cond3 = atEnd && !endEle.nextSibling;
      if (cond1 && cond2 && cond3) {
        current = current.parentNode;
        endEle = current;
        endIndex = endEle.childNodes.length;
      } else break;
    }

    // preserve selection
    let sc; let so; let ec; let eo; let tempContainer;

    if (cmd && !isToggle) { // for adding style
      const preC = current.previousSibling;
      const nextE = endEle.nextSibling;
      const c1 = preC ? cmd === preC.nodeName : false;
      const c2 = nextE ? cmd === nextE.nodeName : false;
      const c3 = preC && preC.nodeType === 1 ? (!prop || preC.style[prop] === value) : false;
      const c4 = nextE && nextE.nodeType === 1 ? (!prop || nextE.style[prop] === value) : false;
      sc = current.parentNode;
      ec = endEle.parentNode;

      if (sc === ec) { // start and end are both in the same level
        if (!startIndex && c1 && c3) { // merge to the node before current
          mergeBefore = true;
          sc = [sc, $(sc).contents().index(preC)];
          so = preC.childNodes.length;
          mergeBehind = true; // not really mean merge but for the same format of sc and ec
        } else if (atEnd && c2 && c4) { // merge to the node behind endEle
          mergeBehind = true;
          sc = [sc, current.nodeType === 3 && startIndex ? $(sc).contents().index(current) + 1 : $(sc).contents().index(current)];
          so = 0;
          mergeBefore = true; // not really mean merge but for the same format of sc and ec
        } else { // no merge
          so = startIndex ? $(sc).contents().index(current) + 1 : $(sc).contents().index(current);
        }
        ec = sc;
        let count = 1;
        if (mergeBefore || mergeBehind) {
          let tempPtr = current;
          while (tempPtr !== endEle) {
            count += 1;
            tempPtr = tempPtr.nextSibling;
          }
        }
        eo = so + count;
      } else { // start and end are in different level
        if (!startIndex && c1 && c3) { // merge to the node before current
          mergeBefore = true;
          sc = [preC.parentNode, $(preC.parentNode).contents().index(preC)];
          so = preC.childNodes.length;
        } else {
          so = startIndex ? $(sc).contents().index(current) + 1 : $(sc).contents().index(current);
        }
        if (atEnd && c2 && c4) { // merge to the node behind endEle
          ec = nextE.firstChild;
          eo = 0;
        } else {
          if (($(endEle).parents().is(cmd) && (!prop || $(endEle).parents('span').filter(`[style="${prop}: ${value};"]`).length))) {
            ec = endEle;
            eo = endIndex;
          } else {
            if ($(current).parents('div').get(0) === $(endEle).parents('div').get(0) && ec.contains(current)) {
              eo = $(ec).contents().index(endEle) + 1;
            } else eo = 1;
          }
        }
      }
    }

    // alert(`A1-${range.startContainer.nodeName}-${range.startContainer.textContent}--${range.startOffset}`);
    // alert(`A2-${range.endContainer.nodeName}-${range.endContainer.textContent}--${range.endOffset}`);
    // alert(isToggle);
    // alert(`B5-${current.nodeName}-${current.textContent}--${startIndex}`);
    // alert(`B6-${endEle.nodeName}-${endEle.textContent}--${endIndex}`);

    // change style for range part by part
    while (!finish) {
      const subRange = document.createRange();
      // set the subRange by choosing all siblings of current(element/text node)
      subRange.setStart(current, startIndex);

      // alert(`a-0 ${current.nodeName} +'---' + ${current.textContent}`);
      // alert(`${endEle.nodeName}--${endEle.textContent}---${endEle.parentNode.nodeName}-${endEle.parentNode.textContent}`);

      while (current.nextSibling && !current.contains(endEle)) {
        current = current.nextSibling;
      }

      // alert(`a-1 ${current.nodeName} +'---' + ${current.textContent}`);

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
        while (current.nodeName === 'DIV') current = current.firstChild;
        while (current.contains(endEle) && current !== endEle) current = current.firstChild;
      }

      if (subRange.endContainer !== endEle) endLength -= subRange.toString().length;

      if (subRange.startContainer.nodeName === 'IMG') {
        subRange.setStart(subRange.startContainer.parentNode, $(subRange.startContainer.parentNode).contents().index(subRange.startContainer));
      }
      if (subRange.endContainer.nodeName === 'IMG') {
        subRange.setEnd(subRange.endContainer.parentNode, $(subRange.endContainer.parentNode).contents().index(subRange.endContainer) + 1);
      }

      // alert(`a-2 ${current.nodeName} +'---' + ${current.textContent}`);
      // alert(`C1. ${subRange.startContainer.nodeName}-${subRange.startContainer.textContent}--${subRange.startOffset}`);
      // alert(`C2. ${subRange.endContainer.nodeName}-${subRange.endContainer.textContent}--${subRange.endOffset}`);

      /* determine to add/remove style according to the status of the parameter(cmd)
         and the flag(isToggle) */
      if (!cmd) removeStyle(subRange);
      else if (isToggle) removeStyle(subRange, cmd);
      else addStyle(subRange, cmd, prop, value);

      startIndex = 0;
    } // end while

    // alert(`D1. ${range.startContainer.nodeName}-${range.startContainer.textContent}--${range.startOffset}`);
    // alert(`D2. ${range.endContainer.nodeName}-${range.endContainer.textContent}--${range.endOffset}`);

    // preserve selection after content modified
    const reselectModify = document.createRange();
    let defaultSc = range.startContainer;
    const defaultEc = range.endContainer;
    let defaultSo = range.startOffset;
    const defaultEo = range.endOffset;

    if (cmd && !isToggle) {
      const renewSc = mergeBefore ? $(sc[0]).contents().get(sc[1]) : sc;
      const renewEc = mergeBehind ? $(ec[0]).contents().get(ec[1]) : ec;

      // alert('start' + renewSc.nodeName + '--' + renewSc.textContent + '----' + so);
      // alert('end' + renewEc.nodeName + '--' + renewEc.textContent + '----' + eo);

      reselectModify.setStart(renewSc, so);
      reselectModify.setEnd(renewEc, eo);
    } else {
      if (defaultSc.nodeType === 3 && defaultSo === defaultSc.length) {
        let temp = defaultSc;
        while (!temp.nextSibling) temp = temp.parentNode;
        defaultSc = temp.nextSibling;
        defaultSo = 0;
      }

      const startPtr = defaultSc.nodeType === 1 ? $(defaultSc).contents().get(defaultSo) : defaultSc;
      const firstHalf = document.createRange();

      if (!cmd) {
        if (startPtr.nodeType === 1 && startPtr.nodeName !== 'IMG') {
          reselectModify.setStartAfter(startPtr);
          firstHalf.setStartAfter(startPtr);
        } else {
          reselectModify.setStart(defaultSc, defaultSo);
          firstHalf.setStart(defaultSc, defaultSo);
        }
      } else {
        if (startPtr.nodeName !== cmd) {
          reselectModify.setStart(defaultSc, defaultSo);
          firstHalf.setStart(defaultSc, defaultSo);
        } else {
          reselectModify.setStartAfter(startPtr);
          firstHalf.setStartAfter(startPtr);
        }
      }

      firstHalf.setEnd(defaultEc, defaultEo);
      const firstHalfLen = firstHalf.toString().length;
      let lastHalfLen = rangeLength - firstHalfLen;
      firstHalf.detach();

      if (lastHalfLen === 0) reselectModify.setEnd(defaultEc, defaultEo);
      else {
        let rangePtr;
        let count;
        let stop = false;
        let tempP;

        if (firstHalfLen) {
          rangePtr = $(defaultEc).contents().get(defaultEo);
          count = defaultEo;
        } else {
          if (reselectModify.startContainer.nodeType === 3) {
            lastHalfLen -= (reselectModify.startContainer.length - reselectModify.startOffset);
            rangePtr = reselectModify.startContainer.nextSibling;
            count = $(rangePtr.parentNode).contents().index(rangePtr);
          } else {
            rangePtr = $(reselectModify.startContainer).contents().get(reselectModify.startOffset);
            count = reselectModify.startOffset;
          }
        }

        while (!stop) {
          while (rangePtr && lastHalfLen >= rangePtr.textContent.length) {
            lastHalfLen -= rangePtr.textContent.length;
            count += 1;
            if (!rangePtr.nextSibling) tempP = rangePtr.parentNode;
            rangePtr = rangePtr.nextSibling;
          }
          if (!rangePtr || lastHalfLen === 0 || rangePtr.nodeType === 3) stop = true;
          else {
            rangePtr = rangePtr.firstChild;
            count = 0;
          }
        }

        if (!lastHalfLen) {
          if (!rangePtr) reselectModify.setEnd(tempP, count);
          else reselectModify.setEndBefore(rangePtr);
        } else {
          reselectModify.setEnd(rangePtr, lastHalfLen);
        }
      }
    }
    selectStore.push(reselectModify);
  } // end for
  // restore selection
  select.removeAllRanges();
  for (let z = 0; z < selectStore.length; z += 1) select.addRange(selectStore[z]);
  // alert($('#writeField').html());
}
