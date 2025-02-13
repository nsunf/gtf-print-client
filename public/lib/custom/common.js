function formatBuySerialNo(_buySerialNo) {
  if (_buySerialNo.length === 20) {
    const n1 = _buySerialNo.substring(0, 2);
    const n2 = _buySerialNo.substring(2, 7);
    const n3 = _buySerialNo.substring(7, 12);
    const n4 = _buySerialNo.substring(12, 14);
    const n5 = _buySerialNo.substring(14, 20);
    return `${n1}-${n2}-${n3}-${n4}-${n5}`;
  } else {
    return _buySerialNo;
  }
}

function formatBizPermitNo(_bizPermitNo) {
  if (_bizPermitNo.length === 10) {
    const n1 = _bizPermitNo.substring(0, 3);
    const n2 = _bizPermitNo.substring(3, 5);
    const n3 = _bizPermitNo.substring(5, 10);
    return `${n1}-${n2}-${n3}`;
  } else {
    return _bizPermitNo;
  }
}

function formatDate(_dateStr, _delimiter) {
  let delimiter = _delimiter;
  if (delimiter == null || delimiter == undefined)
    delimiter = '/';

  if (_dateStr.length == 8) {
    const yyyy = _dateStr.substring(0, 4);
    const mm = _dateStr.substring(4, 6);
    const dd = _dateStr.substring(6, 8);
    return `${yyyy}${delimiter}${mm}${delimiter}${dd}`;
  } else if (_dateStr.length == 6) {
    const yy = _dateStr.substring(0, 2);
    const mm = _dateStr.substring(2, 4);
    const dd = _dateStr.substring(4, 6);
    let yyyy;
    if (parseInt(yy) >= 50)
      yyyy = '19' + yy;
    else
      yyyy = '20' + yy;
    
    return `${yyyy}${delimiter}${mm}${delimiter}${dd}`;
  } else {
    return _dateStr;
  }
}

function formatTime(_timeStr) {
  if (_timeStr.length == 6) {
    const hh = _timeStr.substring(0, 2);
    const mm = _timeStr.substring(2, 4);
    const ss = _timeStr.substring(4, 6);

    return `${hh}:${mm}:${ss}`;
  } else {
    return _timeStr;
  }
}

function formatDateTime(_dateTimeStr) {
  if (_dateTimeStr.length == 14) {
    const dateStr = formatDate(_dateTimeStr.substring(0, 8));
    const timeStr = formatTime(_dateTimeStr.substring(8, 14));
    return `${dateStr} ${timeStr}`;
  } else if (_dateTimeStr.length == 12) {
    const dateStr = formatDate(_dateTimeStr.substring(0, 6));
    const timeStr = formatTime(_dateTimeStr.substring(6, 12));
    return `${dateStr} ${timeStr}`;
  } else {
    return _dateTimeStr;
  }
}

function formatNumber(_num) {
  const num = typeof _num === 'number' ? _num : parseFloat(_num);

  if (isNaN(num))
    return _num;

  return num.toLocaleString();
}

function getByteLengthMS949(str) {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    bytes = bytes + (code <= 0x7F ? 1 : 2);
  }

  return bytes;
}

String.prototype.padEnd949 = function(fullSize, replaceText) {
  let padString = replaceText ?? ' ';
  let plainText = this.toString() ?? '';

  let dataSize = getByteLengthMS949(plainText);

  if (dataSize >= fullSize) {
    plainText = plainText.substring(0, 10).trim();
    dataSize = getByteLengthMS949(plainText);
  }

  let fillSize = fullSize - dataSize;
  let fillString = padString.repeat(fillSize);

  return plainText + fillString;
}

String.prototype.padStart949 = function(fullSize, replaceText) {
  const padString = replaceText ?? ' ';
  let plainText = this.toString() ?? '';

  let dataSize = getByteLengthMS949(plainText);

  if (dataSize >= fullSize) {
    plainText = plainText.substring(0, 10).trim();
    dataSize = getByteLengthMS949(plainText);
  }

  const fillSize = fullSize - dataSize;
  const fillString = padString.repeat(fillSize);

  return fillString + plainText;
};