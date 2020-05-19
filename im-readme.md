#客户端开发指南
请参照`ClientDemo.java`，该Demo包含连接服务器、登录、发送心跳、消息回执、断开重连等功能；

## 引入im.protocol中jar包
	im.protocol-0.0.1.jar
## pom.xml中添加依赖
	<dependency>
		<groupId>io.netty</groupId>
		<artifactId>netty-all</artifactId>
		<version>4.0.28.Final</version>
	</dependency>
	<dependency>
		<groupId>com.google.protobuf</groupId>
		<artifactId>protobuf-java</artifactId>
		<version>3.5.1</version>
	</dependency>

## 创建客户端到发送消息
	//实例化客户端
	SimpleClient client = new SimpleClient();
	//用户IMID
	String mid = "im-id";
	//服务器校验token(业务服务器返回)
	String token = "im-token";
	//设置服务器端口(业务服务器返回)
	client.setPort(9097);
	//设置服务器IP地址(业务服务器返回)
	client.setHost("127.0.0.1");
	//初始化
	client.init();
	//连接服务器，连接成功后回调发送登录协议
	client.connect(mid, token);
	
	//构建接收者JID
	Jid to = Jid.newBuilder().setId(mid).setResource("android").build();
	//构建发送者JID
	Jid from = Jid.newBuilder().setId(mid).setResource("android").build();
	//构建MessageMsg类型消息
	MessageMsg msg = MessageMsg.newBuilder().setMid(mid).setTo(to).setFrom(from).setContent("from [" + mid + "] client chat test.").setMsgType(MsgType.chat).build();
	//结构发送消息
	Message message = Message.newBuilder().setMessageType(MessageType.messageMsg).setMessageMsg(msg).build();

	//发送消息
	client.channel.writeAndFlush(message);
## 注意：
1. Message类型的消息是所有消息的载体，在每次发送的时候消息封装在该消息体内，根据`setMessageType`区分消息类型；
2. 对于客户端来说在每次收到消息的时候需要发送回执消息服务器才知道消息成功接受，否则在条件满足的情况下会再次发送没有发送回执的消息；
3. 客户端需要在规定时间内发送心跳消息；
4. 客户端在获取消息后需要根据消息类型做对应的操作
5. 客户端收到的消息可能因为网络原因已经收到了需要做去重处理，客户端同样需要发送消息回执给服务端；
6. 客户端需要通过发送消息协议获取离线消息，协议如下：
	`Message.newBuilder().setMessageType(MessageType.offlineMessage).build()`
7. 如客户端网络变化建议重新登录IM服务器(业务服务器不需要重新登录)

## 说明：
1. Jid字段说明：
	1. `id` 用户的Mid
	2. `name` 用户昵称
	3. `avatar` 用户登录头像，该值为url
	4. `resource` 客户端登录的资源设备，Android客户端为`android`，IOS客户端为`ios`，websocket客户端为`ws`
2. MessageType消息类型说明：
	1. `ping`发送心跳，在规定时间内发送该类型消息，否则session将失效，该消息不用携带任何消息类容，如：`Message.newBuilder().setMessageType(MessageType.ping).build()`；
	2. `receipt`消息回执，在收到消息的时候发送该类型的消息，并设置Mid，如：` Message.newBuilder().setMid(mid).setMessageType(MessageType.receipt).build()`;
	3. `authMsg`认证消息，在登录的时候发送该消息，如果认证错误会发ErrorMsg消息通过认证则是发AuthMsg。该消息类型需要设置jid、token及setAuthMsg，如：
		`Jid jid = Jid.newBuilder().setId(mid).setResource("android").build();`
		`AuthMsg auth = AuthMsg.newBuilder().setJid(jid).setToken(token).build();`
		`Message message = Message.newBuilder().setMessageType(MessageType.authMsg).setAuthMsg(auth).build();`
	4. `messageMsg`消息类型是一般消息,该消息通过setMsgType设置多种消息类型，点对点消息为`MsgType.chat`类型，还有repeal(撤销消息)、readburn(阅后即焚),例：
		`MessageMsg msg = MessageMsg.newBuilder().setMid(mid).setTo(to).setFrom(from).setContent("消息内容.").setMsgType(MsgType.chat).build();`
		`Message message = Message.newBuilder().setMessageType(MessageType.messageMsg).setMessageMsg(msg).build();`
3. `MsgType`类型说明：
	1. `chat` 普通消息，点对点，客户端获取到该类型消息说明收到一条来至其他用户发送的消息，需要去重处理，根据mid去重，如果发送文字消息`privateContent`标示，如果发送视频、图片获取其他的类型，`privateContent`中标示对照表如下表一；
	2. `readed` 已读(需要设置Mid)，客户端获取到该类型消息需要将已发送的消息标记为已读
	3. `repeal` 撤销消息(需要设置Mid)，客户端获取到该类型消息需要撤销已经收到的消息
	4. `readburn` 阅后即焚(需要设置Mid)，客户端获取到该类型消息阅读后需要销毁
	5. `notify` 通知消息
	6. `offline` 离线消息，标示消息为离线消息（只有`chat`类型消息存离线后才将`chat`类型消息修改为该类型消息）

表一：(通过privateContent标示MessageMsg中content字段内容类型)

Key| Value | 说明 
----|-------|----
contentType|text|内容文本
contentType|img|内容为图片
contentType|voice|内容为音频
contentType|video|内容为视频

##错误码ErrorCode
类型| 默认值 | 说明 
----|-------|----
SERVER_INITING|10000|服务器初始化中
SERVER_STOP|10001|服务器停止
SERVER_PAUSE|10002|服务器暂停
SERVER_OVERLOADING|10003|服务器超负载
CLIENT_LOGIN_OTHER_PLACE|20000|客户端异地登录
CLIENT_DISCONNECTION|20001|客户端断开连接
PROTOCOL_ERROR|30001|协议错误
PARAM_ERROR|30002|参数错误
AUTH_ERROR|40001|认证失败 
SEND_WARNING|40002|频繁发送消息警告
AUTH_LIMIT|40001|认证限制，禁止登陆 

流量控制规则：登陆后1秒钟发超10条消息将触发警告，如一次登陆有五次触发（一次触发后还继续发送消息也算一次触发）后IP被列入黑名单，黑名单IP不能登录，直到禁言结束