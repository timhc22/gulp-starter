var $ = require('jquery');

// Menu
$(document).click(function(event) {
    //jquery enhancement for menu, close if click off the menu
    if(!$(event.target).closest('.js-navigation').length) {
        $(".js-nav-checkbox").prop('checked', false);
    }
});
// End Menu

$(".js-navigation").on( "click", function() {
    alert('hi testssss');
});
