package com.novacloud.novaone.grab.server;
 
import java.util.concurrent.CopyOnWriteArraySet;
import org.springframework.beans.factory.InitializingBean;

public class TalkMaster implements InitializingBean{

	//静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
	private static int onlineCount = 0;

	//concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
	private static CopyOnWriteArraySet<WebSocketClient> webSocketSet = new CopyOnWriteArraySet<WebSocketClient>();


	public static synchronized int getOnlineCount() {
		return onlineCount;
	}

	private static synchronized void addOnlineCount() {
		onlineCount++;
	}

	private static synchronized void subOnlineCount() {
		onlineCount--;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub 
	}
	 
	public static void addWebSocketClient(WebSocketClient wsClient){
		webSocketSet.add(wsClient);
		addOnlineCount();
        System.out.println("有新连接加入！当前在线客户端数为" + getOnlineCount());
	}	
	 
	public static void removeWebSocketClient(WebSocketClient wsClient){
		webSocketSet.remove(wsClient);
		subOnlineCount();
        System.out.println("有一连接关闭！当前在线客户端数为" + getOnlineCount());
	} 
	
	public static void sendMessage(WebSocketClient client, String msg) throws Exception{
		client.sendMessage(msg);
	}

}
