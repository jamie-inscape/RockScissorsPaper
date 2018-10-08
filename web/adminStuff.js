/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var socket =  socket = new WebSocket("ws://localhost:8080/RockScissorsPaper/actions");
socket.onmessage = onMessage;
playerArray = [];


$("document").on("click", "addNewUser", function(event) {
    alert("i see the click");
    var userName = $("#newUserName").val();
    var password = $("#newPassword").val();
    var playerId = $("#newPlayerId").val();
    var addNewPlayerMessage = {
        action: "add",
        userName: userName,
        password: password,
        playerId: playerId
    };
    console.log(addNewPlayerMessage);
    socket.send(JSON.stringify(addNewPlayerMessage));
});