var querystring = require('querystring'),
	_ = require('underscore'),
	request = require('request');

var Tudou = function(config) {
    if (!config) return false;
    this.config = config;
};

/**
 * 使用code换取access_token与用户ID
 */
Tudou.prototype.auth = function(code, callback) {
    if (!code)
    	return callback(new Error('code required'));
    if (typeof(code) !== 'string')
    	return callback(new Error('code must be string'));
    
    request.post('https://api.tudou.com/oauth2/access_token', {
	    	form : {
	    		code: code,
	    		client_id : this.config.app_key,
	    		client_secret : this.config.app_secret
	    	},
	    	json : true
	    }, function(err, response, body){
	        if (err)
	        	return callback(err);
	        
	        if (response.body.code !== 0)
	        	return callback(new Error(response.body.errorMessage));
	        
	        return callback(err, response.body);
	    });
};

Tudou.prototype.getClient = function(access_token){
	var client = new Tudou.Client(access_token, this.app_key);
	
	return client;
};

/**
 * 构造一个Tudou.Client实例
 * Tudou.Client用于在拥有access token的情况下访问土豆接口
 */
Tudou.Client = function(access_token, app_key){
	this.access_token = access_token;
	this.app_key = app_key;
};

Tudou.Client.prototype.get = function(path, data, callback){
	var url = 'https://api.tudou.com/v6/' + path;
		params = _.extend({
			app_key		: this.app_key,
			format		: 'json',
			access_token: this.access_token,
		}, data);
	
	url += '?' + querystring.stringify(params);
	
	request.get(url, {json : true}, callback);
};

Tudou.Client.prototype.post = function(path, data, callback){
	var url = 'https://api.tudou.com/v6/' + path,
		params = _.extend({
			app_key		: this.app_key,
			format		: 'json',
			access_token: this.access_token,
		}, data);
	
	request.post(url, {json : true, form:params}, callback);
};

module.exports = Tudou;
