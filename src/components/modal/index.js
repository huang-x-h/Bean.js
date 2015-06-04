/**
 * Created by huangxinghui on 2015/5/19.
 */

var $ = require('jquery');
var ztesoft = require('../../core');
var modalStack = require('./modalstack');
var DEFAULTS ={
    content: '',
    backdrop: true,
    keyboard: true
};

ztesoft.openModal = function (options) {
    var modalResultDeferred = $.Deferred();

    var modalInstance = {
        result: modalResultDeferred.promise(),
        close: function (result) {
            return modalStack.close(modalInstance, result);
        },
        dismiss: function (reason) {
            return modalStack.dismiss(modalInstance, reason);
        }
    };

    modalStack.open(modalInstance, $.extend({
        deferred: modalResultDeferred
    }, DEFAULTS, options));

    return modalInstance;
};