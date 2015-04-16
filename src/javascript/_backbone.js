// old comment, left for future reference because may re-implement
// Browserify entry point for the functions.js bundle (yay JavaScript!)
// global.js already contains jQuery, so in our config.js file, we are exposing it to other files like this one in the
// `require` array. Also in config.js, jquery is listed in `external` array for this bundle. This combination lets this
// file use the jquery module bundled with global.js, instead of including it twice!

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
//var LocalStorage = require('backbone-localstorage');
Backbone.$ = $;
//LocalStorage.Backbone = Backbone;

//_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

$(function()
{
    var AppView = Backbone.View.extend({
        el: $('#container'),
        // template which has the placeholder 'who' to be substitute later
        template: _.template("<h3>Hello <%= who %></h3>"),
        initialize: function(){
            this.render();
        },
        render: function(){
            // render the function using substituting the varible 'who' for 'world!'.
            this.$el.html(this.template({who: 'worlds!'}));
            //***Try putting your name instead of world.
        }
    });

    var appView = new AppView();
});
