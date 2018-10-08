/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.rockscissorspaper.websocket;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @author jamietung
 */
public class SQLLiteDatabase {
    
    /**
     * Return mysql database Connection.
     * @return con
     */
    public static Connection connect() {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/RSPUsers?useSSL=false", "root", "BalloonCat");
            return con;
        } catch (Exception e) {
            System.out.println(e);
        }
        return null;
    }
    
    /**
     * Return select all result set.
     * @return 
     */
    public static ResultSet selectAll() {
        try{  
            Connection con = connect();
            Statement stmt=con.createStatement();  
            ResultSet rs=stmt.executeQuery("select * from Users");  
            return rs;
              
        }catch(Exception e){ 
            System.out.println(e);
        }   
        return null;
    }
    
    /**
     * Change status of user with specified id
     * @param id
     * @param status 
     */
    public static void changeStatus(int id, int status) {
        try {
            Connection con = connect();
            Statement stmt=con.createStatement();  
            ResultSet rs=stmt.executeQuery("UPDATE Users " +
"SET status = " + status +
" WHERE CustomerID =" + id); 
            con.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    
    /**
     * Change score of user in database.
     * @param id
     * @param score 
     */
    public static void changeScore(int id, int score) {
        try {
            Connection con = connect();
            Statement stmt=con.createStatement();  
            ResultSet rs=stmt.executeQuery("UPDATE Users " +
"SET score = " + score +
" WHERE CustomerID =" + id);  
            System.out.println("i am here");
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    
    /**
     * add player with specified id
     * @param id
     * @param status
     */
    public static void addPlayer(int id, String userName, String password,int status) {
        try {
            Connection con = connect();
            Statement stmt=con.createStatement();  
            ResultSet rs=stmt.executeQuery("INSERT INTO RSPUsers.Users (id, name, status, Password, score) " +
"VALUES ("+id+",'"+ userName + "',"+ status + ",'"+ password + "', 0)"); 
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    
}
