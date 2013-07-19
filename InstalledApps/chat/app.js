var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};



app.use(express.static('public'));
module.exports = app ; 
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/index.html");
});



