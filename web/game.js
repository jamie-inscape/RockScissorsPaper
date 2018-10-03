/**
 * Game Class
 */

/**
 * Create new game.
 * @returns game
 */
function createGame(player1, player2) {
	
    var game = {
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
        },
        setPlayer2Choice: function(choice) {
                this.player2Choice = choice;
        },
    };
    return game;
}

/**
 * Handle Change button click event.
 * @type type
 */
$(document).on("click", "button.challenge", function(event){
    var name = $(this).attr("name");
    var value = $(this).attr("value");
    $("#challengeBox").html("You have Challenged "+name+"! Waiting for "+name+" to Accept");
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
    rejectionTimer = setTimeout(rejectChallenge, 7000);
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
    $("#challengeBox").hide();
    clearTimeout(rejectionTimer);
    
});

/**
 * Start game.
 * @param {type} player1
 * @param {type} player2
 * @returns {undefined}
 */
function startGame(player1, player2) {
    game = createGame(player1, player2);
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
    $("button.choice").attr("disabled", true);
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
 * exit game.
 * @returns
 */
function exitGame() {
	showOutcome();
}

/**
 * show outcome.
 * @returns
 */
function showOutcome() {
	
}