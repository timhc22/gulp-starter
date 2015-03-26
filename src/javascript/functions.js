// old comment, left for future reference because may re-implement
// Browserify entry point for the functions.js bundle (yay JavaScript!)
// global.js already contains jQuery, so in our config.js file, we are exposing it to other files like this one in the
// `require` array. Also in config.js, jquery is listed in `external` array for this bundle. This combination lets this
// file use the jquery module bundled with global.js, instead of including it twice!

var $ = require('jquery');
var _ = require('underscore');

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

