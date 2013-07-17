var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames = [];

server.listen(8000);

app.use(express.static('public'));
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket) {

	function updateUsernames () {
		io.sockets.emit('usernames', usernames);
	}

	socket.on('newUser', function(data, callback) {
		if(usernames.indexOf(data) != -1) {
			callback(false);
		}
		else {
			callback(true);
			socket.uname = data;
			usernames.push(data);
			updateUsernames();
		}
	});
	
	socket.on('sendMsg', function(data) {
		io.sockets.emit('newMsg', {msg : data, uname : socket.uname});
	});

	socket.on('disconnect', function(data) {
		if(!socket.uname) return;
		usernames.splice(usernames.indexOf(socket.uname), 1);	
		updateUsernames();
	});
});
