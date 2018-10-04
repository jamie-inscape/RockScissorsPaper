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
        setPlayer2Id: function(id){
                this.player2Id = id;
        },
        setPlayer1Choice: function(choice) {
                this.player1Choice = choice;
                drawPlayerImage(1, choice);
        },
        setPlayer2Choice: function(choice) {
                this.player2Choice = choice;
                drawPlayerImage(2, choice);
        },
    };
    return game;
    
}

function drawPlayerImage(playerNumber, choice) {
    var canvas = document.getElementById("playerCanvas");
    var context2D = canvas.getContext("2d");
    if (playerNumber == 1) {
        
    } else if (playerNumber == 2) {
        
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
    game = null;
    console.log("you won!");
    showLeaderScreen();
}

/**
 * Show tie scenario
 * @returns {undefined}
 */
function showTieScenario() {
    game = null;
    console.log("you tied!");
    showLeaderScreen();
}

/**
 * show lose scenario
 * @returns {undefined}
 */
function showLoseScenario() {
    game = null;
    console.log("you lost!");
    showLeaderScreen();
}


