// old comment, left for future reference because may re-implement
// Browserify entry point for the functions.js bundle (yay JavaScript!)
// global.js already contains jQuery, so in our config.js file, we are exposing it to other files like this one in the
// `require` array. Also in config.js, jquery is listed in `external` array for this bundle. This combination lets this
// file use the jquery module bundled with global.js, instead of including it twice!

var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

$(document)
    .ajaxStart(function () {})
    .ajaxStop(function () {})
;

$(function()
{
    $(".hiButton").on( "click", function() {
      alert('hi');
    });


    var ListView = Backbone.View.extend({
        el: $('.backbone'), // attaches `this.el` to an existing element.

        events: {
            'click button#add': 'addItem'
        },
        initialize: function(){
            // every function that uses 'this' as the current object should be in here
            _.bindAll(this, 'render', 'addItem'); // fixes loss of context for 'this' within methods

            this.counter = 0; //total nubmer of items added so far
            this.render(); // not all views are self-rendering. This one is.
        },

        render: function(){
            $(this.el).append("<button id='add'>Add list item</button>");
            $(this.el).append("<ul></ul>");
        },

        addItem: function(){
            this.counter++;
            $('ul', this.el).append("<li>hello world"+this.counter+"</li>");
        }

    });

    var listView = new ListView();

});
