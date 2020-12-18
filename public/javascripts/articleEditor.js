/* eslint-disable no-alert */
/* eslint-disable quote-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-lonely-if */
/* eslint-disable no-continue */
/* eslint-disable no-undef */

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
    else if ((range.endOffset - range.startOffset) === 1) {
      target = $(range.startContainer).contents().get(range.startOffset);
    } else {
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

    // adjust range for not manual selection
    if (current.nodeType === 1 && startIndex !== current.textContent.length) {
      current = $(current).contents().length !== startIndex
        ? $(current).contents().get(startIndex) : current.nextSibling;
      startIndex = 0;
    }
    if (endEle.nodeType === 1 && endIndex !== 0) {
      endEle = $(endEle).contents().get(endIndex - 1);
      endIndex = endEle.nodeType === 3 ? endEle.length : endEle.childNodes.length;
    }

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
    let sc; let so; let ec; let eo;

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
          sc = [sc, current.nodeType === 3 && startIndex
            ? $(sc).contents().index(current) + 1 : $(sc).contents().index(current)];
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

    // change style for range part by part
    while (!finish) {
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
        while (current.nodeName === 'DIV') current = current.firstChild;
        while (current.contains(endEle) && current !== endEle) current = current.firstChild;
      }

      if (subRange.endContainer !== endEle) endLength -= subRange.toString().length;

      if (subRange.startContainer.nodeName === 'IMG') {
        subRange.setStart(subRange.startContainer.parentNode,
          $(subRange.startContainer.parentNode).contents().index(subRange.startContainer));
      }
      if (subRange.endContainer.nodeName === 'IMG') {
        subRange.setEnd(subRange.endContainer.parentNode,
          $(subRange.endContainer.parentNode).contents().index(subRange.endContainer) + 1);
      }

      /* determine to add/remove style according to the status of the parameter(cmd)
         and the flag(isToggle) */
      if (!cmd) removeStyle(subRange);
      else if (isToggle) removeStyle(subRange, cmd);
      else addStyle(subRange, cmd, prop, value);

      startIndex = 0;
    } // end while

    // preserve selection after content modified
    const reselectModify = document.createRange();
    let defaultSc = range.startContainer;
    const defaultEc = range.endContainer;
    let defaultSo = range.startOffset;
    const defaultEo = range.endOffset;

    if (cmd && !isToggle) {
      const renewSc = mergeBefore ? $(sc[0]).contents().get(sc[1]) : sc;
      const renewEc = mergeBehind ? $(ec[0]).contents().get(ec[1]) : ec;
      reselectModify.setStart(renewSc, so);
      reselectModify.setEnd(renewEc, eo);
    } else {
      if (defaultSc.nodeType === 3 && defaultSo === defaultSc.length) {
        let temp = defaultSc;
        while (!temp.nextSibling) temp = temp.parentNode;
        defaultSc = temp.nextSibling;
        defaultSo = 0;
      }

      const startPtr = defaultSc.nodeType === 1
        ? $(defaultSc).contents().get(defaultSo) : defaultSc;
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
}

function populateContent() {
  if (!$('#writeField').html()) {
    $('#emptyAlert').html('<b>文章尚未填寫!!!</b>');
    $('#alert').modal('show');
    return false;
  }
  // populate the textarea with user's edited content
  $('#article').val($('#writeField').html());
  return true;
}

$(document).ready(function () {
  let fontColorValue = null;
  let bgColorValue = null;
  let fontSizeValue = null;
  let insertImgSrc = '';

  function findSelectIndex(range) {
    const childList = $('#writeField').children();
    let s = null;
    let e = null;
    for (let i = 0; i < childList.length; i += 1) {
      if (childList[i].contains(range.startContainer)) {
        s = i;
      }
      if (childList[i].contains(range.endContainer)) {
        e = i;
        break;
      }
    }
    return { startIndex: s, endIndex: e };
  }

  function moveContent(method, value) {
    const select = window.getSelection();
    const rangeArr = [];
    let startIndex;
    let endIndex;
    const temp = $('#writeField').contents();

    if (temp[0].nodeName !== 'DIV' && temp[0].nodeName !== 'P') {
      for (let i = 0; i < select.rangeCount; i += 1) {
        const oriRange = select.getRangeAt(i);
        rangeArr.push({
          sc: oriRange.startContainer,
          so: oriRange.startOffset,
          ec: oriRange.endContainer,
          eo: oriRange.endOffset,
        });
      }
    }

    for (let i = 0; i < select.rangeCount; i += 1) {
      const range = select.getRangeAt(i);
      const childList = $('#writeField').contents();

      if (childList[0].nodeName !== 'DIV' && childList[0].nodeName !== 'P') {
        $('#writeField').contents().wrapAll('<div></div>');

        // restore selection
        select.removeAllRanges();
        for (let x = 0; x < rangeArr.length; x += 1) {
          const restoreRg = document.createRange();
          restoreRg.setStart(
            rangeArr[x].sc.nodeName === 'DIV' ? rangeArr[x].sc.firstChild : rangeArr[x].sc,
            rangeArr[x].so
          );
          restoreRg.setEnd(
            rangeArr[x].ec.nodeName === 'DIV' ? rangeArr[x].ec.firstChild : rangeArr[x].ec,
            rangeArr[x].eo
          );
          select.addRange(restoreRg);
        }
        i = -1;
        continue;
      } else {
        const indexs = findSelectIndex(range);
        if (endIndex === indexs.endIndex) continue;
        if (endIndex === indexs.startIndex) startIndex = indexs.startIndex + 1;
        else startIndex = indexs.startIndex;
        endIndex = indexs.endIndex;
      }

      for (let j = startIndex; j <= endIndex; j += 1) {
        if (method === 'indent') {
          if (value) $(childList[j]).css('margin-left', '+=32');
          else {
            $(childList[j]).css('margin-left')[0] !== '0'
              ? $(childList[j]).css('margin-left', '-=32') : $(childList[j]).css('margin-left', '');
          }
        } else $(childList[j]).css('text-align', value);
      }
    }
  }

  function setSize() {
    fontSizeValue = $(this).css('font-size');
    $('.sizeVal div').css('border', 'none');
    $(this).css('border', '1px solid red');
  }

  function setColor() {
    const color = $(this).text();
    if ($(this).parent().parent().attr('id') === 'font') {
      fontColorValue = color;
    } else bgColorValue = color;
    $(this).parents().eq(2).css('background-color', color);
  }

  function editStyle() {
    switch ($(this).attr('id')) {
      case 'imgInsert':
        insertImgSrc = '';
        $('.previewImg').css('background-image', 'none');
        $('#insertImg').attr('value', '');
        $('#imgUpload').modal('show');
        break;
      case 'indent':
        moveContent('indent', true);
        break;
      case 'unIndent':
        moveContent('indent', false);
        break;
      case 'left':
        moveContent('align', 'left');
        break;
      case 'center':
        moveContent('align', 'center');
        break;
      case 'right':
        moveContent('align', 'right');
        break;
      case 'size':
        if (fontSizeValue) changeStyle('SPAN', 'font-size', fontSizeValue);
        break;
      case 'bold':
        changeStyle('B');
        break;
      case 'italic':
        changeStyle('I');
        break;
      case 'underLine':
        changeStyle('U');
        break;
      case 'deleteLine':
        changeStyle('DEL');
        break;
      case 'fontColor':
        if (fontColorValue) changeStyle('SPAN', 'color', fontColorValue);
        break;
      case 'bgColor':
        if (bgColorValue) changeStyle('SPAN', 'background-color', bgColorValue);
        break;
      case 'rmStyle':
        changeStyle();
        break;
      default:
        break;
    }
  }

  function BtnClickStyle(element, c, b, p) {
    const btn = $(element).parents('.fontStyleBtn');
    let color;
    if (element.id === 'fontColor') color = fontColor;
    else if (element.id === 'bgColor') color = bgColor;
    else color = c;
    $(btn).css({
      'background-color': color,
      'border': b,
      'padding': p
    });
  }

  function previewImg() {
    if (this.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        insertImgSrc = e.target.result;
        $('.previewImg').css({
          'background-image': `url(${insertImgSrc})`,
          'background-repeat': 'no-repeat',
          'background-position': 'center center',
          'background-size': 'auto 100%'
        });
      };
      reader.readAsDataURL(this.files[0]);
    }
  }

  function insertImg() {
    if (insertImgSrc) {
      // set insertImg name
      const now = new Date();
      const imgName = `${memberName}-${now.valueOf()}`;
      $('#imgName').val(imgName);

      const form = $('#insertImgUpload');
      const formData = new FormData(form.get(0));
      const route = form.attr('action');

      // upload img inserted in article
      $.ajax({
        method: 'POST',
        type: 'POST',
        url: route,
        contentType: false,
        cache: false,
        processData: false,
        data: formData
      })
        .done(function (data) {
          // upload wrong format of img
          if (!data) {
            alert('錯誤的圖片格式檔案!!!');
            return;
          }

          const insert = document.createElement('img');
          insert.src = `/publishArticle/insertImg/${imgName}`;
          $(insert).css({
            'max-width': '100%',
            'max-height': '100%',
          });

          // insert img at the position of caret
          const select = window.getSelection();
          const range = select.getRangeAt(0);
          const content = $('#writeField').contents();
          const parent = $('#writeField').get(0);

          if (parent.contains(range.startContainer) && parent.contains(range.endContainer)) {
            range.deleteContents();
            range.insertNode(insert);
          } else $('#writeField').append(insert);
        })
        .fail(function () {
          alert('圖片上傳失敗 請重新嘗試!!!');
        });
    }
  }

  if (alreadyStore) {
    $('#category').val(articleJS.category);
    $('#writeField').html(articleJS.content);
  }

  if ($('#emptyAlert').text()) $('#alert').modal('show');
  $('[data-toggle="tooltip"]').tooltip({ placement: 'top', trigger: 'focus' });
  $('.sizeVal div').on('click', setSize);
  $('.colorPlate li').on('click', setColor);
  $('.fontStyleBtn img').on('click', editStyle);
  $('.fontStyleBtn img').on('mousedown', function (event) {
    BtnClickStyle(event.target, '#b3b0ac', '0.2rem inset #aaa7a3', '0.1rem');
  });
  $('.fontStyleBtn img').on('mouseup', function (event) {
    BtnClickStyle(event.target, '', '0.3rem outset #cac9c7', '');
  });
  $('#insertImg').on('change', previewImg);
  $('#insertComfirm').on('click', insertImg);
});
