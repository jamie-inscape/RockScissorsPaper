/**
 * Game Class
 */

var game = null;

/**
 * Create new game.
 * @returns game
 */
function createGame(gameId, player1, player2) {
	
    var game = {
        id: gameId,
        player1Id: player1,
        player2Id: player2,
        player1Choice: "",
        player2Choice: "",
        setPlayer1Id: function(id){
            this.player1Id = id;
        },
        getPlayer1Id: function() {
            return this.player1Id;
        },
        setPlayer2Id: function(id){
            this.player2Id = id;
        },
        getPlayer2Id: function() {
            return this.player2Id;
        },
        setPlayer1Choice: function(choice) {
            this.player1Choice = choice;
            drawPlayerImage(1, choice);
        },
        setPlayer2Choice: function(choice) {
            this.player2Choice = choice;
            drawPlayerImage(2, choice);
        }
    };
    clearGameScreen();
    return game;
    
}

/**
 * Show Win Message.
 * @returns {undefined}
 */
function showWinScreen() {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    var backgroundImage = document.getElementById("winScreen");
    var xPos = (game.getPlayer1Id() === currentPlayer.getId() ? 0 : 400);
    context2D.drawImage(backgroundImage, xPos, 0);
}

/**
 * Show Lose Message.
 * @returns {undefined}
 */
function showLoseScreen() {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    var xPos = (game.getPlayer1Id() === currentPlayer.getId() ? 0 : 400);
    var backgroundImage = document.getElementById("loseScreen");
    context2D.drawImage(backgroundImage, xPos, 0);
}

/**
 * Show Tie Message.
 * @returns {undefined}
 */
function showTieScreen() {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    var xPos = (game.getPlayer1Id() === currentPlayer.getId() ? 0 : 400);
    var backgroundImage = document.getElementById("tieScreen");
    context2D.drawImage(backgroundImage, xPos, 0);
}


/**
 * Clear Game screen.
 * @returns {undefined}
 */
function clearGameScreen() {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    context2D.clearRect(0, 0, canvas.width, canvas.height);
}


/**
 * Draws player choice.
 * @param {type} playerNumber
 * @param {type} choice
 * @returns {undefined}
 */
function drawPlayerImage(playerNumber, choice) {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    var rockImage = document.getElementById("rock");
    var paperImage = document.getElementById("paper");
    var scissorsImage = document.getElementById("scissors");
    
    if (game.player1Choice != "" && game.player2Choice != "") {
        if (game.player1Choice == "rock") {
            context2D.drawImage(rockImage, 0, 0);
        } else if (game.player1Choice == "scissors") {
            context2D.drawImage(scissorsImage, 0, 0);
        } else if (game.player1Choice == "paper") {
            context2D.drawImage(paperImage, 0, 0);
        }
        if (game.player2Choice == "rock") {
            context2D.drawImage(rockImage, 400, 0);
        } else if (game.player2Choice == "scissors") {
            context2D.drawImage(scissorsImage, 400, 0);
        } else if (game.player2Choice == "paper") {
            context2D.drawImage(paperImage, 400, 0);
        }
    }
}
/**
 * Handle Change button click event.
 * @type type
 */
$(document).on("click", "button.challenge", function(event){
    var name = $(this).attr("name");
    var value = $(this).attr("value");
    $("#challengeBox").html("You have Challenged "+name+"! Waiting for "+name+" to Accept");
    $("#challengeBox").show();
    $("button.challenge").attr("disabled", true);
    var message = {
        action: "challenge",
        userChallenged: value,
        challenger: currentPlayer.id,
    }
    socket.send(JSON.stringify(message));
});

//variable to hold rejection timeout.
var rejectionTimer;
/**
 * show challenge box.
 * @param {type} challengerName
 * @param {type} challengerId
 * @returns {undefined}
 */
function showChallengeBox(challengerName, challengerId) {
    $("#challengeBox").html(challengerName + " has Challenged you to a battle! Do you Accept"
+ "<div><button class='acceptChallenge' value='"+challengerId+"'>Accept</button>"
+ "<button class='rejectChallenge' value='"+challengerId+"'>Reject</button></div>");
    $("button.challenge").attr("disabled", true);
    $("#challengeBox").show();
    rejectionTimer = setTimeout(rejectChallenge, 10000);
}

/**
 * Reject Challenge.
 * @returns {undefined}
 */
function rejectChallenge() {
    var challengerId = $("button.challenge").attr("value");
    var message = {
        action: "rejectChallenge",
        userId: challengerId
    }
    socket.send(JSON.stringify(message));
    $("button.challenge").attr("disabled", false);
    $("#challengeBox").hide();
}


/**
 * handle accept challenge button click.
 */
$(document).on("click", "button.acceptChallenge", function(e){
    var challengerId = $("button.challenge").attr("value");
    var message = {
        action: "acceptChallenge",
        userId: challengerId,
        opponentId: currentPlayer.id
    }
    socket.send(JSON.stringify(message));
    $("button.challenge").attr("disabled", false);
    $("#challengeBox").html("");
    clearTimeout(rejectionTimer);
});

/**
 * Start game.
 * @param {type} player1
 * @param {type} player2
 * @returns {undefined}
 */
function startGame(gameId, player1, player2) {
    $("button.choice").attr("disabled", false);
    game = createGame(gameId, player1, player2);
    $("#challengeBox").html("");
    $("button.challenge").attr("disabled", false);
    showGameScreen();
}


/**
 * handle reject challenge button click.
 */
$(document).on("click", "button.rejectChallenge", function(e) {
    rejectChallenge();
});

/**
 * handle rejection from other player.
 * @returns {undefined}
 */
function handleRejection() {
    $("button.challenge").attr("disabled", false);
    $("#challengeBox").hide();
}




/**
 * Handle choice click event
 * @type type
 */
$("button.choice").click(function() {
    var choice = $(this).attr("value");
    $("button.choice").attr("disabled", true);
    var message = {
        action: "userGameChoice",
        gameId: game.id,
        userId: currentPlayer.id,
        choice: choice
    };
    if (currentPlayer.id === game.getPlayer1Id()) {
        game.setPlayer1Choice(choice);
    } else if (currentPlayer.id === game.getPlayer2Id()) {
        game.setPlayer2Choice(choice);
    }
    socket.send(JSON.stringify(message));
});

/**
 * Handle login button click event.
 */
$("button.login").click(function() {
    var userId = $("input[name='playerId']").val();
    var password = $("input[name='password']").val();
    var status = 1;
    var message = {
        action: "login",
        userId: userId,
        password: password,
        status: status
    };
    socket.send(JSON.stringify(message));
});

/**
 * Show win scenario
 * @returns {undefined}
 */
function showWinScenario() {
    setTimeout(function() {
        showWinScreen();
        game = null;
        setTimeout(function() {
           showLeaderScreen();
        }, 10000);
    }, 10000);
}

/**
 * Show tie scenario
 * @returns {undefined}
 */
function showTieScenario() {
    setTimeout(function() {
        showTieScreen();
        game = null;
        setTimeout(function() {
            showLeaderScreen();
        }, 10000);
    }, 10000);
}

/**
 * show lose scenario
 * @returns {undefined}
 */
function showLoseScenario() {
    showLoseScreen();
    setTimeout(function() {
        game = null;
        setTimeout(function() {
            showLeaderScreen();
        }, 10000);
    }, 10000);
}


