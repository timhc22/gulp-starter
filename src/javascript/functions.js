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

    //Overrides persistence storage with dummy function. This enables use of Model.destroy() without raising an error.
    Backbone.sync = function(method, model, success, error){
        success();
    };

    var Item = Backbone.Model.extend({
        defaults: {
            part1: 'hello',
            part2: 'world'
        }
    });

    var List = Backbone.Collection.extend({
        model: Item
    });

    //ItemViews now respond to two clickable actions for each Item: swap and delete.
    //Responsible for rendering each individual Item.
    var ItemView = Backbone.View.extend({
        tagName: 'li', //name of (orphan) root tag in this.el

        events: {
            'click span.swap': 'swap',
            'click span.delete': 'remove'
        },

        //initialize() now binds model change/removal to the corresponding handlers below.
        initialize: function(){
            _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); //every function that uses 'this' as the current object should be in here

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        //render() now includes two extra spans corresponding to the actions swap and delete.
        render: function(){
            $(this.el).html(
                '<span style="color:black;">' +
                this.model.get('part1') + ' ' +
                this.model.get('part2') + '' +
                '</span> &nbsp; &nbsp; ' +
                '<span class="swap" style="font-family:sans-serif; color:blue; cursor:pointer;">[swap]</span> ' +
                '<span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
            return this; // for chainable calls, like .render().el
        },

        //unrender(): Makes Model remove itself from the DOM.
        unrender: function(){
            $(this.el).remove();
        },

        //swap() will interchange an Item's attributes. When the .set() model function is called, the event change will be triggered.
        swap: function(){
            var swapped = {
                part1: this.model.get('part2'),
                part2: this.model.get('part1')
            };
            this.model.set(swapped);
        },

        //remove(): We use the method destroy() to remove a model from its collection. Normally this would also delete the record from its persistent storage, but we have overridden that (see above).
        remove: function(){
            this.model.destroy();
        }
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

        //appendItem() is no longer responsible for rendering an individual Item. This is now delegated to the render() method of each ItemView instance.
        appendItem: function(item){
            var itemView = new ItemView({
                model: item
            });
            $('ul', this.el).append(itemView.render().el);
        }


    });

    var listView = new ListView();

});
