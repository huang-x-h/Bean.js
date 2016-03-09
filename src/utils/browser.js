/**
 * Created by huangxinghui on 2016/1/12.
 */

var Bean = require('../core');

// refer to https://github.com/ded/bowser/blob/master/bowser.js
function detect(ua) {
  var edgeVersion       = getFirstMatch(/edge\/(\d+(\.\d+)?)/i),
      versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i),
      result            = {};

  function getFirstMatch(regex) {
    var match = ua.match(regex);
    return (match && match.length > 1 && match[1]) || '';
  }

  function getSecondMatch(regex) {
    var match = ua.match(regex);
    return (match && match.length > 1 && match[2]) || '';
  }

  if (/msie|trident/i.test(ua)) {
    result = {
      name: 'Internet Explorer',
      msie: true,
      version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
    }
  } else if (/chrome.+? edge/i.test(ua)) {
    result = {
      name: 'Microsoft Edge',
      msedge: true,
      version: edgeVersion
    }
  }
  else if (/chrome|crios|crmo/i.test(ua)) {
    result = {
      name: 'Chrome',
      chrome: true,
      version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
    }
  }
  else if (/firefox|iceweasel/i.test(ua)) {
    result = {
      name: 'Firefox',
      firefox: true,
      version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
    };

    if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
      result.firefoxos = true
    }
  }
  else if (/safari/i.test(ua)) {
    result = {
      name: 'Safari',
      safari: true,
      version: versionIdentifier
    }
  }
  else {
    result = {
      name: getFirstMatch(/^(.*)\/(.*) /),
      version: getSecondMatch(/^(.*)\/(.*) /)
    };
  }

  return result;
}

var browser = Bean.browser = detect(navigator.userAgent);

module.exports = browser;
