package com.rockscissorspaper.model;

public class Player {
	
	private int id;
	private String name;
	private int score;
	private int status;
	private String password;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score = score;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public void setPassword(String password) {
            this.password = password;
        }
	public String getPassword() {
            return this.password;
        }
	
}
