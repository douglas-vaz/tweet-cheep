var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var db = require('monk')(mongoUri);

function Db(collection) {
	this.tweets = db.get(collection);

	//Index on key (tweet id) and tags(for faster tag-based lookup)
	this.tweets.index('key', { unique: true });
	this.tweets.index('tags');
}

Db.prototype.InsertTweet = function(tweet, fn) {
	this.tweets.insert(tweet, function(err, doc){
		if(err){
			console.log(err);
			return;
		}
		if(fn)
			fn(doc);
	});
};

Db.prototype.GetTweets = function(tag, fn) {
	//Newest tweets in front
	this.tweets.find({ tags : tag }
		,{limit: 50, sort : { date : -1 } },
    	function (err,res) { 
    		if(err){
    			console.log(err);
    			return;
    		}
    		fn(res);
    	});

};

module.exports = Db;