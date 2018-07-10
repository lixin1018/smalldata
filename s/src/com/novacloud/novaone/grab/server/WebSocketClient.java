package com.novacloud.novaone.grab.server;

import java.io.IOException; 
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/gws")
public class WebSocketClient{

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    
    private String clientId = null;
    public String getClientId(){
    	return this.clientId;
    }

    /**
     * 连接建立成功调用的方法
     * @param session  可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    @OnOpen
    public void onOpen(){ 
        TalkMaster.addWebSocketClient(this);
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(){
        TalkMaster.removeWebSocketClient(this);  
    } 

    /**
     * 发生错误时调用
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error){
        System.out.println("发生错误");
        error.printStackTrace();
    }

    /**
     * 这个方法与上面几个方法不一样。没有用注解，是根据自己需要添加的方法。
     * @param message
     * @throws Exception 
     * @throws IOException
     */
    public void sendMessage(String message) throws Exception{
    	try{
    		this.session.getBasicRemote().sendText(message);
    	}
    	catch(Exception ex){
    		ex.printStackTrace();
    		this.close();
    	}
        
    }
    
	@OnMessage
    public void onMessage(String message, Session session) throws Exception{
        System.out.println("接收到数据（from clientId = " + this.clientId + "）: " + message);
        if(message.startsWith("test: ")){
        	this.sendMessage("test: response from server.");
        }
        else if(message.startsWith("reg: ")){
        	String clientId = message.substring(5);
        	this.clientId = clientId;
        	this.sendMessage("reg: succeed。");
        }
        else if(message.startsWith("close: ")){
        	this.close();
        }
        else{
        	//返回爬取进度等信息
        	
        }
        
	}
	
	private void close() throws Exception{
		try{
			if(this.session.isOpen()){
				this.session.close();
			}
		}
		catch(Exception ex){
			throw ex;
		}
	}
}

