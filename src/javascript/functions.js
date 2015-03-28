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


    var Item = Backbone.Model.extend({
        defaults: {
            part1: 'hello',
            part2: 'world'
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });

    var ListView = Backbone.View.extend({
        el: $('.backbone'), // attaches `this.el` to an existing element.

        events: {
            'click button#add': 'addItem'
        },

        initialize: function(){
            // every function that uses 'this' as the current object should be in here
            _.bindAll(this, 'render', 'addItem', 'appendItem'); // fixes loss of context for 'this' within methods

            this.collection = new List();
            this.collection.bind('add', this.appendItem); //collection event binder

            this.counter = 0; //total nubmer of items added so far
            this.render(); // not all views are self-rendering. This one is.
        },

        render: function(){

            //Save reference to this so it can be accessed from within the scope of the callback below
            var self = this;
            $(this.el).append("<button id='add'>Add list item</button>");
            $(this.el).append("<ul></ul>");
            _(this.collection.models).each(function(item){ //in case collection is not empty
                self.appendItem(item);
            }, this);
        },

        //addItem() now deals solely with models/collections.
        addItem: function(){
            this.counter++;
            var item = new Item();
            item.set({
               part2: item.get('part2') + this.counter //modify item details
            });
            this.collection.add(item); // add item to collection; view is updated via event 'add'
        },

        //View updates are delegated to the add event listener appendItem() below.
        appendItem: function(item){
            $('ul', this.el).append("<li>"+item.get('part1')+" "+item.get('part2')+"</li>");
        }


    });

    var listView = new ListView();

});
