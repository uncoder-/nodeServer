
import http from 'http';

//自定义
import router from './src/router';

http.createServer(function (req, res) {
	
	// 过滤favicon.ico
	if (req.url == "/favicon.ico") {
		res.writeHead(204);
		res.end();
		return;
	}

	// 设置跨域
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'token');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (req.method == 'OPTIONS') {
		res.writeHead(204, { 'Content-Length': 0 });
		res.end();
		return;
	}

	//路由
	router(req, res);
}).listen('8888');

console.log('服务已启动 http://localhost:%d', 8888);