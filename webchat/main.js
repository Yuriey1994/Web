$(document).ready(function(){
	var socket = new WebSocket("ws://127.0.0.1:8080/WebSocketServer/webchat?cip="+returnCitySN.cip);
	$("#online-state").html("正在连接...");
	socket.onopen = function(evt){
		// Web Socket 已连接上，使用 send() 方法发送数据
		//socket.send("发送数据");
		console.log("已连接！");
		$("#input-message").attr("disabled",false);
		$("#btn-send").attr("disabled",false);
		$("#btn-send").click(function(){
			sendMessage();
		});
	};
	socket.onmessage = function (evt) 
	{ 
		var received_msg = evt.data;
		console.log("数据已接收！");
		console.log("data:"+received_msg);
		parseMessage(eval("("+received_msg+")"));
	};
	socket.onclose = function (evt)
	{ 
		// 关闭 websocket
		console.log("连接已关闭！");
		$("#online-state").html("连接已关闭！");
	};
	socket.onerror = function(evt){
		console.log("发生错误！");
	}
	function sendMessage(){
		var msgJson={
			type:"addMessage",
			cip:returnCitySN.cip,
			cname:returnCitySN.cname,
			message:$("#input-message").val()
		}
		if(msgJson.message=="")return;
		parseMessage(msgJson);
		if(socket.readyState==1){
			socket.send(JSON.stringify(msgJson));
		}
		$("#input-message").val("");
	}
	function parseMessage(msgJson){
		if(msgJson.type=="addMessage"){
			if($(".message-content")[0].childElementCount>=50){
			$(".message-content")[0].children[0].remove();
			}
			var msgElement=$("<font/>").html(msgJson.message);
			var senderElement=$("<Strong/>").html(msgJson.cip+"&nbsp;"+"("+msgJson.cname+"):");
			var msgContentRow=$("<div/>").addClass("alert alert-info message-detail-div");
			senderElement.appendTo(msgContentRow);
			msgElement.appendTo(msgContentRow);
			msgContentRow.appendTo($(".message-content")[0]);
			$(".message-content")[0].scrollTop=$(".message-content")[0].scrollHeight;
		}
		else if(msgJson.type=="updateOnlineAmount")
		{
			$("#online-state").html("当前在线"+msgJson.onlineAmount+"人");
		}
	}
});
