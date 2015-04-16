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



    var todoList = new app.TodoList();
    todoList.create({title: 'Learn Backbone\'s Collection'}); // notice: that `completed` will be set to false by default.
    var lmodel = new app.Todo({title: 'Learn Models', completed: true});
    todoList.add(lmodel);
    console.log(todoList.pluck('title'));     // ["Learn Backbone's Collection", "Learn Models"]
    console.log(todoList.pluck('completed')); // [false, true]
    console.log(JSON.stringify(todoList));    // "[{"title":"Learn Backbone's Collection","completed":false,"id":"d9763e99-2267-75f5-62c3-9d7e40742aa6"},{"title":"Learn Models","completed":true}]"


    //var AppView = Backbone.View.extend({
    //    el: $('#container'),
    //    // template which has the placeholder 'who' to be substitute later
    //    template: _.template("<h3>Hello <%= who %></h3>"),
    //    initialize: function(){
    //        this.render();
    //    },
    //    render: function(){
    //        // render the function using substituting the varible 'who' for 'world!'.
    //        this.$el.html(this.template({who: 'worlds!'}));
    //        //***Try putting your name instead of world.
    //    }
    //});

    //var appView = new AppView();

    window.app = app; //so can use in console
});
