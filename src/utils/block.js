/**
 * Created by huangxinghui on 2015/5/26.
 */

var $ = require('jquery');
var Bean = require('../core');

require('../components/loading');

var invokeCount = 0,
    startTimer;

Bean.block = function () {
    var $loading;

    if (invokeCount === 0) {
        $(document.body).loading({
            customClass: 'pg-blocking'
        });

        $loading = $(document.body).data('loading').$loading;
        startTimer = setTimeout(function () {
            $loading.removeClass('pg-blocking');
        }, 2000);
    }

    invokeCount++;
};

Bean.unblock = function () {
    invokeCount--;

    if (invokeCount === 0) {
        clearTimeout(startTimer);

        $(document.body).loading('finish');
    }
};