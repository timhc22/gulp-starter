var $ = require('jquery');
var vanishText = require('./_vanishText');
require('./_backbone');

$(window).scroll(function() {
    vanishText.fade('.js-main-title', $(this).scrollTop());
});
