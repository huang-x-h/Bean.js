/**
 * Created by huangxinghui on 2015/5/26.
 */

var $ = require('jquery');
var $body = require('../body');
var Bean = require('../core');

require('../components/loading');

var invokeCount = 0,
    startTimer;

Bean.block = function() {
  var $loading;

  if (invokeCount === 0) {
    $body.loading({
      customClass: 'pg-blocking'
    });

    $loading = $body.data('loading').$loading;
    startTimer = setTimeout(function() {
      $loading.removeClass('pg-blocking');
    }, 2000);
  }

  invokeCount++;
};

Bean.unblock = function() {
  invokeCount--;

  if (invokeCount === 0) {
    clearTimeout(startTimer);

    $body.loading('finish');
  }
};