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
			if(!hide) {
				var tweets = self.state.data;
				if (tweets.length > 200) { tweets = [] };
				tweets.unshift(tweet);
				self.setState({data: tweets});
			}

  		});
	},
	componentDidUpdate: function() {
		// //Redirect hashtag clicks to input
		for (var ls = document.links, numLinks = ls.length, i=0; i<numLinks; i++){
			var link = ls[i].href;
			if(link.substring(0, 27) == 'https://twitter.com/hashtag'){
				ls[i].onclick = function(e){
					e.preventDefault();
   					inputTag.value = this.href.substring(this.href.lastIndexOf('/')+1, this.href.lastIndexOf('?'));
				};
			}
		}
	},
	clearInput: function() {
      // Clear the input
      console.log("Clearing..");
      this.replaceState(this.getInitialState());
    },
	render: function() {
		  var tweetNodes = this.state.data.map(function (tweet) {
	      return (
	        	<Tweet key={tweet.key} rendered={tweet.rendered}>
	        	</Tweet>
	      );
	    });

		return (
			<div className="tweetList" ref="incomingTweets">
			<button className="clearButton" onClick={this.clearInput}>Clear</button>
	      	<ReactCSSTransitionGroup transitionName="tweet">
			{tweetNodes}
        	</ReactCSSTransitionGroup>
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