var React = require('react');
var $ = require('jquery');
var Marked = require('marked');
//var reactData = require('./reactData.json');

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

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            React.createElement('div', {className: "commentBox"},
                React.createElement('h1', null, 'Comments'),
                React.createElement(CommentList, {data: this.state.data}),
                React.createElement(CommentForm, null)
            )
        );
    }
});

React.render(
    React.createElement(CommentBox, {url: "api/react-data", pollInterval: 2000}),
    document.getElementById('content')
);
