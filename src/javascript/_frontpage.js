var $ = require('jquery');
var vanishText = require('./_vanishText');

$(window).scroll(function() {
    vanishText.fade('.js-main-title', $(this).scrollTop());
});
