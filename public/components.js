/**
* @jsx React.DOM
*/
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TweetList = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		var self = this;
		socket.on('newTweet', function (tweet) {
			console.log(tweet);

			var tweets = self.state.data;
			tweets.unshift(tweet);
			self.setState({data: tweets});

  		});
	},
	componentDidUpdate: function() {
		// //Redirect hashtag clicks to input
		// for (var ls = document.links, numLinks = ls.length, i=0; i<numLinks; i++){
		// 	var link = ls[i].href;
		// 	if(link.substring(0, 27) == 'https://twitter.com/hashtag'){
		// 		console.log(link);
		// 		console.log(link.substring(link.lastIndexOf('/')+1, link.lastIndexOf('?')));


		// 		ls[i].onclick = function(e){
		// 			e.preventDefault();
  //  					inputTag.value = this.href.substring(this.href.lastIndexOf('/')+1, this.href.lastIndexOf('?'));
		// 		};
		// 	}
		// }
	},
	render: function() {
		  var tweetNodes = this.state.data.map(function (tweet) {
		  console.log(tweet.key);
	      return (
	      	<ReactCSSTransitionGroup transitionName="tweet">
	        	<Tweet key={tweet.key} rendered={tweet.rendered}>
	        	</Tweet>
        	</ReactCSSTransitionGroup>

	      );
	    });

		return (
			<div className="tweetList">
			{tweetNodes}
			</div>
		);
	}
});

var converter = new Showdown.converter();
var Tweet = React.createClass({
	render: function() {
		var rawMarkup = converter.makeHtml(this.props.rendered.toString());
		return (
			<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
		);
	}
});

React.renderComponent(
	<TweetList />,
	document.getElementById('content')
);