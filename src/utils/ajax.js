/**
 * Created by huangxinghui on 2015/5/25.
 */

var $ = require('jquery');
var Bean = require('../core');
var loadingBar = require('../components/loadingbar');

var reqsTotal = 0,
    reqsComplete = 0;

Bean.ajax = function (url, options) {
    if (typeof url === "object") {
        options = url;
        url = undefined;
    }

    options.complete = decorateComplete(options.complete);

    if (reqsTotal === 0) {
        loadingBar.start();
    }

    reqsTotal++;

    return $.ajax(url, options);
};

function decorateComplete(complete) {
    return function (jqXHR, textStatus) {
        reqsComplete++;

        if (reqsComplete >= reqsTotal) {
            loadingBar.finish();
        } else {
            loadingBar.progress(reqsComplete / reqsTotal);
        }

        complete(jqXHR, textStatus);
    }
}