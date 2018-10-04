/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.rockscissorspaper.model;

/**
 *
 * @author jamietung
 */
public class Game {
    
    private int id;
    private int player1Id;
    private int player2Id;
    private String player1Choice = "";
    private String player2Choice = "";
    private static int lastGameId=0;
    
    /**
     * Game Constructor.
     * @param id
     * @param player1Id
     * @param player2Id 
     */
    public Game(int player1Id, int player2Id) {
        this.id = lastGameId++;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
    }

    /**
     * Get Id
     * @return 
     */
    public int getId() {
        return id;
    }

    /**
     * Set Id
     * @param id 
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Get Player 1 Id.
     * @return 
     */
    public int getPlayer1Id() {
        return player1Id;
    }

    /**
     * Set Player 1 Id.
     * @param player1Id 
     */
    public void setPlayer1Id(int player1Id) {
        this.player1Id = player1Id;
    }

    /**
     * Get Player 2 Id.
     * @return 
     */
    public int getPlayer2Id() {
        return player2Id;
    }

    /**
     * Set Player 2 Id.
     * @param player2Id 
     */
    public void setPlayer2Id(int player2Id) {
        this.player2Id = player2Id;
    }

    /**
     * Get Player 1 Choice.
     * @return 
     */
    public String getPlayer1Choice() {
        return player1Choice;
    }

    /**
     * Set Player 1 Choice.
     * @param player1Choice 
     */
    public void setPlayer1Choice(String player1Choice) {
        this.player1Choice = player1Choice;
    }

    /**
     * Get Player 2 Choice.
     * @return 
     */
    public String getPlayer2Choice() {
        return player2Choice;
    }

    /**
     * Get Player 2 Choice.
     * @param player2Choice 
     */
    public void setPlayer2Choice(String player2Choice) {
        this.player2Choice = player2Choice;
    }
    
}
