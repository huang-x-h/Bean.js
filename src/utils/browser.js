/**
 * Created by huangxinghui on 2016/1/12.
 */

// refer to https://github.com/ded/bowser/blob/master/bowser.js
function detect(ua) {
  var result = {};

  function getFirstMatch(regex) {
    var match = ua.match(regex);
    return (match && match.length > 1 && match[1]) || '';
  }

  if (/msie|trident/i.test(ua)) {
    result = {
      name: 'Internet Explorer',
      msie: true,
      version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
    }
  }

  return result;
}

var browser = detect(navigator.userAgent);

module.exports = browser;
