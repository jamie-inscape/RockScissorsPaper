package com.rockscissorspaper.websocket;

import javax.websocket.server.ServerEndpoint;

import com.rockscissorspaper.model.Player;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;

import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;

@ApplicationScoped
@ServerEndpoint("/actions")
public class PlayerWebSocketServer {
	
	@Inject
	private PlayerSessionHandler sessionHandler;

	@OnOpen
		public void open(Session session) {
			//if (sessionHandler == null) sessionHandler = new PlayerSessionHandler();
			sessionHandler.addSession(session);
	}
	
	@OnClose
		public void close(Session session) {
			sessionHandler.removeSession(session);
	}
	
	@OnError
		public void onError(Throwable error) {
			Logger.getLogger(PlayerWebSocketServer.class.getName()).log(Level.SEVERE, null, error);
	}
	
	@OnMessage
        public void handleMessage(String message, Session session) {

            try (JsonReader reader = Json.createReader(new StringReader(message))) {
                JsonObject jsonMessage = reader.readObject();

                if ("add".equals(jsonMessage.getString("action"))) {
                        Player player = new Player();
                        player.setName(jsonMessage.getString("name"));
                        sessionHandler.addPlayer(player);

                } else if ("remove".equals(jsonMessage.getString("action"))) {
                        int id = (int) jsonMessage.getInt("id");
                        sessionHandler.removePlayer(id);
                } else if ("toggle".equals(jsonMessage.getString("action"))) {
                    int id = (int) jsonMessage.getInt("id");
                    sessionHandler.togglePlayer(id);
                } else if ("login".equals(jsonMessage.getString("action"))) {
                    String idString = jsonMessage.getString("userId");
                    int id = Integer.parseInt(idString);
                    int status;
                    status = (int) jsonMessage.getInt("status");
                    String password = jsonMessage.getString("password");
                    if (verifyLogin(id, password)) {
                        updatePlayerStatus(id, 1);
                        Player p = sessionHandler.getPlayerById(id);
                        sessionHandler.acceptLogin(p, session);
                        sessionHandler.loginPlayer(p);
                    } else {
                        sessionHandler.rejectLogin(session);
                    }
                } else if ("challenge".equals(jsonMessage.getString("action"))) {
                    int challengerId = jsonMessage.getInt("challenger");
                    String userChallengedStr = jsonMessage.getString("userChallenged");
                    int userChallengedId =Integer.parseInt(userChallengedStr);
                    sessionHandler.issueChallenge(challengerId, userChallengedId);
                } else if ("rejectChallenge".equals(jsonMessage.getString("action"))) {
                    int userId = Integer.parseInt(jsonMessage.getString("userId"));
                    sessionHandler.rejectChallenge(userId);
                } else if ("acceptChallenge".equals(jsonMessage.getString("action"))) {
                    System.out.println(jsonMessage);
                    String userId = jsonMessage.getString("userId");
                    //String opponentId = 
                    int player1 = Integer.parseInt(userId);
                    int player2 = (int)jsonMessage.getInt("opponentId");
                    sessionHandler.startGame(player1, player2);
                            
                }
            }			
	}
        
        /**
         * Return true is password matches stored password for user, otherwise
         * return false;
         * @param id
         * @param password
         * @return 
         */
        public boolean verifyLogin(int id, String password) {
            Player p = sessionHandler.getPlayerById(id);
            if (password.equals(p.getPassword())) {
                return true;
            }
            return false;
        }
        
        /**
         * Update player status in set.
         */
        public void updatePlayerStatus(int id, int status) {
            Player p = sessionHandler.getPlayerById(id);
            p.setStatus(status);
        }
        
       
}
        
        
