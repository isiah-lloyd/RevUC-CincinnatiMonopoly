
/*$( document ).ready(function () {
  var canvas = $('#game')[0];
  var engine = new BABYLON.Engine(canvas, true);
  var createScene = function() {
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);

    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    camera.attachControl(canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

    // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
    var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

    // move the sphere upward 1/2 of its height
    sphere.position.y = 1;

    // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
    var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

    // return the created scene
    return scene;
  };
  var scene = createScene();
  engine.runRenderLoop(function() {
    scene.render();
  });
  window.addEventListener('resize', function() {
    engine.resize();
});
});
*/
var socket = io.connect('http://localhost:8080');
var player = false;
var player_data;
var users;
var userTurn = 0;
var gameId = 0;
var startingGame = true;
var properties = {};
var userID = 0;
var debounce = 0;
$('#host_game').click(function(){
  socket.emit('hostCreateNewGame');
});
$('#join_game').click(function () {
  $('#main_menu').fadeOut();
  $('#join_form').fadeIn();
});
$('#join_button').click(function (){
  var gamePIN = $('#jf_gameCode').val();
  var username = $('#jf_username').val();
  if (gamePIN.toString().length != 5) {
    console.log("Not a valid Game PIN");
  }
  else {
    socket.emit('playerJoinGame',{s_gamePIN: gamePIN, s_username: username});
    player = true;
  }
});
if (player === false){
  host_players = {};
}

socket.once('newGameCreated', function(data){
  console.log(data);
  $('#main_menu').fadeOut();
  $('#game_lobby_host').fadeIn();
  $('#gl_directions').text('Go to ' + document.domain + ' and enter the Game PIN to join this game!');
  $('#gamecode').text('Game PIN: ' + data.gameId);
});
socket.on('playerJoinedRoom', function(data){
  if(player && debounce === 0) {
    gameId = data.s_gamePIN;
    player_data = data;
    $('#gl_directions').text('Waiting for players to connect...');
    $('#join_form').fadeOut();
    $('#game_lobby_mobile').fadeIn();
    $('#game_lobby_mobile').append('<button id="start_game">Start Game</button>');
    debounce = 1;
    $('#start_game').click(function () {
      socket.emit('playerStartGame', player_data);
    });
  }
  else {
    host_players[data.mySocketId] = {id: data.mySocketId, username: data.s_username, position: 0, money:15000};
    $('#gl_playerlist').append('<li>'+data.s_username+'</li>');
  }
  gameId = data.s_gamePIN;
});
socket.on('gameStarted', function (data){
  if(player === false) {
    if (userTurn === 0) {
      $('#game_lobby_host').fadeOut();
      $('#game_viewer').fadeIn();
      $('#game_message').text('The game is now starting.');
      getObject = Object.keys(host_players)[userTurn];
      current_player = host_players[getObject];
      $.each(host_players, function(key,value) {
        $('#leaderboard_list').append('<li id='+ value.username + '>' + value.username + ':' + value.money+ "</li>");
      });
      setTimeout(function(){$('#game_message').text(current_player.username + ', please roll the dice.');socket.emit('start_turn', {player: current_player, inital_turn: true, s_gamePIN: data.s_gamePIN});}, 3000);
    }
    else{
      first_uid = Object.keys(host_players)[userTurn];
      current_player = host_players[first_uid];
      $('#game_message').text(current_player.username + ', please roll the dice.');socket.emit('start_turn', {player: current_player, s_gamePIN: data.s_gamePIN});
    }

    }
  else {
    $('#game_lobby_mobile').fadeOut();
    $('#game_controller').fadeIn();
    $('#status').text('The game is starting soon, please look at the display.');
  }
});
socket.on('start_turn', function (data) {
  console.log(data);
  updateLeaderboard();
  $('#status').text('It\'s your turn! Roll the dice!');
  $('#turn_active').fadeIn();
  getObject = Object.keys(host_players)[userTurn];
  current_player = host_players[getObject];
  //$('#game_message').text(current_player.username + ', please roll the dice.');
  $('#roll_dice').click(function (){
    socket.emit('updateTurn', {action:'roll_dice', data: data});
  });
});
socket.on('updateTurn', function (data) {
  if (player === false){
    $('#game_message').text(data.previous_data.data.player.username + ' has rolled a ' + data.result);
    new_position = host_players[data.previous_data.data.player.id].position + data.result;
    if (new_position > 39) {
      diff = new_position - 39;
      new_position = 0 + new_position;
      host_players[data.previous_data.data.player.id].money = host_players[data.previous_data.data.player.id].money + 200;
      updateLeaderboard();
    }
    else {
      host_players[data.previous_data.data.player.id].position = new_position;
      updateLeaderboard();
    }
    if(userTurn + 1 < Object.keys(host_players).length) {
      userTurn++;
      console.log(userTurn);
    }
    else if (userTurn+1 == Object.keys(host_players).length){
      userTurn = 0;
      console.log(userTurn);
    }
  }
else if(player){
  if(player_data.mySocketId == data.previous_data.data.player.id) {
    $('#turn_active').fadeOut();
    $('#status').text('Wait for your turn...');
    socket.emit('end_turn');
  }
}
});
function updateLeaderboard() {
  $.each(host_players, function(key,value) {
    $('#' + value.username).text(value.username + ':' + value.money);
  });
}
socket.on('end_turn', function(data) {
  getObject = Object.keys(host_players)[userTurn];
  current_player = host_players[getObject];
  socket.emit('start_turn', {player: current_player, s_gamePIN: gameId});
});
