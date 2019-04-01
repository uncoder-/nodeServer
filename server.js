
import http from 'http';

//自定义
import router from './src/router'

http.createServer(function (req, res) {

	if (req.url == "/favicon.ico") { return };

	//路由
	router(req, res);
}).listen('8888');
console.log("服务器已就绪...");
console.log("http://localhost:8888")