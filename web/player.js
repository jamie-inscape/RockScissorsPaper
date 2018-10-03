/**
 * Player
 */

/**
 * Global Variables
 * @type type
 */
var currentPlayer = null;
var isPlaying = false;
var game = null;

/**
 * Return a new player object.
 * @param {type} id
 * @param {type} name
 * @param {type} status
 * @param {type} score
 * @returns {createPlayer.newplayer}
 */
function createPlayer(id, name, status, score) {
	
    var newplayer = {
	id: id,
	name: name,
	choice: "",
	status: status,
        score: score,
        setId: function(id) {
            this.id = id;
        },
        getId: function() {
            return this.id;
        },
        setName: function(name) {
            this.name = name;
        },
        getName: function() {
            return this.name;
        },
        setChoice: function(choice) {
            this.choice = choice;
        },
        getChoice: function() {
            return this.choice;
        },
        setStatus: function(status) {
            this.status = status;
        },
        getStatus: function() {
            return this.status;
        }       
    }
    return newplayer;
}