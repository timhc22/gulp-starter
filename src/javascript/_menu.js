var $ = require('jquery');

// Menu
$(document).click(function(event) {
    //jquery enhancement for menu, close if click off the menu
    if(!$(event.target).closest('.js-navigation').length) {
        if($(".js-nav-checkbox").prop('checked')) {
            $(".js-nav-checkbox").prop('checked', false);
            $(".js-nav-checkbox").change(); //fire the change event //todo ideally this wouldn't need to be here
        }
    }
});
// End Menu

//body overlay for when menu is open
$('.js-nav-checkbox').on('change', function(){
    if(this.checked)
    {
        //add overlay class
        $('body').append(
            '<div class="js-page-overlay" ' +
            'style="position:fixed;width:100%;height:100%;top:0;left:0;color:black;opacity:0.9;background-color:black;">' +
            '</div>'
        );
    } else {
        $('.js-page-overlay').remove();
    }
});

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