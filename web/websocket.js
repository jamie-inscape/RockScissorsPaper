/**
 * websocket.js
 */

window.onload = init;
var socket;
var playerArray;

/**
 * handle message events
 * @param {type} event
 * @returns {undefined}
 */
function onMessage(event) {
    var player = JSON.parse(event.data);
    if (player.action === "add") {
        var newPlayer = createPlayer(
                player.id,
                player.name,
                player.status,
                player.score
            );
        addPlayer(newPlayer);		
    } else if (player.action === "remove") {
        document.getElementById(player.id).remove();
        //player.parentNode.removeChild(player);
    } else if (player.action === "acceptLogin") {
        currentPlayer = createPlayer(
            player.id,
            player.name,
            player.status,
            player.score
        );
        if (!isPlaying) {
           showLeaderScreen();
           populateLeaderTable();
        }
    } else if (player.action === "rejectLogin") {
           showBadPasswordText();
    } else if (player.action === "login") {
        var id = player.id;
        var status = player.status;
        for (i=0; i < playerArray.length; i++) {
            if (playerArray[i].id === id) {
                playerArray[i].status = status;
            }
        }
        populateLeaderTable();
    } else if(player.action === "challengeSent") {
        var userChallengedId = player.userChallengedId;
        var challengerName = player.challengerName;
        var challengerId = player.challengerId;
        if (userChallengedId === currentPlayer.getId()) {
            showChallengeBox(challengerName, challengerId);
        }
    } else if(player.action === "challengeRejected") {
        var userId = player.userId;
        if (currentPlayer.id === userId) {
            handleRejection();
        }
    } else if (player.action === "startGame") {
        isPlaying = true;
        var player1 = player.player1;
        var player2 = player.player2;
        var gameId = player.gameId;
        if (player1 === currentPlayer.id || player2 === currentPlayer.id) {
            startGame(gameId, player1, player2);
        }
    } else if (player.action === "winGame") {
        var winnerId = player.winnerId;
        var loserId = player.loserId;
        if (currentPlayer.id == winnerId) {
            showWinScenario();
        } else if (currentPlayer.id == loserId) {
            showLoseScenario();
        }
        updatePlayerList();
        isPlaying = false;
    } else if (player.action === "tieGame") {
        showTieScenario();
        isPlaying = false;
    } else if (player.action === "updatePlayer") {
        var playerId = player.id;
        var playerName = player.name;
        var playerScore = player.score;
        var playerStatus = player.status;
        for (i=0; i < playerArray.length; i++) {
            if(playerId === playerArray[i].id) {
                playerArray[i].setName(playerName);
                playerArray[i].setScore(playerScore);
                playerArray[i].setStatus(playerStatus);
                break;
            }
        }
        populateLeaderTable();
    } else if (player.action === "checkOnline") {
        confirmOnline();
    }
}

/**
 * confirm user is online.
 * @returns {undefined}
 */
function confirmOnline() {
    var onlineConfirmation = {
        action: "onlineConfirmation",
        userId: currentPlayer.getId()
    };
    socket.send(JSON.stringify(onlineConfirmation));
}


/**
 * update Player list message.
 * @returns {undefined}
 */
function updatePlayerList() {
    var updatePlayerListMessage = {
        action: "updatePlayerList"
    }
    socket.send(JSON.stringify(updatePlayerListMessage));
}




/**
 * show bad password text.
 * @returns {undefined}
 */
function showBadPasswordText() {
    $("div.badPassword").show();
}

function removePlayer(element) {
    var id=element;
    var PlayerAction = {
            action: "remove",
            id: id
    };
    socket.send(JSON.stringify(PlayerAction));
}

function togglePlayer(element) {
    var id = element;
    var PlayerAction = {
            action: "toggle",
            id: id	
    };
    socket.send(JSON.stringify(PlayerAction));
}

/**
 * Add a player to the player array
 * @param {type} player
 * @returns {undefined}
 */
function addPlayer(player) {
    playerArray.push(player);
}

/**
 * populate leader table.
 * @returns {undefined}
 */
function populateLeaderTable() {
    playerArray.sort(function(a, b) {return b.score - a.score})
    $("#leaderScreen table").html("");
    if (currentPlayer) {
        for (i = 0; i < playerArray.length; i++) {
            var row = [];
            row.push("<tr>");
            row.push("<td>"+ (i + 1) + "</td>");
            row.push("<td>"+playerArray[i].getName()+"</td>");
            row.push("<td>"+playerArray[i].getScore()+"</td>");
            if (playerArray[i].getId() !== currentPlayer.id) {
                var challengeText = (playerArray[i].getStatus()===1?
                "<button class='challenge' name='" + playerArray[i].getName() + "' value='" + playerArray[i].getId() + "'>Challenge</button>":
                        "unavailable");
                row.push("<td>"+challengeText+"</td>");
            } else {
                var statusText = (playerArray[i].getStatus()===1?
                "online":"unavailable");
                row.push("<td>"+statusText+"</td>");
            }
            row.push("</tr>");
            $("#leaderScreen table").append(row.join(" "));
        }
    }
}

/**
 * show the leader screen.
 * @returns {undefined}
 */
function showLeaderScreen() {
    $("#loginScreen").hide();
    $("#leaderScreen").show();
    $("#gameScreen").hide();
}

/**
 * show the game screen.
 * @returns {undefined}
 */
function showGameScreen() {
    $("#loginScreen").hide();
    $("#leaderScreen").hide();
    $("#gameScreen").show();
}


/**
 * initialize.
 * @returns {undefined}
 */
function init() {
    playerArray = [];
    socket = new WebSocket("ws://localhost:8080/RockScissorsPaper/actions");
    socket.onmessage = onMessage;
    $("div.badPassword").hide();
    $("#leaderScreen").hide();
    $("#gameScreen").hide();
}