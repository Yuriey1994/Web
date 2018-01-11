import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/webchat")
public class WebChatSocket {
	public static Set<Session> sessionSet = new HashSet<Session>();
	public void updateOnlineAmount(){
		for(Session s:sessionSet){
			s.getAsyncRemote().sendText("{type:\"updateOnlineAmount\",onlineAmount:"+sessionSet.size()+"}");
        }
	}
	@OnOpen
	public void onOpen(Session session){
		System.out.println("onOpen:"+session.getId());
		System.out.println("onOpen cip:"+session.getRequestParameterMap().get("cip"));
		sessionSet.add(session);
		updateOnlineAmount();
		System.out.println("sessionSetSize:"+sessionSet.size());
	}
	@OnClose
	public void onClose(Session session){
		System.out.println("onClose:"+session.getId());
		sessionSet.remove(session);
		updateOnlineAmount();
		System.out.println("sessionSetSize:"+sessionSet.size());
	}
	@OnMessage
	public void onMessage(String message, Session session){
		System.out.println("onMessage:"+message+"|sessionid="+session.getId());
		for(Session s:sessionSet){
			if(s.getId()!=session.getId()){
				s.getAsyncRemote().sendText(message);
			}
        } 
	}
	@OnError
	public void onError(Session session, Throwable error){
	    System.out.println("onError:·¢Éú´íÎó");
		error.printStackTrace();
	}
}
