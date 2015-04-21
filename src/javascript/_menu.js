var $ = require('jquery');

// Menu
$(document).click(function(event) {
    //jquery enhancement for menu, close if click off the menu
    if(!$(event.target).closest('.js-navigation').length) {
        $(".js-nav-checkbox").prop('checked', false);
    }
});
// End Menu

//change navbar colour when scrolling, unless the body has a class saying not to change
if (!$('body').hasClass('js-navbar-nochange')) {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= 100) {
            $(".js-navigation").addClass("navigation--nav-color-two");
        } else {
            $(".js-navigation").removeClass("navigation--nav-color-two");
        }
    });
} else {
    $(".js-navigation").addClass("navigation--nav-color-two");
}