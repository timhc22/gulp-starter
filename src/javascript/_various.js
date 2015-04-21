var $ = require('jquery');

//ajax start/stop
$(document)
    .ajaxStart(function () {})
    .ajaxStop(function () {})
;

$(".hiButton").on( "click", function() {
    alert('hi');
});

