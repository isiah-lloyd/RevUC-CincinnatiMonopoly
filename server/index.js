var express = require('express');
var path = require('path');
// Create a new Express application
var app = express();
app.use(express.static(path.join(__dirname,'..', 'client')));
// Create an http server with Node's HTTP module.
// Pass it the Express application, and listen on port 8080.
var server = require('http').createServer(app).listen(8080);

// Instantiate Socket.IO hand have it listen on the Express/HTTP server
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname,'..', 'client')});
});


io.on('connection', function (socket) {
  console.log('User Connected');
  socket.on('hostCreateNewGame', function (data) {
    console.log('User wants to create game');
    // Create a unique Socket.IO Room
   var thisGameId = ( Math.random() * 100000 ) | 0;

   // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
   this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

   // Join the Room and wait for the players
   this.join(thisGameId.toString());
  });
});
