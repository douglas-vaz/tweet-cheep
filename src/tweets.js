var Twit = require('twit');
var key = require("./keys").Key;

function Tweet() {
	this.T = new Twit(key);
}

Tweet.prototype.renderTweet = function(id, pDate, tags, fn) {

	this.T.get('statuses/oembed', {id: id, omit_script: 'true'}, function(err, data, response){
		if(err){
			console.log(err);
		}
		else {
			fn({key: id, date: new Date(pDate), tags: tags, rendered: data.html});
		}
	});	
};

Tweet.prototype.streamWithTag = function(tag, fn) {
	var stream = this.T.stream('statuses/filter', { track: '#'+tag })

	var self = this;
	stream.on('tweet', function (tweet) {
		var hs = tweet.entities.hashtags;

		//Calculate tags
		tags = []
		for (var i = hs.length - 1; i >= 0; i--) {
			tags.push(hs[i].text);
		};

		//Parse Twitter created_at to Date
		var parsed = Date.parse(tweet.created_at.replace(/( \+)/, ' UTC$1'))

		self.renderTweet(tweet.id_str, parsed, tags, function(data){
			fn(data);
		});
	});
	return stream;
};

module.exports = Tweet;