/**
 * Created by huangxinghui on 2015/8/15.
 */

var $document = require('./document');
var locale = require('./locale');
var $body = require('./body');

$document.ready(function init() {
    locale.publish();

    $body = $document.find('body');
});