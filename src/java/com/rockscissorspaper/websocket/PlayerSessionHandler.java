package com.rockscissorspaper.websocket;
import javax.enterprise.context.ApplicationScoped;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.websocket.Session;
import com.rockscissorspaper.model.Player;import java.sql.ResultSet;


@ApplicationScoped
public class PlayerSessionHandler {

	private int playerId = 0;
	private final Set<Session> sessions = new HashSet<>();
	private final Set<Player> players = new HashSet<>();
        
        /**
         * Constructor.
         */
        public PlayerSessionHandler() {
            try {
                ResultSet rs = SQLLiteDatabase.selectAll();
            
                while(rs.next()) {
                    Player p = new Player();
                    p.setId(rs.getInt("id"));
                    p.setName(rs.getString("name"));
                    p.setScore(rs.getInt("score"));
                    p.setStatus(rs.getInt("status"));
                    p.setPassword(rs.getString("password"));
                    players.add(p);
                }    
            } catch (Exception e) {
                System.out.println(e);
            }  
        }
	
        /**
         * Add session.
         * @param session 
         */
	public void addSession(Session session) {
		sessions.add(session);
		for (Player player : players) {
			JsonObject addMessage = createAddMessage(player);
			sendToSession(session, addMessage);
		}
	}
	
	public void removeSession(Session session) {
            sessions.remove(session);
	}
	
	public List<Player> getPlayers() {
            return new ArrayList<>(players);
	}
	
        /**
         * send login player message.
         * @param player 
         */
	public void loginPlayer(Player player) {
		JsonObject loginMessage = createLoginMessage(player);
		sendToAllConnectedSessions(loginMessage);
	
	}
	
        /**
         * Send add player message.
         * @param player 
         */
        public void addPlayer(Player player) {
		JsonObject addMessage = createAddMessage(player);
		sendToAllConnectedSessions(addMessage);
	}
        
        /**
         * send accept login message.
         * @param player
         * @param session 
         */
        public void acceptLogin(Player player, Session session) {
            JsonObject acceptLoginMessage = createAcceptLoginMessage(player);
            sendToSession(session, acceptLoginMessage);
        }
        
        /**
         * send reject login message.
         * @param id 
         */
        public void rejectLogin(Session session) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject rejectMessage = provider.createObjectBuilder()
                    .add("action", "rejectLogin")
                    .build();
            sendToSession(session, rejectMessage);
        }
        
	public void removePlayer(int id) {
		Player player = getPlayerById(id);
		if (player != null) {
                    players.remove(player);
                    JsonProvider provider = JsonProvider.provider();
                    JsonObject removeMessage = provider.createObjectBuilder()
			.add("action", "remove")
			.add("id", id)
			.build();
                    sendToAllConnectedSessions(removeMessage);
				
		}
	}
	
        /**
         * Issue Challenge to user.
         * @param challengerId
         * @param userChallengedId 
         */
        public void issueChallenge(int challengerId, int userChallengedId) {
            Player p = getPlayerById(challengerId);
            JsonProvider provider = JsonProvider.provider();
            JsonObject challengeMessage = provider.createObjectBuilder()
                    .add("action", "challengeSent")
                    .add("challengerId", challengerId)
                    .add("userChallengedId", userChallengedId)
                    .add("challengerName", p.getName())
                    .build();
            sendToAllConnectedSessions(challengeMessage);
        }
        
        /**
         * Reject challenge
         * @param userId
         */
        public void rejectChallenge(int userId) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject rejectChallengeMessage = provider.createObjectBuilder()
                    .add("action", "challengeRejected")
                    .add("userId", userId)
                    .build();
            sendToAllConnectedSessions(rejectChallengeMessage);
        }
        
        /**
         * Start Game.
         * @param player1
         * @param player2
         */
        public void startGame(int player1, int player2) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject startGameMessage = provider.createObjectBuilder()
                    .add("action", "startGame")
                    .add("player1", player1)
                    .add("player2", player2)
                    .build();
            sendToAllConnectedSessions(startGameMessage);
        }
        
	public void togglePlayer(int id) {
		
	}
	
        /**
         * Get player by id.
         * @param id
         * @return 
         */
	public Player getPlayerById(int id) {
            for (Player player : players) {
                    if (player.getId() == id) {
                            return player;
                    }
            }
            return null;
	}
	
        /**
         * Create add message 
         * @param player
         * @return 
         */
	private JsonObject createAddMessage(Player player) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject addMessage = provider.createObjectBuilder()
			.add("action", "add")
			.add("id", player.getId())
                        .add("name", player.getName())
                        .add("score", player.getScore())
                        .add("status", player.getStatus())
			.build();
		return addMessage;
	}
	
        /**
         * create login message.
         * @param player
         * @return 
         */
        private JsonObject createLoginMessage(Player player) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject loginMessage = provider.createObjectBuilder()
                    .add("action", "login")
                    .add("id", player.getId())
                    .add("name", player.getName())
                    .add("score", player.getScore())
                    .add("status", player.getStatus())
                    .build();
            return loginMessage;
	}
        
        /**
         * create accept login message.
         * @param player
         * @return 
         */
        private JsonObject createAcceptLoginMessage(Player player) {
            JsonProvider provider = JsonProvider.provider();
            JsonObject loginMessage = provider.createObjectBuilder()
                    .add("action", "acceptLogin")
                    .add("id", player.getId())
                    .add("name", player.getName())
                    .add("score", player.getScore())
                    .add("status", player.getStatus())
                    .build();
            return loginMessage;
	}
        
        /**
         * send to all sessions / users.
         * @param message 
         */
	private void sendToAllConnectedSessions(JsonObject message) {
            for(Session session : sessions) {
                sendToSession(session, message);
            }
	}
	
        /**
         * send to specific session / user.
         * @param session
         * @param message 
         */
	private void sendToSession(Session session, JsonObject message) {
            try {
                    session.getBasicRemote().sendText(message.toString());

            } catch (IOException ex) {
                    sessions.remove(session);
                    Logger.getLogger(PlayerSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
            }	
	}
}
