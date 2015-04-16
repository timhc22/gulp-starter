// old comment, left for future reference because may re-implement
// Browserify entry point for the functions.js bundle (yay JavaScript!)
// global.js already contains jQuery, so in our config.js file, we are exposing it to other files like this one in the
// `require` array. Also in config.js, jquery is listed in `external` array for this bundle. This combination lets this
// file use the jquery module bundled with global.js, instead of including it twice!

var $ = require('jquery');
var _ = require('underscore'); //todo is this going to work? i.e. require uses backbone/underscore
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");


//todo module.exports
//_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

$(function()
{
    var app = {}; // create namespace for our app

    app.Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        }
    });

    app.TodoList = Backbone.Collection.extend({
        model: app.Todo,
        localStorage: new Store("backbone-todo")
    });

    // instance of the Collection
    app.todoList = new app.TodoList();


    // renders individual todo items list (li)
    app.TodoView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#item-template').html()),
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this; // enable chained calls
        }
    });


    // renders the full list of todo items calling TodoView for each one.
    app.AppView = Backbone.View.extend({
        el: '#todoapp',
        initialize: function () {
            this.input = this.$('#new-todo');
            // when new elements are added to the collection render then with addOne
            app.todoList.on('add', this.addOne, this);
            app.todoList.on('reset', this.addAll, this);
            app.todoList.fetch(); // Loads list from local storage
        },
        events: {
            'keypress #new-todo': 'createTodoOnEnter'
        },
        createTodoOnEnter: function(e){
            if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
                return;
            }
            app.todoList.create(this.newAttributes());
            this.input.val(''); // clean input box
        },
        addOne: function(todo){
            var view = new app.TodoView({model: todo});
            $('#todo-list').append(view.render().el);
        },
        addAll: function(){
            this.$('#todo-list').html(''); // clean the todo list
            app.todoList.each(this.addOne, this);
        },
        newAttributes: function(){
            return {
                title: this.input.val().trim(),
                completed: false
            }
        }
    });

    //--------------
    // Initializers
    //--------------

    app.appView = new app.AppView();


    var todo = new app.Todo({title: 'Learn Backbone.js', completed: false}); // create object with the attributes specified.
    todo.get('title'); // "Learn Backbone.js"
    todo.get('completed'); // false
    todo.get('created_at'); // undefined
    todo.set('created_at', Date());
    todo.get('created_at'); // "Wed Sep 12 2012 12:51:17 GMT-0400 (EDT)"

    var view = new app.TodoView({model: todo});

    window.app = app; //so can use in console
});
