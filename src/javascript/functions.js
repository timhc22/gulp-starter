$(document)
    .ajaxStart(function () {})
    .ajaxStop(function () {})
;

$(document).ready(function()
{
    $(".hiButton").on( "click", function() {
      alert('hi');
    });

});

