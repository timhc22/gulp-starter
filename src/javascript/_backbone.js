// old comment, left for future reference because may re-implement
// Browserify entry point for the functions.js bundle (yay JavaScript!)
// global.js already contains jQuery, so in our config.js file, we are exposing it to other files like this one in the
// `require` array. Also in config.js, jquery is listed in `external` array for this bundle. This combination lets this
// file use the jquery module bundled with global.js, instead of including it twice!

var $ = require('jquery');
var _ = require('underscore');  //todo is this going to work? i.e. require uses backbone/underscore
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");

'use strict'; //todo check in right place and if needed

//todo module.exports

$(function()
{

    //window.App = {
    //    Collections: {},
    //    Mixins: {},
    //    Models: {},
    //    Units: {},
    //    Views: {},
    //    Routers: {}
    //};
    //
    //App.config = {
    //    baseUrl: '{{ path('home') }}'
    //}

    var App = {}; // create namespace for our app

    //--------------
    // Models
    //--------------
    App.Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        },
        toggle: function(){
            this.save({ completed: !this.get('completed')});
        }
    });

    //--------------
    // Collections
    //--------------
    App.TodoList = Backbone.Collection.extend({
        model: App.Todo,
        localStorage: new Store("backbone-todo"), //App.todoList.fetch() gets from here
        completed: function() {
            return this.filter(function( todo ) {
                return todo.get('completed');
            });
        },
        remaining: function() {
            return this.without.apply( this, this.completed() );
        }
    });

    // instance of the Collection
    App.todoList = new App.TodoList();

    //--------------
    // Views
    //--------------

    // renders individual todo items list (li)
    App.TodoView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('.js-item-template').html()),
        //template: JST['_todo.html'],
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            this.input = this.$('.edit');
            return this; // enable chained calls
        },
        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this); //remove: convenience backbone
        },
        events: {
            'dblclick label' : 'edit',
            'keypress .edit' : 'updateOnEnter',
            'blur .edit' : 'close',
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'destroy'
        },
        edit: function(){
            this.$el.addClass('editing'); //adds to li element
            this.input.focus();
        },
        close: function(){
            var value = this.input.val().trim();
            if (value) {
                this.model.save({title: value});
            }
            this.$el.removeClass('editing');
        },
        updateOnEnter: function(e){
            if(e.which == 13){
                this.close();
            }
        },
        toggleCompleted: function(){
            this.model.toggle();
        },
        destroy: function(){
            this.model.destroy();
        }
    });


    // renders the full list of todo items calling TodoView for each one.
    App.AppView = Backbone.View.extend({
        el: '.js-todoapp',
        initialize: function () {
            this.input = this.$('.js-new-todo');
            // when new elements are added to the collection render then with addOne Also called bind. It binds an
            // object to an event and a callback. When that event it’s triggered it executes the callback.
            //object.on(event, callback, [context])
            App.todoList.on('add', this.addAll, this); //also works with addOne (todo which is better?)
            App.todoList.on('reset', this.addAll, this);
            App.todoList.fetch(); // Loads list from local storage
        },
        events: {
            'keypress .js-new-todo': 'createTodoOnEnter',
            //'click .js-route-home': 'routeHome',
            //'click .js-route-pending': 'routePending',
            //'click .js-route-completed': 'routeCompleted'
        },
        createTodoOnEnter: function(e){
            if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
                return;
            }
            App.todoList.create(this.newAttributes());
            this.input.val(''); // clean input box
        },
        addOne: function(todo){
            var view = new App.TodoView({model: todo}); //pass todo model into ToDoView
            $('.js-todo-list').append(view.render().el);
        },
        addAll: function(){
            this.$('.js-todo-list').html(''); // clean the todo list
            // filter to do item list //window.filter is defined in App.Router
            switch(window.filter) {
                case 'pending':
                    _.each(App.todoList.remaining(), this.addOne);
                    break;
                case 'completed':
                    _.each(App.todoList.completed(), this.addOne);
                    break;
                default:
                    App.todoList.each(this.addOne, this);
                    break;
            }
        },
        newAttributes: function(){
            return {
                title: this.input.val().trim(),
                completed: false
            }
        },
        //routeHome: function(){
        //    App.router.navigate("/", true)
        //},
        //routePending: function(){
        //    App.router.navigate("/pending", true)
        //},
        //routeCompleted: function(){
        //    App.router.navigate("/completed", true)
        //}
    });

    //--------------
    // Routes
    //--------------
    App.Router = Backbone.Router.extend({
        routes: {
            '*filter' : 'setFilter'
        },
        setFilter: function(params) {
            console.log('App.router.params = ' + params); // just for didactical purposes.
            window.filter = params && params.trim ? params.trim() : '';
            App.todoList.trigger('reset');
        }
    });

    //--------------
    // Initializers
    //--------------
    App.router = new App.Router();
    Backbone.history.start();
    //Backbone.history.start({pushState: true});

    App.appView = new App.AppView();

    //var todo = new app.Todo({title: 'Learn Backbone.js', completed: false}); // create object with the attributes specified.
    //todo.get('title'); // "Learn Backbone.js"
    //todo.get('completed'); // false
    //todo.get('created_at'); // undefined
    //todo.set('created_at', Date());
    //todo.get('created_at'); // "Wed Sep 12 2012 12:51:17 GMT-0400 (EDT)"

    window.App = App; //so can use in console

});
