var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

//Get PORT from environment or set to 5000 as default
var port = process.env.PORT || 5000;

var app = express()
  , server = app.listen(port, function(){
    console.log("Server listening on PORT " + port);
  })
  , io = io.listen(server);

var tw = require('./src/tweets');
var tweets = new tw();
var db = require('./src/db');
var Db = new db('tweets');


app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

var oldStream;
io.on('connection', function (socket) {
	console.log("Connected..");

	socket.on('startStream', function(tag){
		console.log("Streaming for " + tag);

		try{
			if(oldStream)
				oldStream.stop();

		  	Db.GetTweets(tag, function(data){
				for (var i = 0; i < data.length; i++) {
		  			socket.emit('newTweet', data[i]);
				};
		  	});

			var stream = tweets.streamWithTag(tag, function(data){
		 		socket.emit('newTweet', data);
		 		Db.InsertTweet(data);
		 	});
		 	oldStream = stream;

		  	socket.on('stopStream', function (data) {
		    	console.log("Stopping...");
		    	stream.stop();
		  	});
	  	} catch(err){
	  		console.log('Error = ' + err + '|');
	  	}
	});

});