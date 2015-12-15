//系统组件
import http from 'http'

//自定义组件
import Router from './lib/router'

http.createServer(function(req,res){
	if(req.url == "/favicon.ico"){ return};
	
	//路由
	Router(req,res);

}).listen('8888');

console.log("服务器已就绪...");