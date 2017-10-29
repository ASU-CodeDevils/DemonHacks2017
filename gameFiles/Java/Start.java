
 */
package net.sf.memoranda;

import java.net.ServerSocket;
import java.net.Socket;

import javax.swing.JFrame;
import javax.swing.JPanel;
import net.sf.memoranda.ui.*;
import net.sf.memoranda.util.Configuration;


public class Start {
	
	static boolean isAuthenticated;         // added for login mar 2017
	
    
    static App app = null;
    
    static int DEFAULT_PORT = 19432;
    static boolean checkIfAlreadyStartet = true;
    
    static {
        String port = Configuration.get("PORT_NUMBER").toString().trim();
        if (port.length() >0) {
            // The Portnumber must be between 1024 (in *nix all Port's < 1024
            // are privileged) and 65535 (the highest Portnumber everywhere)
            int i = Integer.parseInt(port);
            if ((i >= 1024) && (i <= 65535)) {
                DEFAULT_PORT = i;
            }
            /*DEBUG*/ //System.out.println("Port " + DEFAULT_PORT + " used.");
        }
        
        String check = Configuration.get("CHECK_IF_ALREADY_STARTED").toString().trim();
        if (check.length() > 0 && check.equalsIgnoreCase("no")) {
            checkIfAlreadyStartet = false;
        }
    }
    
    /* login and built and runs before program launches 3/2017 Dave Arnold*/
    
    public static void main(String[] args) {
    	
    	isAuthenticated = false;
    	
    	JFrame frame = new JFrame("Welcome to Memoranda");  // create frame size and loc
		frame.setSize(600, 300);
		frame.setLocationRelativeTo(null);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		JPanel panel = new JPanel();
		frame.add(panel);
		new BuildLoginElements(panel);
		
		do{
			frame.setVisible(true);
			getAuthenticateUser();
			
			
			
		}while(!isAuthenticated);   // end of login
		frame.dispose();            // release all resources used by this window
		
		if (checkIfAlreadyStartet) {
            try {
                // Try to open a socket. If socket opened successfully (app is already started), take no action and exit.
                Socket socket = new Socket("127.0.0.1", DEFAULT_PORT);
                socket.close();
                System.exit(0);
                
            } catch (Exception e) {
                // If socket is not opened (app is not started), continue
                // e.printStackTrace();
            }
            new SLThread().start();
        }
        
        //System.out.println(EventsScheduler.isEventScheduled());
        if ((args.length == 0) || (!args[0].equals("-m"))) {
            app = new App(true);
        }
        else
            app = new App(false);
    } // end main method
    
    /* setters and getters for login */
    
    protected static void setAuthenticateUser(boolean auth) {
    	isAuthenticated=auth;
    } 
    protected static boolean getAuthenticateUser(){
    	return isAuthenticated;
    }
	
}  // end Start class
    

class SLThread extends Thread {
    
    public void run() {
        ServerSocket serverSocket = null;
        try {
            serverSocket = new ServerSocket(Start.DEFAULT_PORT);
            serverSocket.accept();
            Start.app.show();
            serverSocket.close();
            new SLThread().start();
            
        } catch (Exception e) {
            System.err.println("Port:"+Start.DEFAULT_PORT);
            e.printStackTrace();
            new ExceptionDialog(e, "Cannot create a socket connection on localhost:"+Start.DEFAULT_PORT,
            "Make sure that other software does not use the port "+Start.DEFAULT_PORT+" and examine your security settings.");
        }
    } // end run method
}  // end SLThread class


