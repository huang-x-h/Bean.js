/**
 * Created by huangxinghui on 2015/8/27.
 */

var Bean = require('../core');

function addExtraZero(value, num) {
  for (var i = 0; i < num; i++) {
    value += "0";
  }
  return value;
}

function formatThousands(value, thousandsSeparator) {
  var numArr = value.split("."),
      numLen = numArr[0].length,
      numSep, a, b, arr, i;

  if (numLen > 3) {
    numSep = Math.floor(numLen / 3);

    if ((numLen % 3) == 0)
      numSep--;

    b = numLen;
    a = b - 3;

    arr = [];
    for (i = 0; i <= numSep; i++) {
      arr[i] = numArr[0].slice(a, b);
      a = Math.max(a - 3, 0);
      b = Math.max(b - 3, 1);
    }

    arr.reverse();

    numArr[0] = arr.join(thousandsSeparator);
  }

  return numArr.join(".");
}

module.exports = Bean.currency = {
  parse: function(value, precision, thousandsSeparator) {
    precision = precision || '2';
    thousandsSeparator = thousandsSeparator || ',';

    value = +value.replace(new RegExp(thousandsSeparator, 'g'), '');

    return Math.round(value * Math.pow(10, precision));
  },

  format: function(value, precision, thousandsSeparator) {
    precision = precision || '2';
    thousandsSeparator = thousandsSeparator || ',';

    var result = value.toString(),
        isNegative = false,
        numArrTemp;

    if (result.match(/\d/) == null)
      return '';

    if (result.charAt(0) === '-')
      isNegative = true;

    // remove alpha
    result = result.replace(/[^\d\.]/g, '');

    // remove header zero
    result = result.replace(/0*(\d+)/, '$1');

    numArrTemp = result.split(".");
    if (numArrTemp.length > 1) {
      result = numArrTemp[0] + ".";
      var decimal = numArrTemp[1];
      var offset = precision - decimal.length;
      if (offset < 0) {
        decimal = decimal.substr(0, precision);
        result += decimal;
      } else {
        result += numArrTemp[1];
        result = addExtraZero(result, offset);
      }
    }
    else if (precision > 0) {
      result += ".";
      result = addExtraZero(result, precision);
    }

    if (thousandsSeparator)
      result = formatThousands(result, thousandsSeparator);

    return isNegative ? ("-" + result) : result;
  }
};