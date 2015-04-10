var $ = require('jquery');

// Menu
$(document).click(function(event) {
    //jquery enhancement for menu, close if click off the menu
    if(!$(event.target).closest('.js-navigation').length) {
        $(".js-nav-checkbox").prop('checked', false);
    }
});
// End Menu

$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".js-navigation").addClass("navigation--nav-color-two");
    } else {
        $(".js-navigation").removeClass("navigation--nav-color-two");
    }
});