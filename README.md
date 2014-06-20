node-tudou ![](https://badge.fury.io/js/tudou.png)
==========

土豆node.js客户端

## 安装
````
$ npm install tudou
````

## 使用

### 授权方法
````
var Tudou = require('tudou'),
	tudou = new Tudou({
    "app_key"		: "{{app_key}}",
    "app_secret"	: "{{app_secret}}"
  }),
	querystring = require('querystring');

app.get('oauth', function(req, res, next){
	var config = tudou.config,
		state = Math.round(Math.random() * 1000000000),
		params = {
			client_id	:	config.app_key,
			response_type:	'code',
			redirect_uri:	'{{redirect_uri}}',
			scope		:	'video_info,user_base_info',
			state		:	state
		};
	req.session[state] = {
		callback_url : req.query.callback_url || req.headers.referer
	};
	res.redirect(302, 'https://api.tudou.com/oauth2/authorize' + '?' + querystring.stringify(params));
});


app.get('connect', function(req, res, next){
	var config = tudou.config,
		params = {
			code		: req.query.code,
			client_secret: config.app_secret,
			grant_type	: 'authorization_code',
			client_id	: config.app_key
		};
	
	tudou.auth(req.query.code, function (err, data) {
	  //  ...
	});
});
````

### 调用API方法
````
var Tudou = require("tudou");
var tudouClient = new Tudou.Client("{{access_token}}", "{{app_key}}");

tudouClient.get('video/info', {'itemCodes' : 'K8rzcbEFxTk'}, function(err, response, body){
  // ...
});
````
