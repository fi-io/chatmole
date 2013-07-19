var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};

server.listen(8000);

app.use(express.static('public'));
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/index.html");
});

// Add All Installed Apps by context path
var installedApps = require('./installedApps');

for ( appI in installedApps.apps ) {
	var appL = installedApps.apps[appI];	
	var path = appL.contextPath ; 		
	var mod = require(appL.dir);
	app.use(path , mod );
}

io.sockets.on('connection', function(socket) {

	function updateUsernames () {
		io.sockets.emit('usernames', Object.keys(users));
	}

	socket.on('newUser', function(data, callback) {
		if(data in users) {
			callback(false);
		}
		else {
			callback(true);
			socket.uname = data;
			users[socket.uname] = socket;
			updateUsernames();
		}
	});
	
	socket.on('sendMsg', function(data, callback) {
		var msg = data.trim();
		if(msg.substr(0, 3) === '/w ') {
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind != -1) {
				var name = msg.substr(0, ind);
				msg = msg.substr(ind + 1);
				if (name in users) {
					users[name].emit('pvtMsg', {msg : msg, uname : socket.uname});
				} else {
					callback("ERROR : Please enter a valid user name!");
				}
			} else {
				callback("ERROR : Please enter a message for your private message!");
			}
		}
		else {
			io.sockets.emit('newMsg', {msg : msg, uname : socket.uname});
		}
	});

	socket.on('disconnect', function(data) {
		if(!socket.uname) return;
		delete users[socket.uname];
		updateUsernames();
	});
});
