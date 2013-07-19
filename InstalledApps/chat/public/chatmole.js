$(function(){
	var socket = io.connect(),
	$messageForm = $('#send-message'),
	$messageBox = $('#message'),
	$chat = $('#chat'),
	$unameForm = $('#unameForm'),
	$unameError = $('#unameError'),
	$unameBox = $('#uname'),
	$usersWrapper = $('#usersWrapper');

	$messageForm.off('submit');
	$messageForm.on('submit', function(e){
		e.preventDefault();
		socket.emit('sendMsg', $messageBox.val(), function(data){
			$chat.append("<span class='error'>" + data + "</span><br/>");
		});
		$messageBox.val('');
	});
	
	$unameForm.off('submit');
	$unameForm.on('submit', function(e){
		e.preventDefault();
		socket.emit('newUser', $unameBox.val(), function(data){
			if(data) {
				$unameError.html('');
				$('#userInfo').hide();
				$('#contentWrapper').show();
			} else {
				$unameError.html('User already exists! Please try a different username.');
			}
		});
		$unameBox.val('');
	});
	
	socket.on('newMsg', function(data){
		$chat.append("<span class='msg'><b>" + data.uname + ":> </b>" + data.msg + "</span><br/>");
	});
	
	socket.on('usernames', function(data){
		var userStr = "";
		for (var i = 0; i < data.length; i++) {
			userStr += data[i] + "<br/>";
		}
		$usersWrapper.html(userStr);
	});
	
	socket.on('pvtMsg', function(data){
		$chat.append("<span class='pvtMsg'><b>" + data.uname + ":> </b>" + data.msg + "</span><br/>");
	});
});
