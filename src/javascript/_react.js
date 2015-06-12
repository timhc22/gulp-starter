var React = require('react');
var Marked = require('marked');

var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is yet *another* comment"}
];


var Comment = React.createClass({
    render: function() {
        var rawMarkup = Marked(this.props.children.toString(), {sanitize: true});
        return (
            React.createElement('div', {className: "comment"},
                React.createElement('h2', {className: "commentAuthor"}, this.props.author),
                React.createElement('span', {dangerouslySetInnerHTML: {__html: rawMarkup}})
            )
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
           return (
               React.createElement(Comment, {author: comment.author, children: comment.text})
           );
        });
        return (
            React.createElement('div', {className: "commentList"}, commentNodes)
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            React.createElement('div', {className: "commentForm"},
                "Hello, world! I am a CommentForm."
            )
        );
    }
});

var CommentBox = React.createClass({displayName: 'CommentBox',
    render: function() {
        return (
            React.createElement('div', {className: "commentBox"},
                React.createElement('h1', null, 'Comments'),
                React.createElement(CommentList, {data: this.props.data}),
                React.createElement(CommentForm, null)
            )
        );
    }
});

React.render(
    React.createElement(CommentBox, {data: data}),
    document.getElementById('content')
);
