var $ = require('jquery');

$(window).scroll(function() {
    fade('.js-main-title', $(this).scrollTop());
});


function fade(fadeOnClass, scrollPos) {
    ///*get position*/
    //scrollPos = $(this).scrollTop();
    /*scroll and fade*/
    $(fadeOnClass).css({
        //'margin-top' : +(scrollPos/2)+"px",
        'opacity' : 1-(scrollPos/250)
    });

    /*this stops the pagination being blocked*/
    if($(fadeOnClass).css('opacity') == 0) {
        $(fadeOnClass).css({
            'display' : 'none'
        });
    } else {
        $(fadeOnClass).css({
            'display' : 'block'
        });
    }
}