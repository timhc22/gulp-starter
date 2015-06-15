var React = require('react');
var $ = require('jquery');
require('jquery.cookie');
var Marked = require('marked');
//var reactData = require('./reactData.json');

var Comment = React.createClass({
    render: function() {
        var rawMarkup = Marked(this.props.children.toString(), {sanitize: true});
        return (
            <div className="comment">
                <h3 className="commentAuthor">
                    {this.props.author}
                </h3>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
           return (
               <Comment author={comment.author}>
                   {comment.text}
               </Comment>
           );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({author: author, text: text}); //this send to server (see handleCommentSubmit)
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <br/>
                <input type="text" placeholder="Say something..." ref="text" />
                <br/>
                <input type="submit" value="Post" />
            </form>
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
    handleCommentSubmit: function(comment) {

        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments}); //optimistically update the list

        //$.cookie('XDEBUG_SESSION', 'PHPSTORM', { path: '/' }); //not working
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
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
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList data={this.state.data} />
            </div>
        );
    }
});

React.render(
    <CommentBox url="api/react-data" pollInterval={2000} />,
    document.getElementById('content')
);
